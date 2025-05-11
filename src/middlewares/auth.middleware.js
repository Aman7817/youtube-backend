import { ApiError } from "../utils/ApiError"; // Custom error class to handle API errors
import { asyncHandler } from "../utils/asyncHandler"; // Helper function to handle asynchronous errors
import jwt from "jsonwebtoken"; // Library to handle JSON Web Tokens (JWT)
import { User } from "../models/user.model.js"; // Import the User model to interact with the database

// Middleware to verify JWT and authenticate the user
export const verifyjwt = asyncHandler(async (req, res, next) => {
    try {
        // Step 1: Extract the token from cookies or authorization header
        const token = 
            req.cookies?.accessToken || // Check for token in cookies
            req.header("authorization")?.replace("Bearer", "").trim(); // Check for token in the authorization header

        // Step 2: If no token is provided, throw an unauthorized error
        if (!token) {
            throw new ApiError(401, "Unauthorized request. Token not provided.");
        }

        // Step 3: Verify the token using the secret key
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Step 4: Find the user associated with the token in the database
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // Step 5: If the user doesn't exist, throw an error
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // Step 6: Attach the user object to the request object for downstream use
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Catch any errors and throw an unauthorized error
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});
