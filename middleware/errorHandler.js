// middleware/errorHandler.js

/**
 * Express middleware for handling errors.
 * @param {Error} err - The error object.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next function.
 */
function errorHandler(err, req, res, next) {
	console.error(err.stack); // Log error stack to console

	const statusCode = err.statusCode || 500;
	const errorMessage = err.message || 'Internal Server Error';

	// Send error response
	res.status(statusCode).json({
		status: 'error',
		statusCode,
		message: errorMessage,
	});
}

module.exports = errorHandler;
