const path = require( 'node:path' );
const CopyPlugin = require( 'copy-webpack-plugin' );
const FileManagerPlugin = require( 'filemanager-webpack-plugin' );

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
	const targetPath = path.resolve( __dirname, 'build', 'extension', target );
	return [
		// Extension background script.
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
		// Extension content script.
		{
			mode,
			entry: './src/extension/content/index.js',
			output: {
				path: targetPath,
				filename: path.join( 'content', 'index.js' ),
			},
		},
		// Extension sidebar.
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
			],
		},
		// WordPress plugin.
		{
			mode,
			entry: './src/plugin/scripts/index.js',
			output: {
				path: targetPath,
				filename: path.join( 'sidebar', 'plugin', 'index.js' ),
			},
			plugins: [
				new CopyPlugin( {
					patterns: [
						{
							from: '**/*',
							context: 'src/plugin/',
							to: path.join( targetPath, 'sidebar', 'plugin' ),
							globOptions: {
								ignore: [ '**/scripts/**' ],
							},
						},
					],
				} ),
				// Create plugin.zip.
				new FileManagerPlugin( {
					events: {
						onEnd: {
							archive: [
								{
									source: path.join(
										targetPath,
										'sidebar',
										'plugin'
									),
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
			],
		},
	];
}
