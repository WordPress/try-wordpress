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
									destination: 'build/plugin/plugin.zip',
								},
							],
						},
					},
				} ),
			],
		},
	];
}

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
				// Copy the plugin into the extension directory.
				new CopyPlugin( {
					patterns: [
						{
							from: '**/*',
							context: 'build/plugin/',
							to: 'sidebar/plugin/',
						},
					],
				} ),
			],
		},
	];
}
