const debugLevels = {
    NONE: 0,
    BASIC: 1,
    VERBOSE: 2,
    ALL: 3,
  };
  
  function log(message, minimumLevel = debugLevels.NONE) {
    const minimumLevelValue = debugLevels[minimumLevel];
    const currentDebugLevel = process.env.DEBUG_LEVEL || 0;
    if (currentDebugLevel && (currentDebugLevel >= minimumLevelValue || currentDebugLevel === debugLevels.ALL)) {
      console.log(message);
    }
  }
  
  module.exports = {debugLevels, log};