import { pasteHandler, serialize } from '@wordpress/blocks';
import { findDeepestChild } from '@/parser/util';
import { DateField, newDateField } from '@/model/field/DateField';
import { newTextField, TextField } from '@/model/field/TextField';
import { HtmlField, newHtmlField } from '@/model/field/HtmlField';
import { Field } from '@/model/field/Field';

export function parseBlogPostField( name: string, field: Field ): Field {
	switch ( name ) {
		case 'date':
			return parseBlogPostDate( field.original );
		case 'title':
			return parseBlogPostTitle( field.original );
		case 'content':
			return parseBlogPostContent( field.original );
		default:
			throw Error( `unknown field type ${ field.type }` );
	}
}

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
