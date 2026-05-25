const baseConfig = require( '@wordpress/scripts/config/jest-unit.config.js' );
const preset = require( '@wordpress/jest-preset-default/jest-preset.js' );

module.exports = {
	...baseConfig,
	setupFilesAfterEnv: [
		...( preset.setupFilesAfterEnv || [] ),
		'<rootDir>/tests/setup.js',
	],
};
