const path = require( 'node:path' );
const CopyPlugin = require( 'copy-webpack-plugin' );

module.exports = function ( env ) {
	let targets = [ 'firefox', 'chrome' ];
	if ( env.target ) {
		targets = [ env.target ];
	}

	// We must always build for production because the development builds will have unsafe-eval in the code, which the
	// browsers don't like.
	const mode = 'production';

	let modules = [];
	for ( const target of targets ) {
		modules = modules.concat( extensionModules( mode, target ) );
	}

	return modules;
};

// Build the extension.
function extensionModules( mode, target ) {
	const targetPath = path.resolve( __dirname, 'build', target );
	const resolve = { extensions: [ '.ts', '.tsx', '.js' ] };
	const module = {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	};

	return [
		// Extension background script.
		{
			mode,
			resolve,
			module,
			entry: './src/background.ts',
			output: {
				path: targetPath,
				filename: path.join( 'background.js' ),
			},
			plugins: [
				new CopyPlugin( {
					patterns: [
						{
							from: `./src/assets/manifest-${ target }.json`,
							to: path.join( targetPath, 'manifest.json' ),
						},
						{
							from: './src/assets/icons',
							to: path.join( targetPath, 'icons' ),
						},
					],
				} ),
			],
		},
		// Extension content script.
		{
			mode,
			resolve,
			module,
			entry: './src/content.ts',
			output: {
				path: targetPath,
				filename: path.join( 'content.js' ),
			},
		},
		// The app.
		{
			mode,
			resolve,
			module,
			entry: './src/main.ts',
			output: {
				path: targetPath,
				filename: path.join( 'main.js' ),
			},
			plugins: [
				new CopyPlugin( {
					patterns: [
						{
							from: './src/main.html',
							to: path.join( targetPath, 'main.html' ),
						},
						{
							from: './src/main.css',
							to: path.join( targetPath, 'main.css' ),
						},
					],
				} ),
			],
		},
	];
}
