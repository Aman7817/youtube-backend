import { Router } from "express";  // Import Router from Express to define routes
import { registerUser,loginUser ,loggedoutUser } from "../controllers/user.controller.js";  // Import the registerUser controller function
import { upload } from "../middlewares/multer.middleware.js";  // Import multer middleware to handle file uploads

const router = Router();  // Create a new Express Router instance

// Define the '/register' route to handle POST requests for user registration
router.route('/register').post(registerUser)
    // // 'upload.fields' middleware handles the file uploads for both avatar and cover image
    // upload.fields([
    //     {
    //         name: "avatar",  // Field name for the avatar image
    //         maxCount: 1  // Limit to 1 file upload for the avatar
    //     },
    //     {
    //         name: "coverImage",  // Field name for the cover image
    //         maxCount: 1  // Limit to 1 file upload for the cover image
    //     }
    // ]),
    // After files are handled by multer middleware, call the registerUser function to handle user registration


router.route("/login").post(loginUser)

// secure route

router.route("/loggedOut").post(loggedoutUser)

// Export the router so it can be used in other parts of the application (e.g., app.js or server.js)
export default router;
