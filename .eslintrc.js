module.exports = {
	env: {
		node: true,
		commonjs: true,
		es2021: true,
	},
	extends: 'eslint:recommended',
	parserOptions: {
		ecmaVersion: 'latest',
	},
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': 0,
		quotes: ['error', 'double'],
		semi: ['warn', 'always'],
	},
	overrides: [
		{
			files: ['**/*.js'],
			rules: {
				quotes: ['error', 'single'],
			},
		},
	],
};
