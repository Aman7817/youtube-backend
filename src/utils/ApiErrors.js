// Yo, this class is for custom error handling. It's basically an error object with extra info
class ApiError extends Error {
    /**
     * Constructor: This is where we create the custom error.
     * 
     * @param {number} statusCode - HTTP status code (e.g., 400 for bad request, 500 for server error).
     * @param {string} [message="Something went wrong"] - The error message (default is "Something went wrong").
     * @param {Array} [errors=[]] - An array to hold specific errors (like validation errors, etc.).
     * @param {string} [stack=""] - Optional stack trace if you want to pass it in directly (otherwise it gets generated automatically).
     */
    constructor(
        statusCode,
        message = "Something went wrong", // Default error message
        errors = [],                      // Default is an empty array for errors
        stack = ""                         // Optional: pass a custom stack trace or let it generate one
    ) {
        super(message);                    // Call the parent class (Error) constructor with the message

        this.statusCode = statusCode;      // Set the HTTP status code (e.g., 400, 500, etc.)
        this.data = null;                  // No data in errors by default, just the message and status
        this.message = message;            // Set the error message
        this.success = false;              // Success will be false for errors (obviously)
        this.errors = errors;              // Store the array of specific errors (like validation details)

        // If a custom stack trace is passed, use it, otherwise generate one automatically
        if (stack) {
            this.stack = stack;            // Use the provided stack trace
        } else {
            Error.captureStackTrace(this, this.constructor); // Automatically capture the stack trace
        }
    } // This part is for custom error handling. You can add more details if needed.
}

// Export the ApiError class so we can use it elsewhere
export { ApiError };
