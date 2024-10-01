import { pasteHandler, serialize } from '@wordpress/blocks';
import { findDeepestChild } from '@/parser/util';
import {
	DateSection,
	HtmlSection,
	newDateSection,
	newHtmlSection,
	newTextSection,
	TextSection,
} from '@/model/content/Post';

export function parsePostDate( html: string ): DateSection {
	const container = document.createElement( 'div' );
	container.innerHTML = html.trim();
	const element = container.querySelector( 'time' );
	return newDateSection( html, element ? element.dateTime : '' );
}

export function parsePostTitle( html: string ): TextSection {
	const deepestChild = findDeepestChild( html );
	return newTextSection( html, deepestChild?.innerHTML ?? '' );
}

export function parsePostContent( html: string ): HtmlSection {
	return newHtmlSection( html, serializeBlocks( html ) );
}

function serializeBlocks( html: string ): string {
	const blocks = pasteHandler( {
		mode: 'BLOCKS',
		HTML: html,
	} );
	return serialize( blocks );
}
