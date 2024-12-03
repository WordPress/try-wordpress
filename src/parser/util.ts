import { pasteHandler, serialize } from '@wordpress/blocks';

export function htmlToBlocks( html: string ): string {
	const blocks = pasteHandler( {
		mode: 'BLOCKS',
		HTML: html,
	} );
	return serialize( blocks );
}

export function findDeepestChild( html: string ): Element | undefined {
	const container = document.createElement( 'div' );
	container.innerHTML = html.trim();

	let deepestChild = container as Element;
	while ( deepestChild.firstElementChild ) {
		if ( ! deepestChild.firstElementChild ) {
			break;
		} else {
			deepestChild = deepestChild.firstElementChild;
		}
	}

	if ( deepestChild.innerHTML === html ) {
		// There are no children.
		return undefined;
	}
	return deepestChild;
}
