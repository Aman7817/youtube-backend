import { asyncHandler } from "../utils/asyncHandler.js"; // Helper function to handle errors in async code
import { ApiError } from "../utils/ApiError.js"; // Custom error class to handle API errors
import { User } from "../models/user.model.js"; // Import the User model to interact with the database
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Utility to upload files to Cloudinary
import { ApiResponse } from "../utils/ApiResponse.js"; // Standard response format to send API responses

// Function to generate access and refresh tokens for a user
const generateAccessAndRefreshToken = async (userId) => {
    try {
        // Fetch the user from the database using their ID
        const user = await User.findById(userId);

        // Generate access and refresh tokens using user-defined methods
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save the refresh token in the database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        // Return the tokens
        return { accessToken, refreshToken };
    } catch (error) {
        // Handle errors during token generation
        throw new ApiError(501, "Something went wrong while generating tokens");
    }
};

// Controller to register a new user
const registerUser = asyncHandler(async (req, res) => {
    // Extract user details from the request body
    const { fullname, email, username, password } = req.body;
    console.log("email", email); // Debugging: log the email

    // Step 1: Validate required fields
    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Step 2: Check if the user already exists
    const existingUser = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (existingUser) {
        throw new ApiError(409, "User with this email or username already exists");
    }

    // Step 3: Get file paths for avatar and cover images (if provided)
    const avatarLocalPath = req.files?.avtar[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    // Step 4: Upload avatar and cover images to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if (!avatar) {
        throw new ApiError(404, "Failed to upload avatar image");
    }

    // Step 5: Create the new user in the database
    const newUser = await User.create({
        fullName: fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    // Step 6: Fetch the newly created user (excluding sensitive fields)
    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Step 7: Respond with the user details
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
});

// Controller to log in a user
const loginUser = asyncHandler(async (req, res) => {
    // Extract login details from the request body
    const { username, email, password } = req.body;

    // Validate presence of username or email
    if (!username || !email) {
        throw new ApiError(400, "Username or email is required");
    }

    // Step 1: Find the user by username or email
    const user = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // Step 2: Validate the password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // Step 3: Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    // Step 4: Fetch the logged-in user's details (excluding sensitive fields)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Step 5: Set cookies for tokens and respond
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

// Controller to log out a user
const loggedoutUser = asyncHandler(async (req, res) => {
    // Remove the refresh token from the database
    await User.findByIdAndUpdate(
        req.user._id,
        { $set: { refreshToken: undefined } },
        { new: true }
    );

    // Clear cookies and respond
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie("accessToken", "", options)
        .cookie("refreshToken", "", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Export controllers
export { registerUser, loginUser, loggedoutUser };
