
// Importing mongoose to connect to MongoDB and DB_NAME from constants for the database name

import mongoose from "mongoose";




import { DB_NAME } from "../constants.js";  // DB_NAME is the name of the MongoDB database

// Function to connect to MongoDB, returning a promise that resolves when the connection is established
const connectDB = async () => {
    try {
        // Here we're connecting to the MongoDB server. The connection string consists of the base URI (process.env.MONGODB_URI) + the DB_NAME.
        // process.env.MONGODB_URI should have the server's URI (like the host and port), while DB_NAME holds the name of the database to connect to.
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}` // Build the full URI with database name
        );

        // If the connection is successful, log the host of the MongoDB server
        // This gives us information about where the MongoDB instance is hosted (useful for debugging and monitoring).
        console.log(`MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);

    } catch (error) {
        // If there's an error (e.g., invalid connection URI, unreachable server), this block catches it
        // Log the error message to understand what went wrong when connecting to the database.
        console.log("MONGODB connection Failed", error);

        // Exit the process with an error code (1) because if we can't connect to the DB, we can't proceed with the app.
        // This is important in production environments to ensure the app doesn't continue running without a valid DB connection.
        process.exit(1);
    }
};

// Export the connectDB function so we can call it in other parts of the application
// Typically, this will be imported and used in the server startup script to ensure the DB is connected before starting the app.
export default connectDB;
