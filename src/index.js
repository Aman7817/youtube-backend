// dotenv is used to load environment variables from a .env file into process.env
import dotenv from "dotenv";

// Importing the function to connect to the MongoDB database (you probably defined this elsewhere)
import connectDB from "./db/index.js";
import {app} from './app.js'

// Load environment variables from './env' file
dotenv.config({
    path: './env' // This will load the environment variables from the './env' file
})

// Connect to the database and then start the server if successful
connectDB()
    .then(() => {
        // If DB connection is successful, start the server on the given port (from environment variable or fallback to 8000)
        app.listen(process.env.PORT || 8000, () => {
            // Print a message saying the server is up and running
            console.log(`Server is running at Port: ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        // If there's an error connecting to DB, log it
        console.log("MONGO DB connection failed!!!", err);
    });

/* This is an alternative approach (first approach you tried):
// Example of how you might do things manually with mongoose & express (old code, not used here)
import mongoose from "mongoose";
import { DB_NAME } from "./constants"; // DB_NAME is probably meant to hold the database name but it's unused here
import express from "express"; // Import express to create the HTTP server

const app = express(); // Set up express app

// Placeholder for future connectDB function (not actually used here)
// function connectDB(){
// }

(async () => {
    try {
        // Try to connect to the MongoDB using the URI stored in the environment variable
        await mongoose.connect(`${process.env.MONGODB_URI}`);

        // Handling server errors (e.g., connection issues or any internal errors)
        app.on("error", (error) => {
            console.log("ERROR:", error); // Log the error message
            throw error; // Propagate the error to be handled later
        });

        // Once connected to MongoDB, start the express server
        app.listen(process.env.PORT, () => {
            // Print a message confirming the server is running and listening on the specified port
            console.log(`App is Listening on port ${process.env.PORT}`);
        });

    } catch (error) {
        // If there’s an error in the DB connection or anywhere in the try block, log it
        console.error("ERROR", error);
        throw error; // Propagate the error further (helpful for handling in production)
    }
})();
*/
