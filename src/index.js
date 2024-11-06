// require('dotenv').config({path:"./env"})

import dotenv from "dotenv"


import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})




connectDB()












/*  this is the first approach
// Importing mongoose for database connection and express for setting up the web server
import mongoose from "mongoose";
import { DB_NAME } from "./constants"; // DB_NAME is likely defined in the constants file, though it's unused here.

import express from "express"; // Importing express for creating an HTTP server
const app = express(); // Initialize an express app

// Placeholder for future connectDB function (currently not in use)
// function connectDB(){
// }

/// Connect to the database with a try-catch block for error handling
(async () => {
    try {
        // Attempt to connect to MongoDB using the URI from environment variables
        await mongoose.connect(`${process.env.MONGODB_URI}`);

        // Event listener for 'error' events in the express app (e.g., connection issues)
        app.on("error", (error) => {
            console.log("ERRR:", error); // Log the error details
            throw error; // Rethrow the error for further handling
        });

        // Once connected to MongoDB, start the express server
        app.listen(process.env.PORT, () => {
            // Log a message confirming the server is running and listening on the specified port
            console.log(`App is Listening on port ${process.env.PORT}`);
        });

    } catch (error) {
        // If there's an error in the connection or any subsequent operations, log it
        console.error("ERROR", error);
        throw error; // Propagate the error to be handled by higher-level processes (e.g., in a production environment)
    }
})();

*/