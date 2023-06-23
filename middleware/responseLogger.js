//
const log = require('../util/logger');
const {colorize, ansiColors} = require('../util/colorizer');
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
	const errorLabel = isError ? colorize('Error:', ansiColors.red) : '';
	log(`${colorize('Time', ansiColors.magenta)}:  ${time}ms`);
	const logDetails = [
		colorize(req.method, ansiColors.green),
		colorize(req.originalUrl, ansiColors.dimYellow),
		`[${colorize('IP:', ansiColors.info)}${req.headers['x-forwarded-for'] || req.socket.remoteAddress}, `,
		`${colorize('User-Agent:', ansiColors.info)}${req.headers['user-agent']}, `,
		`${colorize('Body:', ansiColors.info)}${JSON.stringify(req.body)}]`,
	].join('');

	log(logDetails);

	if (isError) {
		log(`${errorLabel} [${res.statusCode}]: ${res.statusMessage}`);
	}
});

module.exports = { logResponseTime };
