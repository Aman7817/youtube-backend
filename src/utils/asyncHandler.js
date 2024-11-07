// Yo, this is a helper function for handling async requests and errors in a clean way.
const asyncHandler = (requestHandler) => {
    // Return an async middleware function that wraps the request handler
    return (req, res, next) => {
        // Make sure the request handler returns a promise
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err)); // If the request handler throws an error, pass it to the next error handler
    };
};

export { asyncHandler };

// Different ways you could define the asyncHandler (but the above one is the best for clarity):
// const asyncHandler = () => {};         // Empty function (not useful here)
// const asyncHandler = (func) => {};     // Can also pass a function, but not as clear as the above
// const asyncHandler = (func) => async () => {}; // Another approach, but can get confusing

// Here's a more refined version using async/await to handle errors better
// const asyncHandle
