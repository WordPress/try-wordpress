import { pasteHandler } from '@wordpress/blocks';
import { registerCoreBlocks } from '@wordpress/block-library';

export function cleanHtml( html: string ): string {
	init();
	return pasteHandler( {
		mode: 'INLINE',
		HTML: html,
	} );
}

let isInitialized = false;
function init() {
	if ( isInitialized ) {
		return;
	}
	registerCoreBlocks();
	isInitialized = true;
}
