import { pasteHandler, serialize } from '@wordpress/blocks';

export function parsePostContent( html: string ): string {
	const blocks = pasteHandler( {
		mode: 'BLOCKS',
		HTML: html,
	} );
	return serialize( blocks );
}
