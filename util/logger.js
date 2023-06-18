/**
 * Object containing debug levels with corresponding integer values
 * @typedef {Object} DebugLevels
 * @property {number} NONE - 0
 * @property {number} BASIC - 1
 * @property {number} VERBOSE - 2
 * @property {number} ALL - 3
 */

const debugLevels = {
    NONE: 0,
    BASIC: 1,
    VERBOSE: 2,
    ALL: 3,
  };
  

  function getCurrentDebugLevel() {
    const currentDebugLevel = process.env.DEBUG_LEVEL || 'NONE';
    const level = debugLevels[currentDebugLevel.toUpperCase()];
    if (level === undefined) {
      throw new Error(`Invalid debug level: ${currentDebugLevel}`);
    }
  
    return level;
  }
  
  /**
   * Checks if the current debug level is greater than or equal to the minimum level specified
   *
   * @param {string} [minimumLevel='NONE'] - The minimum debug level required to log the message
   * @returns {boolean} Whether the message should be logged or not
   */
  function shouldLog(minDebugLevel = 'NONE') {
    const currentDebugLevel = getCurrentDebugLevel();
    if (currentDebugLevel === debugLevels.NONE) {
      return false;
    }
    if (currentDebugLevel === debugLevels.ALL) {
      return true;
    }
    const minDebugLevelValue = debugLevels[String(minDebugLevel).toUpperCase()] || 0;
    return currentDebugLevel >= minDebugLevelValue;;
  }
  
  /**
   * Logs a message if the current debug level is greater than or equal to the minimum level specified
   *
   * @param {string} message - The message to log
   * @param {string} [minimumLevel='NONE'] - The minimum debug level required to log the message
   */
  function log(message, minimumLevel = 'NONE') {
    if (shouldLog(minimumLevel)) {
      console.log(message);
    }
  }
  
  module.exports = { debugLevels, log };
  