const { log, debugLevels } = require("../util/logger");
const responseTime = require("response-time");

/**
 * Colorizes a keyword with the given color.
 * @param {string} keyword - The keyword to colorize.
 * @param {string} color - The color code to use.
 * @returns {string} The colorized keyword.
 */
const colorizeKeyword = (keyword, color) => {
  const resetCode = "\x1b[0m";
  return `${color}${keyword}${resetCode}`;
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

  // Colorized request information
  const requestInfo = `${colorizeKeyword(method, "\x1b[32m")} ${colorizeKeyword(originalUrl, "\x1b[33m")}`;

  // Extract additional details from the request
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const query = JSON.stringify(req.query);

  // Determine if the response is an error
  const isError = res.statusCode >= 400;
  const errorLabel = isError ? colorizeKeyword("Error:", "\x1b[31m") : "";

  // Log request information and error message if applicable
  log(requestInfo);
  if (isError) log(`${errorLabel} ${res.statusMessage}`);

  // Log additional details about the request
  const logDetails = `${colorizeKeyword("IP:", "\x1b[32m")} ${ip}, ${colorizeKeyword("User-Agent:", "\x1b[32m")} ${userAgent}, ${colorizeKeyword("Query:", "\x1b[32m")} ${query}`;
  log(logDetails, debugLevels.VERBOSE);
});

module.exports = { logResponseTime };
