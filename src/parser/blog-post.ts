import { pasteHandler, serialize } from '@wordpress/blocks';
import { findDeepestChild } from '@/parser/util';
import { DateSection, HtmlSection, TextSection } from '@/model/content/Section';

export function parsePostDate( html: string ): DateSection {
	const container = document.createElement( 'div' );
	container.innerHTML = html.trim();
	const element = container.querySelector( 'time' );
	return new DateSection( html, element ? element.dateTime : '' );
}

export function parsePostTitle( html: string ): TextSection {
	const deepestChild = findDeepestChild( html );
	return new TextSection( html, deepestChild?.innerHTML ?? '' );
}

export function parsePostContent( html: string ): HtmlSection {
	return new HtmlSection( html, serializeBlocks( html ) );
}

function serializeBlocks( html: string ): string {
	const blocks = pasteHandler( {
		mode: 'BLOCKS',
		HTML: html,
	} );
	return serialize( blocks );
}
