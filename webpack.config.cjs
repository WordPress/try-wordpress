const path = require( 'node:path' );
const CopyPlugin = require( 'copy-webpack-plugin' );
const { TsconfigPathsPlugin } = require( 'tsconfig-paths-webpack-plugin' );
const FileManagerPlugin = require( 'filemanager-webpack-plugin' );

module.exports = function ( env ) {
	let targets = [ 'firefox', 'chrome' ];
	if ( env.target ) {
		targets = [ env.target ];
	}

	const mode = env.mode || 'development';

	let modules = [];
	for ( const target of targets ) {
		modules = modules.concat( extensionModules( mode, target ) );
	}

	return modules;
};

// Build the extension.
function extensionModules( mode, target ) {
	let outputDir = path.resolve( __dirname, 'build' );
	if ( mode === 'production' ) {
		outputDir = path.resolve( outputDir, 'production' );
	}
	const targetPath = path.resolve( outputDir, target );

	const devtool = mode === 'production' ? false : 'cheap-module-source-map';
	const resolve = {
		extensions: [ '.ts', '.tsx', '.js' ],
		plugins: [ new TsconfigPathsPlugin() ],
	};
	const module = {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
			},
		],
	};

	return [
		// Extension background script.
		{
			mode,
			devtool,
			resolve,
			module,
			entry: './src/extension/background.ts',
			output: {
				path: targetPath,
				filename: path.join( 'background.js' ),
			},
			plugins: [
				new CopyPlugin( {
					patterns: [
						{
							from: `./src/extension/manifest-${ target }.json`,
							to: path.join( targetPath, 'manifest.json' ),
						},
						{
							from: './src/extension/icons',
							to: path.join( targetPath, 'icons' ),
						},
					],
				} ),
			],
		},
		// Extension content script.
		{
			mode,
			devtool,
			resolve,
			module,
			entry: './src/extension/content.ts',
			output: {
				path: targetPath,
				filename: path.join( 'content.js' ),
			},
		},
		// The app.
		{
			mode,
			devtool,
			resolve,
			module,
			entry: './src/ui/main.ts',
			output: {
				path: targetPath,
				filename: path.join( 'app.js' ),
			},
			plugins: [
				new CopyPlugin( {
					patterns: [
						{
							from: './src/ui/app.html',
							to: path.join( targetPath, 'app.html' ),
						},
						{
							from: './src/ui/app.css',
							to: path.join( targetPath, 'app.css' ),
						},
					],
				} ),
				new CopyPlugin( {
					patterns: [
						{
							from: '**/*',
							context: 'src/plugin/',
							globOptions: {
								ignore: [ '**/plugin/vendor/**/*' ],
							},
							to: path.join( targetPath, 'plugin' ),
						},
					],
				} ),
				// Create plugin.zip.
				new FileManagerPlugin( {
					events: {
						onEnd: {
							archive: [
								{
									source: path.join( targetPath, 'plugin' ),
									destination: path.join(
										targetPath,
										'plugin.zip'
									),
								},
							],
						},
					},
				} ),
			],
		},
	];
}
