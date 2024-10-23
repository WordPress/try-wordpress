import { pasteHandler, serialize } from '@wordpress/blocks';
import { findDeepestChild } from '@/parser/util';
import { DateField, newDateField } from '@/model/field/DateField';
import { newTextField, TextField } from '@/model/field/TextField';
import { HtmlField, newHtmlField } from '@/model/field/HtmlField';

export function parseBlogPostDate( html: string ): DateField {
	const container = document.createElement( 'div' );
	container.innerHTML = html.trim();
	const element = container.querySelector( 'time' );
	return newDateField( html, element ? element.dateTime : '' );
}

export function parseBlogPostTitle( html: string ): TextField {
	const deepestChild = findDeepestChild( html );
	return newTextField( html, deepestChild?.innerHTML ?? '' );
}

export function parseBlogPostContent( html: string ): HtmlField {
	return newHtmlField( html, serializeBlocks( html ) );
}

function serializeBlocks( html: string ): string {
	const blocks = pasteHandler( {
		mode: 'BLOCKS',
		HTML: html,
	} );
	return serialize( blocks );
}
