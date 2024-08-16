const path = require( 'node:path' );
const CopyPlugin = require( 'copy-webpack-plugin' );
const FileManagerPlugin = require( 'filemanager-webpack-plugin' );

module.exports = function () {
	// We must always build for production because the development builds will have unsafe-eval in the code, which the
	// browsers don't like.
	const mode = 'production';

	let modules = [].concat( pluginModules( mode ) );
	for ( const target of [ 'firefox', 'chrome' ] ) {
		modules = modules.concat( extensionModules( mode, target ) );
	}

	return modules;
};

// Build the WordPress plugin and create a zip file of the built plugin directory.
function pluginModules( mode ) {
	const targetPath = path.resolve( __dirname, 'build', 'plugin' );
	return [
		{
			mode,
			entry: './src/plugin/scripts/index.js',
			output: {
				path: targetPath,
				filename: path.join( 'scripts', 'index.js' ),
			},
			plugins: [
				new CopyPlugin( {
					patterns: [
						{
							from: '**/*',
							context: 'src/plugin/',
							globOptions: {
								ignore: [ '**/scripts/**' ],
							},
						},
					],
				} ),
				new FileManagerPlugin( {
					events: {
						onEnd: {
							archive: [
								{
									source: 'build/plugin',
									destination: 'build/plugin.zip',
								},
							],
						},
					},
				} ),
			],
		},
	];
}

// Build the extension.
function extensionModules( mode, target ) {
	const targetPath = path.resolve( __dirname, 'build', 'extension', target );
	return [
		{
			mode,
			entry: './src/extension/background/index.js',
			output: {
				path: targetPath,
				filename: path.join( 'background', 'index.js' ),
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
		{
			mode,
			entry: './src/extension/content/index.js',
			output: {
				path: targetPath,
				filename: path.join( 'content', 'index.js' ),
			},
		},
		{
			mode,
			entry: './src/extension/sidebar/index.js',
			output: {
				path: targetPath,
				filename: path.join( 'sidebar', 'index.js' ),
			},
			plugins: [
				new CopyPlugin( {
					patterns: [
						{
							from: './src/extension/sidebar/sidebar.html',
							to: path.join(
								targetPath,
								'sidebar',
								'sidebar.html'
							),
						},
						{
							from: './src/extension/sidebar/sidebar.css',
							to: path.join(
								targetPath,
								'sidebar',
								'sidebar.css'
							),
						},
					],
				} ),
				// Copy plugin.zip into the extension directory.
				new FileManagerPlugin( {
					events: {
						onEnd: {
							copy: [
								{
									source: 'build/plugin.zip',
									destination: path.join(
										targetPath,
										'sidebar',
										'plugin.zip'
									),
								},
							],
						},
					},
				} ),
				// Sadly, web-ext doesn't reload the extension when plugin.zip is modified.
				// To work around that, we copy the plugin directory to the extension, and then immediately delete it.
				new CopyPlugin( {
					patterns: [
						{
							from: '**/*',
							context: 'build/plugin/',
							to: 'sidebar/plugin/',
						},
					],
				} ),
				new FileManagerPlugin( {
					events: {
						onEnd: {
							delete: [
								path.join( targetPath, 'sidebar', 'plugin' ),
							],
						},
					},
				} ),
			],
		},
	];
}
