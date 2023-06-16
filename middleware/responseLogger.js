// logResponseTime.js
const { log, debugLevels } = require('../util/logger');
const responseTime = require("response-time");

const logResponseTime = responseTime((req, res, time) => {
  console.log(debugLevels.BASIC);
  log(`${req.method} ${req.originalUrl} ${res.statusCode} ${time}ms`, debugLevels.NONE);
});

module.exports = { logResponseTime };
