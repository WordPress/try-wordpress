const path = require( 'node:path' );
const { execSync } = require( 'child_process' );
const CopyPlugin = require( 'copy-webpack-plugin' );
const { TsconfigPathsPlugin } = require( 'tsconfig-paths-webpack-plugin' );
const FileManagerPlugin = require( 'filemanager-webpack-plugin' );
const webpack = require( 'webpack' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

const SCHEMA_SRC = './schema/schema.json';
const SCHEMA_OUTPUT_NAME = 'schema.json';
const SCHEMA_SRC_PATH = path.resolve( __dirname, SCHEMA_SRC );
const SCHEMA_PLUGIN_PATH = path.resolve(
	__dirname,
	'src/plugin/',
	SCHEMA_OUTPUT_NAME
);

module.exports = function ( env ) {
	let targets = [ 'firefox', 'chrome' ];
	const mode = env.mode || 'development';

	// Validate environment.
	if ( mode === 'production' && ! env.target ) {
		throw new Error(
			'Production builds require a target. Use --env target=firefox or --env target=chrome'
		);
	}

	// Set target(s).
	if ( env.target ) {
		targets = [ env.target ];
	}

	// Build schema/schema.json.
	execSync( './schema/build.mjs', { stdio: 'inherit' } );

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
		alias: {
			'fast-deep-equal/es6$': require.resolve(
				'fast-deep-equal/es6'
			),
		},
		extensions: [ '.ts', '.tsx', '.js' ],
		plugins: [ new TsconfigPathsPlugin() ],
	};
	const module = {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
			},
			{
				// If you enable `experiments.css` or `experiments.futureDefaults`, please uncomment line below
				// type: "javascript/auto",
				test: /\.(sa|sc|c)ss$/i,
				use: [
					mode === 'production'
						? MiniCssExtractPlugin.loader
						: 'style-loader',
					'css-loader',
					'postcss-loader',
					'sass-loader',
				],
			},
		],
	};

	const watchOptions = {
		ignored: [ SCHEMA_SRC_PATH, SCHEMA_PLUGIN_PATH ],
	};

	const webExtensionPolyfillPlugin = new webpack.ProvidePlugin( {
		browser: 'webextension-polyfill',
	} );

	const envPlugin = new webpack.DefinePlugin( {
		'process.env.OPFS_ENABLED': JSON.stringify(
			mode === 'production' ? 'true' : 'false'
		),
		'process.env.LOG_REQUESTS': JSON.stringify(
			mode === 'development' ? 'true' : 'false'
		),
	} );

	return [
		// Extension background script.
		{
			mode,
			devtool,
			resolve,
			module,
			entry: [ 'webextension-polyfill', './src/extension/background.ts' ],
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
				webExtensionPolyfillPlugin,
				envPlugin,
			],
			watchOptions,
		},
		// Extension content script.
		{
			mode,
			devtool,
			resolve,
			module,
			entry: [ 'webextension-polyfill', './src/extension/content.ts' ],
			output: {
				path: targetPath,
				filename: path.join( 'content.js' ),
			},
			plugins: [ webExtensionPolyfillPlugin, envPlugin ],
			watchOptions,
		},
		// The app.
		{
			mode,
			devtool,
			resolve,
			module,
			entry: [ 'webextension-polyfill', './src/ui/main.ts' ],
			output: {
				path: targetPath,
				filename: path.join( 'app.js' ),
			},
			optimization: {
				splitChunks: {
					cacheGroups: {
						vips: {
							test: /[\\/]node_modules[\\/]@wordpress[\\/]vips[\\/]/,
							chunks: 'all',
							name: 'main',
							enforce: true,
						},
					},
				},
			},
			plugins: [
				new EmitSubjectsSchemaPlugin(),
				new CopyPlugin( {
					patterns: [
						{
							from: './src/ui/app.html',
							to: path.join( targetPath, 'app.html' ),
						},
						{
							from: '**/*',
							context: 'src/plugin/',
							globOptions: {
								ignore: [ '**/plugin/vendor/**/*' ],
							},
							to: path.join( targetPath, 'plugin' ),
						},
						{
							from: SCHEMA_SRC,
							to: path.join(
								targetPath,
								'plugin',
								SCHEMA_OUTPUT_NAME
							),
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
				webExtensionPolyfillPlugin,
				envPlugin,
			].concat(
				mode === 'production' ? [ new MiniCssExtractPlugin() ] : []
			),
			watchOptions,
		},
	];
}

class EmitSubjectsSchemaPlugin {
	apply( compiler ) {
		compiler.hooks.compilation.tap(
			'EmitSubjectsSchemaPlugin',
			( compilation ) => {
				compilation.hooks.processAssets.tapAsync(
					{
						name: 'EmitSubjectsSchemaPlugin',
						stage: webpack.Compilation
							.PROCESS_ASSETS_STAGE_ADDITIONAL,
					},
					async ( assets, callback ) => {
						execSync( './schema/build.mjs', { stdio: 'inherit' } );
						callback();
					}
				);
			}
		);
	}
}
