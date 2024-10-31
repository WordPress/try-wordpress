import { pasteHandler, serialize } from '@wordpress/blocks';
import { findDeepestChild } from '@/parser/util';
import { DateField, newDateField } from '@/model/field/DateField';
import { newTextField, TextField } from '@/model/field/TextField';
import { HtmlField, newHtmlField } from '@/model/field/HtmlField';
import { Field } from '@/model/field/Field';

export function parseBlogPostField( name: string, field: Field ): Field {
	switch ( name ) {
		case 'date':
			return parseDate( field.original );
		case 'title':
			return parseTitle( field.original );
		case 'content':
			return parseContent( field.original );
		default:
			throw Error( `unknown field type ${ field.type }` );
	}
}

function parseDate( html: string ): DateField {
	const container = document.createElement( 'div' );
	container.innerHTML = html.trim();
	const element = container.querySelector( 'time' );
	return newDateField( html, element ? element.dateTime : '' );
}

function parseTitle( html: string ): TextField {
	const deepestChild = findDeepestChild( html );
	return newTextField( html, deepestChild?.innerHTML ?? '' );
}

function parseContent( html: string ): HtmlField {
	return newHtmlField( html, serializeBlocks( html ) );
}

function serializeBlocks( html: string ): string {
	const blocks = pasteHandler( {
		mode: 'BLOCKS',
		HTML: html,
	} );
	return serialize( blocks );
}
