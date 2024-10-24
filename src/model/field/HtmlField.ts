import { Field, FieldType } from '@/model/field/Field';

export interface HtmlField extends Field {
	type: FieldType.Html;
}

export function newHtmlField(
	original: string = '',
	parsed: string = ''
): HtmlField {
	return {
		type: FieldType.Html,
		original,
		parsed,
	};
}
