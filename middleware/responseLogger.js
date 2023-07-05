const log = require('../utils/logger');
const { colorize } = require('../utils/colorizer');
const responseTime = require('response-time');

/**
 * Logs the response time of an HTTP request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {number} time - The response time in milliseconds.
 */
const logResponseTime = responseTime((req, res, time) => {
	const isError = res.statusCode >= 400;
	const localTime = new Date().toLocaleTimeString();

	// Log the response time with system time
	log.basic(`[${localTime}] Response Time: ${colorize.highlight(`${time}ms`)}`);

	// Log request details
	const logDetails = [
		colorize.success(req.method),
		colorize.highlight(req.originalUrl),
		`[${colorize.info('IP:')} ${
			req.headers['x-forwarded-for'] || req.socket.remoteAddress
		}, `,
		`${colorize.info('User-Agent:')} ${req.headers['user-agent']}, `,
		`${colorize.info('Body:')} ${JSON.stringify(req.body)}]`,
	].join(' ');

	log.basic(`[${localTime}] Request Details: ${logDetails}`);

	// Log error details if the response status code indicates an error
	if (isError) {
		log.error(`[${localTime}] Error [${res.statusCode}]: ${res.statusMessage}`);
	}
});

module.exports = { logResponseTime };
