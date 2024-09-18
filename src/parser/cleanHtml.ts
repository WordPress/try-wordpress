import { pasteHandler, serialize } from '@wordpress/blocks';
import { registerCoreBlocks } from '@wordpress/block-library';

export function cleanHtml( html: string ): string {
	init();
	const blocks = pasteHandler( {
		mode: 'BLOCKS',
		HTML: html,
	} );
	return serialize( blocks );
}

let isInitialized = false;
function init() {
	if ( isInitialized ) {
		return;
	}
	registerCoreBlocks();
	isInitialized = true;
}
