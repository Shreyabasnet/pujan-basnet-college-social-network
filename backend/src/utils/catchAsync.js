/**
 * Wrapper for async functions to catch any errors and pass them to the next middleware.
 */
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export default catchAsync;
