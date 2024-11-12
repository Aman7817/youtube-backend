   // algorihtim
   
 //  get user details from fronted
  //    validation - not empty
  //    check if user alreday exists: username,email
  //    check for images,check for avtar
  //    upload them to cloudinary ,avtar
  //    create user object - create entry in db
  //    remove password and refers token field from response
  //    check for user creation 
  //  return res

import { asyncHandler } from "../utils/asyncHandler.js";  // Helper function to handle errors in async code
import { ApiError } from "../utils/ApiError.js";  // Custom error class to handle API errors
import { User } from "../models/user.model.js";  // Import the User model to interact with the database
import { uploadOnCloudinary } from "../utils/cloudinary.js";  // Utility to upload files to Cloudinary
import { ApiResponse } from "../utils/ApiResponse.js";  // Standard response format to send API responses

const registerUser = asyncHandler(async (req, res) => {

     // Extract the user's details from the request body (form data)
     const { fullname, email, username, password } = req.body;
     console.log("email", email);  // Debugging: log the email

     // Step 1: Check if all required fields are provided (fullname, email, username, password)
     if (
         [fullname, email, username, password].some((field) => field?.trim() === "")
     ) {
         throw new ApiError(400, "All fields are required");  // Error if any field is missing
     }

     // Step 2: Check if a user with the same email or username already exists
     const existingUser = await User.findOne({
         $or: [{ username }, { email }]  // Look for a user with either the same username or email
     });

     if (existingUser) {
         throw new ApiError(409, "User with this email or username already exists");  // Error if a user is found
     }

     // Step 3: Check if avatar and cover image files are uploaded
     const avatarLocalPath = req.files?.avtar[0]?.path;  // Get the local file path for avatar image
     const coverImageLocalPath = req.files?.coverImage[0]?.path;  // Get local file path for cover image

     if (!avatarLocalPath) {
         throw new ApiError(400, "Avatar image is required");  // Error if avatar image is missing
     }

     // Step 4: Upload the avatar and cover image to Cloudinary (cloud storage)
     const avatar = await uploadOnCloudinary(avatarLocalPath);  // Upload the avatar image
     const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;  // Upload the cover image if provided

     // Step 5: Check if the avatar upload failed
     if (!avatar) {
         throw new ApiError(404, "Failed to upload avatar image");  // Error if avatar upload fails
     }

     // Step 6: Create the new user in the database
     const newUser = await User.create({
         fullName: fullname,  // Save the full name
         avatar: avatar.url,  // Save the avatar image URL
         coverImage: coverImage?.url || "",  // Save the cover image URL (if provided, else empty string)
         email,  // Save the email
         password,  // Save the password (make sure it's hashed before saving in production)
         username: username.toLowerCase()  // Save the username in lowercase for consistency
     });

     // Step 7: Retrieve the newly created user from the database (exclude password and refresh token)
     const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

     // Step 8: Check if user creation failed
     if (!createdUser) {
         throw new ApiError(500, "Something went wrong while registering the user");  // Error if creation fails
     }

     // Step 9: Return a success response with the newly created user details
     return res.status(201).json(
         new ApiResponse(200, createdUser, "User registered successfully")  // Return a success message
     );
});

export { registerUser };
