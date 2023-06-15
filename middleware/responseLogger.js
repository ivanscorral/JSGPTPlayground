
// responseLogger.js
const responseTime = require('response-time');

const responseLogger = responseTime((req, res, time) => {
  console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${time}ms`);
});

module.exports = { responseLogger };