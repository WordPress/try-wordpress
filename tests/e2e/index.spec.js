import { test } from '@playwright/test';
const { JSDOM } = require( 'jsdom' );

const { window } = new JSDOM( `<!DOCTYPE html><p>Hello world</p>` );
const { document } = window;
global.window = window;
global.navigator = {};
global.document = document;
Object.defineProperty( window, 'matchMedia', {
	writable: true,
	value: ( query ) => ( {
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {}, // Deprecated
		removeListener: () => {}, // Deprecated
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => {},
	} ),
} );

// This has to happen after all the shimming.
const { registerCoreBlocks } = require( '@wordpress/block-library' );

// Register core blocks
registerCoreBlocks();

test( 'has title', async ( { page } ) => {
	// Chrome is undefined so we need to define it
	await page.addInitScript( () => {
		window.chrome = {};
	} );

	await page.addInitScript( {
		path: './build/content/index.js',
	} );

	await page.goto( 'https://wordpress.org' );

	// Get the markup
	await page.evaluate( () => {
		const firstChild = document.body;

		return window.__PatternEverywhere.getContentsToCopy(
			window,
			firstChild
		);
	} );

	await page
		.locator( 'body' )
		.screenshot( { path: 'screenshot-initial.png' } );
} );
