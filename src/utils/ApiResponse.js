// Yo, this class is for sending API responses in a clean way
class ApiResponse {
    /**
     * Constructor: this is where we set up the response
     * 
     * @param {number} statusCode - The status of the request (e.g., 200 for success, 400 for error).
     * @param {any} data - The data you're sending back (could be an object, array, whatever).
     * @param {string} [message="Success"] - Optional message (default is "Success").
     */
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode; // HTTP status (like 200, 400, etc.)
        this.data = data;             // The actual data we're sending back to the client
        this.message = message;       // Custom message (but default is "Success" if no message is passed)
        
        // Here we check if the response is a success. Anything below 400 is a win.
        this.success = statusCode < 400; 
    }
}
