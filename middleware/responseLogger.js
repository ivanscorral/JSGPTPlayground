//
const log = require('../utils/logger');
const {colorize, consoleColors} = require('../utils/colorizer');
const responseTime = require('response-time');


/**
 * Colorizes a keyword with the given ANSI color code.
 *
 * @param {string} keyword The keyword to colorize.
 * @param {string} colorCode The ANSI color code.
 * @returns {string} The colorized keyword.
 */


/**
 * Logs the response time of an HTTP request.
 */
const logResponseTime = responseTime((req, res, time) => {
	const isError = res.statusCode >= 400;
	const errorLabel = isError ? colorize('Error:', consoleColors.red) : '';
	log(`${colorize('Time', consoleColors.magenta)}:  ${time}ms`);
	const logDetails = [
		colorize(req.method, consoleColors.green),
		colorize(req.originalUrl, consoleColors.dimYellow),
		`[${colorize('IP:', consoleColors.info)}${req.headers['x-forwarded-for'] || req.socket.remoteAddress}, `,
		`${colorize('User-Agent:', consoleColors.info)}${req.headers['user-agent']}, `,
		`${colorize('Body:', consoleColors.info)}${JSON.stringify(req.body)}]`,
	].join('');

	log(logDetails);

	if (isError) {
		log(`${errorLabel} [${res.statusCode}]: ${res.statusMessage}`);
	}
});

module.exports = { logResponseTime };
