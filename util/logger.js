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
  
  /**
   * Parses the debug level from the environment variable and converts it to an integer value
   *
   * @returns {number} The current debug level
   */
  function getCurrentDebugLevel() {
    const currentDebugLevel = process.env.DEBUG_LEVEL || 'NONE';
  
    return debugLevels[currentDebugLevel.toUpperCase()];
  }
  
  /**
   * Checks if the current debug level is greater than or equal to the minimum level specified
   *
   * @param {string} [minimumLevel='NONE'] - The minimum debug level required to log the message
   * @returns {boolean} Whether the message should be logged or not
   */
  function shouldLog(minimumLevel = 'NONE') {
    // Get the current debug level as an integer
    const currentDebugLevel = getCurrentDebugLevel();
    
    // Get the minimum level value
    const minimumLevelValue = debugLevels[String(minimumLevel).toUpperCase()] || 0;
  
    // Return true if the current debug level is greater than or equal to the minimum level value or is set to ALL
    return currentDebugLevel >= minimumLevelValue;
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
  