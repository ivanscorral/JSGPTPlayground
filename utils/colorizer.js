const consoleColors = {
	info: '\x1b[1;34m',
	reset: '\x1b[0m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	red: '\x1b[31m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
	white: '\x1b[37m',
	orange: '\x1b[33m',
	lightRed: '\x1b[1;31m',
	dimYellow: '\x1b[2;33m',
	lightGreen: '\x1b[1;32m',
};

const colorize = (text, color) => {
	return `${color}${text}${consoleColors.reset}`;
};

module.exports = { colorize, consoleColors };
