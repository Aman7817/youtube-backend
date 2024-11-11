//

// Importing necessary dependencies
import express from "express";           // Express framework for creating the server
import cors from "cors";                 // CORS middleware to handle cross-origin requests
import cookieParser from "cookie-parser"; // Cookie parser to handle cookies in requests

// Initialize an Express application
const app = express();
 
// Enable Cross-Origin Resource Sharing (CORS)
// CORS allows the backend to accept requests from specified origins (e.g., frontend)
app.use(cors({
    origin: process.env.CORS_ORIGIN,    // The allowed origin for requests (usually the frontend URL)
    credentials: true                   // Allows cookies and credentials to be sent with requests
}));

// Middleware to parse JSON bodies in incoming requests
// The 'limit' option restricts the maximum size of the JSON payload
app.use(express.json({ limit: "20kb" }));

// Middleware to parse URL-encoded data in requests (e.g., form submissions)
// 'extended' allows you to send complex objects, 'limit' restricts the payload size
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

// Serve static files from the 'public' directory
// This allows you to serve images, CSS files, JavaScript files, etc., from the 'public' folder
app.use(express.static('public')); // 'kuch bhe images ya or kuch bhe rakh ne ke liye' (comment in Urdu)

// Middleware to parse cookies from incoming requests
app.use(cookieParser()); // To access cookies sent by the client in `req.cookies`


// routes import 

import  userRouter  from './routes/user.routes.js'


/// rouets declaration 
app.use("/api/v1/users",userRouter)


// http://localhost:8000/api/v1/users/register

// Export the app so it can be used in other files (e.g., for routing or starting the server)
export { app };
