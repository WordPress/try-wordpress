import { pasteHandler, serialize } from '@wordpress/blocks';

export function cleanHtml( html: string ): string {
	const blocks = pasteHandler( {
		mode: 'BLOCKS',
		HTML: html,
	} );
	return serialize( blocks );
}
