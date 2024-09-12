import { pasteHandler } from '@wordpress/blocks';

export function cleanHtml( html: string ): string {
	return pasteHandler( {
		mode: 'INLINE',
		HTML: html,
	} );
}
