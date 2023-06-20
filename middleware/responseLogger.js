const log = require("../util/logger");
const responseTime = require("response-time");
const chalk = require("chalk");

/**
 * Colorizes a keyword with the given color.
 * @param {string} keyword - The keyword to colorize.
 * @param {Function} colorFn - The chalk color function to use.
 * @returns {string} The colorized keyword.
 */
const colorizeKeyword = (keyword, colorFn) => {
  return colorFn(keyword);
};

/**
 * Logs the response time of an HTTP request.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {number} time - The response time in milliseconds.
 */
const logResponseTime = responseTime((req, res, time) => {
  // Extract pertinent request information
  const { method, originalUrl } = req;

  // Colorize request information
  const coloredMethod = colorizeKeyword(method, chalk.green);
  const coloredUrl = colorizeKeyword(originalUrl, chalk.yellow);
  const requestInfo = `${coloredMethod} ${coloredUrl}`;

  // Extract additional details from the request
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const query = req.query; // Avoid unnecessary JSON.stringify

  // Determine if the response is an error
  const isError = res.statusCode >= 400;
  const errorLabel = isError ? colorizeKeyword("Error:", chalk.red) : "";

  // Log request information and error message if applicable
  log(requestInfo);
  if (isError) log(`${errorLabel} ${res.statusMessage}`);

  // Log additional details about the request
  const coloredIp = colorizeKeyword("IP:", chalk.green);
  const coloredUserAgent = colorizeKeyword("User-Agent:", chalk.green);
  const coloredQuery = colorizeKeyword("Query:", chalk.green);
  const logDetails = `${coloredIp} ${ip}, ${coloredUserAgent} ${userAgent}, ${coloredQuery} ${JSON.stringify(query)}`;
  log(logDetails);
});

module.exports = { logResponseTime };
