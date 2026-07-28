#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { readFileSync, realpathSync, statSync } from 'node:fs';
import path from 'node:path';

const EXPECTED_FIREFOX_ID = 'try-your-website-in-wordpress@wordpress.org';
const EXPECTED_FIREFOX_MIN_VERSION = '142.0';
const EXPECTED_DATA_COLLECTION = [ 'browsingActivity', 'websiteContent' ];
const EXPECTED_FIREFOX_WARNING = {
	code: 'UNSUPPORTED_API',
	message: 'sidePanel.setPanelBehavior is not supported',
	file: 'background.js',
	line: 1,
	column: 77,
};
const DEFAULT_BUILD_ROOT = path.resolve( 'build/production' );

const command = process.argv[ 2 ];

try {
	switch ( command ) {
		case 'references':
			validateReferences( readBuildRoot( process.argv.slice( 3 ) ) );
			break;
		case 'firefox-lint':
			requireNoArguments( process.argv.slice( 3 ) );
			validateFirefoxLint();
			break;
		default:
			throw new Error(
				'Usage: node scripts/validate-extension-builds.mjs <references [--root DIRECTORY] | firefox-lint>'
			);
	}
} catch ( error ) {
	console.error( `Extension validation failed: ${ error.message }` );
	process.exitCode = 1;
}

function readBuildRoot( args ) {
	if ( args.length === 0 ) {
		return DEFAULT_BUILD_ROOT;
	}
	if ( args.length !== 2 || args[ 0 ] !== '--root' || ! args[ 1 ] ) {
		throw new Error( 'references accepts only --root DIRECTORY' );
	}
	return path.resolve( args[ 1 ] );
}

function requireNoArguments( args ) {
	if ( args.length !== 0 ) {
		throw new Error( 'firefox-lint does not accept arguments' );
	}
}

function validateReferences( buildRoot ) {
	const results = [
		validateTarget( buildRoot, 'firefox' ),
		validateTarget( buildRoot, 'chrome' ),
	];

	for ( const result of results ) {
		console.log(
			`Validated ${ result.target } production manifest and ${ result.referenceCount } packaged references.`
		);
	}
}

function validateTarget( buildRoot, target ) {
	const targetRoot = path.join( buildRoot, target );
	const canonicalTargetRoot = readCanonicalTargetRoot( targetRoot, target );
	const manifestPath = path.join( targetRoot, 'manifest.json' );
	const manifest = readJsonFile( manifestPath );
	const references = [];

	if ( manifest.manifest_version !== 3 ) {
		throw new Error( `${ target } manifest_version must be 3` );
	}

	addContentScriptReferences( references, manifest.content_scripts );
	addBackgroundReferences( references, manifest.background, target );
	addIconReferences( references, manifest );

	if ( target === 'firefox' ) {
		validateFirefoxManifest( manifest );
		addRequiredReference(
			references,
			manifest.sidebar_action?.default_panel,
			'sidebar_action.default_panel',
			'page'
		);
	} else {
		addRequiredReference(
			references,
			manifest.side_panel?.default_path,
			'side_panel.default_path',
			'page'
		);
	}

	for ( const reference of references ) {
		validatePackagedReference(
			targetRoot,
			canonicalTargetRoot,
			target,
			reference
		);
	}

	return {
		target,
		referenceCount: references.length,
	};
}

function readCanonicalTargetRoot( targetRoot, target ) {
	try {
		return realpathSync( targetRoot );
	} catch ( error ) {
		throw new Error(
			`cannot resolve ${ target } package root ${ targetRoot }: ${ error.message }`
		);
	}
}

function readJsonFile( filePath ) {
	let source;
	try {
		source = readFileSync( filePath, 'utf8' );
	} catch ( error ) {
		throw new Error( `cannot read ${ filePath }: ${ error.message }` );
	}

	try {
		return JSON.parse( source );
	} catch ( error ) {
		throw new Error( `cannot parse ${ filePath}: ${ error.message }` );
	}
}

function addContentScriptReferences( references, contentScripts ) {
	if ( ! Array.isArray( contentScripts ) || contentScripts.length === 0 ) {
		throw new Error( 'content_scripts must be a non-empty array' );
	}

	contentScripts.forEach( ( contentScript, index ) => {
		addReferenceArray(
			references,
			contentScript.js,
			`content_scripts[${ index }].js`,
			'script'
		);
		if ( contentScript.css !== undefined ) {
			addReferenceArray(
				references,
				contentScript.css,
				`content_scripts[${ index }].css`,
				'stylesheet'
			);
		}
	} );
}

function addBackgroundReferences( references, background, target ) {
	if ( ! background || typeof background !== 'object' ) {
		throw new Error( 'background must be an object' );
	}

	const hasScripts = Object.hasOwn( background, 'scripts' );
	const hasServiceWorker = Object.hasOwn( background, 'service_worker' );

	if ( target === 'firefox' ) {
		if ( hasServiceWorker ) {
			throw new Error(
				'firefox background must not declare service_worker'
			);
		}
		addReferenceArray(
			references,
			background.scripts,
			'background.scripts',
			'script'
		);
		return;
	}

	if ( hasScripts ) {
		throw new Error( 'chrome background must not declare scripts' );
	}
	if ( ! hasServiceWorker ) {
		throw new Error(
			'chrome background must declare a non-empty service_worker'
		);
	}
	addRequiredReference(
		references,
		background.service_worker,
		'background.service_worker',
		'script'
	);
}

function addIconReferences( references, manifest ) {
	const iconObjects = [
		[ 'icons', manifest.icons ],
		[ 'action.default_icon', manifest.action?.default_icon ],
		[
			'sidebar_action.default_icon',
			manifest.sidebar_action?.default_icon,
		],
		[ 'side_panel.default_icon', manifest.side_panel?.default_icon ],
	];

	for ( const [ label, icons ] of iconObjects ) {
		if ( icons === undefined ) {
			continue;
		}
		if ( ! icons || typeof icons !== 'object' || Array.isArray( icons ) ) {
			throw new Error( `${ label } must be an object` );
		}
		for ( const [ size, icon ] of Object.entries( icons ) ) {
			addRequiredReference(
				references,
				icon,
				`${ label }.${ size }`,
				'icon'
			);
		}
	}
}

function addReferenceArray( references, values, label, kind ) {
	if ( ! Array.isArray( values ) || values.length === 0 ) {
		throw new Error( `${ label } must be a non-empty array` );
	}
	values.forEach( ( value, index ) => {
		addRequiredReference(
			references,
			value,
			`${ label }[${ index }]`,
			kind
		);
	} );
}

function addRequiredReference( references, value, label, kind ) {
	if ( typeof value !== 'string' || value.length === 0 ) {
		throw new Error( `${ label } must be a non-empty string` );
	}
	references.push( { value, label, kind } );
}

function validateFirefoxManifest( manifest ) {
	const gecko = manifest.browser_specific_settings?.gecko;
	if ( gecko?.id !== EXPECTED_FIREFOX_ID ) {
		throw new Error(
			`Firefox Gecko ID must be ${ EXPECTED_FIREFOX_ID }`
		);
	}
	if ( gecko.strict_min_version !== EXPECTED_FIREFOX_MIN_VERSION ) {
		throw new Error(
			`Firefox strict_min_version must be ${ EXPECTED_FIREFOX_MIN_VERSION }`
		);
	}
	if (
		Object.hasOwn(
			manifest.browser_specific_settings,
			'gecko_android'
		)
	) {
		throw new Error(
			'Firefox manifest must not declare gecko_android because this package is desktop-only'
		);
	}

	const required = gecko.data_collection_permissions?.required;
	if (
		! Array.isArray( required ) ||
		JSON.stringify( required ) !==
			JSON.stringify( EXPECTED_DATA_COLLECTION )
	) {
		throw new Error(
			`Firefox required data collection must be ${ EXPECTED_DATA_COLLECTION.join(
				', '
			) }`
		);
	}
}

function validatePackagedReference(
	targetRoot,
	canonicalTargetRoot,
	target,
	reference
) {
	const extension = path.posix.extname( reference.value );
	if ( ! extension ) {
		throw new Error(
			`${ target } ${ reference.label } is extensionless: ${ reference.value }`
		);
	}

	const expectedExtensions = {
		icon: [ '.png', '.jpg', '.jpeg', '.svg' ],
		page: [ '.html', '.htm' ],
		script: [ '.js', '.mjs' ],
		stylesheet: [ '.css' ],
	};
	if ( ! expectedExtensions[ reference.kind ].includes( extension ) ) {
		throw new Error(
			`${ target } ${ reference.label } has unexpected ${ reference.kind } extension: ${ reference.value }`
		);
	}

	if (
		path.posix.isAbsolute( reference.value ) ||
		reference.value.includes( '\\' )
	) {
		throw new Error(
			`${ target } ${ reference.label } must be a relative POSIX path: ${ reference.value }`
		);
	}

	const resolved = path.resolve( targetRoot, reference.value );
	if ( ! isContainedPath( targetRoot, resolved ) ) {
		throw new Error(
			`${ target } ${ reference.label } lexically escapes its package: ${ reference.value }`
		);
	}

	let canonicalReference;
	let stats;
	try {
		canonicalReference = realpathSync( resolved );
		stats = statSync( canonicalReference );
	} catch ( error ) {
		throw new Error(
			`${ target } ${ reference.label } is missing or has a broken link: ${ reference.value } (${ error.message })`
		);
	}
	if ( ! isContainedPath( canonicalTargetRoot, canonicalReference ) ) {
		throw new Error(
			`${ target } ${ reference.label } canonically escapes its package: ${ reference.value }`
		);
	}
	if ( ! stats.isFile() ) {
		throw new Error(
			`${ target } ${ reference.label } is not a file: ${ reference.value }`
		);
	}
}

function isContainedPath( root, candidate ) {
	const relative = path.relative( root, candidate );
	return (
		relative !== '..' &&
		! relative.startsWith( `..${ path.sep }` ) &&
		! path.isAbsolute( relative )
	);
}

function validateFirefoxLint() {
	const args = [
		'lint',
		'--source-dir',
		path.join( 'build', 'production', 'firefox' ),
		'--ignore-files',
		'app.js',
		'--output',
		'json',
		'--no-config-discovery',
	];
	const webExtExecutable = path.resolve(
		'node_modules',
		'web-ext',
		'bin',
		'web-ext.js'
	);
	const result = spawnSync( process.execPath, [ webExtExecutable, ...args ], {
		encoding: 'utf8',
	} );

	if ( result.error ) {
		throw new Error( `cannot run web-ext: ${ result.error.message }` );
	}

	let report;
	try {
		report = JSON.parse( result.stdout );
	} catch ( error ) {
		throw new Error(
			`cannot parse web-ext JSON output: ${ error.message }\n${ result.stdout }\n${ result.stderr }`
		);
	}

	const errors = Array.isArray( report.errors ) ? report.errors : [];
	const notices = Array.isArray( report.notices ) ? report.notices : [];
	const warnings = Array.isArray( report.warnings ) ? report.warnings : [];

	if (
		result.status !== 0 ||
		errors.length !== 0 ||
		notices.length !== 0 ||
		warnings.length !== 1 ||
		! matchesExpectedFirefoxWarning( warnings[ 0 ] )
	) {
		throw new Error(
			`unexpected Firefox lint diagnostics (exit ${ result.status }, errors ${ formatCodes(
				errors
			) }, notices ${ formatCodes( notices ) }, warnings ${ formatCodes(
				warnings
			) })`
		);
	}

	console.log(
		`Firefox manifest lint passed with zero errors and the single allowed ${ EXPECTED_FIREFOX_WARNING.code } warning at ${ EXPECTED_FIREFOX_WARNING.file }:${ EXPECTED_FIREFOX_WARNING.line }:${ EXPECTED_FIREFOX_WARNING.column }; only app.js was ignored.`
	);
}

function matchesExpectedFirefoxWarning( warning ) {
	return Object.entries( EXPECTED_FIREFOX_WARNING ).every(
		( [ key, expectedValue ] ) => warning[ key ] === expectedValue
	);
}

function formatCodes( diagnostics ) {
	if ( diagnostics.length === 0 ) {
		return 'none';
	}
	return diagnostics
		.map( ( diagnostic ) => diagnostic.code || 'UNKNOWN' )
		.sort()
		.join( ', ' );
}
