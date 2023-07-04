/**
 * Module for defining console colors and colorizing text for console output.
 * @module colorizer
 */

/**
 * @typedef {Object} ConsoleColors
 * @property {string} info - Bright White.
 * @property {string} defaultReset - Reset color.
 * @property {string} success - Green.
 * @property {string} successLight - Bright Green.
 * @property {string} warning - Yellow.
 * @property {string} warningLight - Bright Yellow.
 * @property {string} error - Red.
 * @property {string} errorLight - Bright Red.
 * @property {string} highlight - Magenta.
 * @property {string} accent - Cyan.
 * @property {string} light - White.
 * @property {string} blue - Blue.
 */

/**
 * @type {ConsoleColors}
 */
const consoleColors = {
	info: '\x1b[1;37m',
	defaultReset: '\x1b[0m',
	success: '\x1b[32m',
	successLight: '\x1b[1;32m',
	warning: '\x1b[33m',
	warningLight: '\x1b[1;33m',
	error: '\x1b[31m',
	errorLight: '\x1b[1;31m',
	highlight: '\x1b[35m',
	accent: '\x1b[36m',
	light: '\x1b[37m',
	blue: '\x1b[34m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	red: '\x1b[31m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
	white: '\x1b[37m',
};

/**
 * Wrap text in ANSI escape codes for colorized console output.
 * @param {string} text - The text to colorize.
 * @param {string} color - ANSI escape code for the color.
 * @returns {string} Colorized text.
 */
function colorize(text, color) {
	return `${color}${text}${consoleColors.defaultReset}`;
}
/**
 * Colorizes the given text as an error message.
 * @function
 * @param {string} text - The text to be colorized.
 * @returns {string} The text colorized as an error message.
 */
colorize.error = (text) => colorize(text, consoleColors.error);

/**
 * Colorizes the given text as an info message.
 * @function
 * @param {string} text - The text to be colorized.
 * @returns {string} The text colorized as an info message.
 */
colorize.info = (text) => colorize(text, consoleColors.info);

/**
 * Colorizes the given text as a warning message.
 * @function
 * @param {string} text - The text to be colorized.
 * @returns {string} The text colorized as a warning message.
 */
colorize.warn = (text) => colorize(text, consoleColors.warning);

/**
 * Colorizes the given text as a success message.
 * @function
 * @param {string} text - The text to be colorized.
 * @returns {string} The text colorized as a success message.
 */
colorize.success = (text) => colorize(text, consoleColors.success);

/**
 * Colorizes the given text with a highlight color.
 * @function
 * @param {string} text - The text to be colorized.
 * @returns {string} The text colorized with a highlight color.
 */
colorize.highlight = (text) => colorize(text, consoleColors.highlight);

module.exports = { colorize, consoleColors };
