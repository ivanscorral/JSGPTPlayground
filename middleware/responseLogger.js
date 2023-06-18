const { log, debugLevels } = require("../util/logger");
const responseTime = require("response-time");

/**
 * Returns a string with the given message and color.
 * @param {string} message - The message to colorize.
 * @param {string} color - The color code to use.
 * @returns {string} The colorized message.
 */
const colorize = (message, color) => {
  const resetCode = "\x1b[0m";
  return `${color}${message}${resetCode}`;
};

/**
 * Logs the response time of an HTTP request.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {number} time - The response time in milliseconds.
 */
const logResponseTime = responseTime((req, res, time) => {
  const requestInfo = `${colorize(req.method, "\x1b[32m")} ${colorize(
    req.originalUrl,
    "\x1b[33m"
  )}`;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const query = JSON.stringify(req.query);

  if (res.statusCode >= 400) {
    // Log request info and error message if the status code is >= 400.
    log(colorize(requestInfo, "\x1b[32m"));
    log(colorize("Error: ", "\x1b[31m") + res.statusMessage);
  } else {
    // Log request info if the status code is < 400.
    log(colorize(requestInfo, "\x1b[32m"));
  }

  // Log additional details about the request.
  const logDetails = `${colorize("IP:", "\x1b[32m")} ${ip}, ${colorize(
    "User-Agent:",
    "\x1b[32m"
  )} ${userAgent}, ${colorize("Query:", "\x1b[32m")} ${query}`;
  log(logDetails, debugLevels.VERBOSE);
});

module.exports = { logResponseTime };
