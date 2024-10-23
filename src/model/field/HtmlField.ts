import { FieldType, GenericField } from '@/model/field/Field';

export type HtmlField = GenericField< FieldType.Html >;

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
