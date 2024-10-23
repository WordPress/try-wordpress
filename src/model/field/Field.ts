export enum FieldType {
	Date = 'date',
	Text = 'text',
	Html = 'html',
}

export type DateField = GenericField< FieldType.Date > & {
	value: Date;
};
export type TextField = GenericField< FieldType.Text >;
export type HtmlField = GenericField< FieldType.Html >;

export interface GenericField< T extends FieldType > {
	type: T;
	original: string;
	parsed: string;
}

export function newDateField(
	original: string = '',
	parsed: string = ''
): DateField {
	const date = parsed === '' ? new Date() : new Date( parsed );
	return {
		type: FieldType.Date,
		original,
		parsed,
		value: date,
	};
}

export function newTextField(
	original: string = '',
	parsed: string = ''
): TextField {
	return {
		type: FieldType.Text,
		original,
		parsed,
	};
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
