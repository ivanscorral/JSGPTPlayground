const log = require('../utils/logger');
const { colorize, consoleColors } = require('../utils/colorizer');
const responseTime = require('response-time');

/**
 * Logs the response time of an HTTP request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {number} time - The response time in milliseconds.
 */
const logResponseTime = responseTime((req, res, time) => {
	const isError = res.statusCode >= 400;
	const errorLabel = isError ? colorize.error('Error:') : '';

	// Log the response time
	log(`${colorize.highlight('Time', consoleColors.highlight)}:  ${time}ms`);

	// Log request details
	const logDetails = [
		colorize(req.method, consoleColors.green),
		colorize(req.originalUrl, consoleColors.lightWarning),
		`[${colorize.info('IP:')}${
			req.headers['x-forwarded-for'] || req.socket.remoteAddress
		}, `,
		`${colorize.info('User-Agent:')}${req.headers['user-agent']}, `,
		`${colorize.info('Body:')}${JSON.stringify(req.body)}]`,
	].join('');

	log(logDetails);

	// Log error details if the response status code indicates an error
	if (isError) {
		log(`${errorLabel} [${res.statusCode}]: ${res.statusMessage}`);
	}
});

module.exports = { logResponseTime };
