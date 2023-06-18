const { log, debugLevels } = require('../util/logger');
const responseTime = require("response-time");

const logResponseTime = responseTime((req, res, time) => {
  log(`${req.method} ${req.originalUrl} ${res.statusCode} ${time}ms`, debugLevels.ALL);
});

module.exports = { logResponseTime };
