/**
 * Object containing debug levels with corresponding integer values
 * @typedef {Object} DebugLevels
 * @property {number} NONE - 0
 * @property {number} BASIC - 1
 * @property {number} VERBOSE - 2
 * @property {number} ALL - 3
 */

/**
 * Returns whether the current debug level is greater than or equal to the given level.
 * @param {number} level - The level to compare to the current debug level.
 * @returns {boolean} Whether the current debug level is greater than or equal to the given level.
 */
function shouldLog(level) {
  if (debugLevels[envDebugLevel] === debugLevels.ALL) {
    return true;
  }
  return debugLevels[envDebugLevel] >= level;
}

const debugLevels = {
  NONE: 0,
  BASIC: 1,
  VERBOSE: 2,
  ALL: 3,
};

const envDebugLevel = process.env.DEBUG_LEVEL || 'NONE';

/**
 * Object containing functions for logging at different levels based on the current debug level.
 */
function log(message) {
  if (shouldLog(debugLevels.NONE)) {
    console.info(message);
  }
}

log.basic = function(message) {
  if (shouldLog(debugLevels.BASIC)) {
    console.info(message);
  }
};

log.verbose = function(message) {
  if (shouldLog(debugLevels.VERBOSE)) {
    console.info(message);
  }
};

log.all = function(message) {
  console.info(message);
};

module.exports = log;


module.exports = log;
