const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );
const entry = {
	'wasm-encoder': path.resolve( process.cwd(), `src/wasm-encoder.js` ),
};

module.exports = {
	...defaultConfig,
	entry,
	output: {
		path: path.join( __dirname, './build' ),
	},
};
