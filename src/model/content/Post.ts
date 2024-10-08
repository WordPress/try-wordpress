export enum PostType {
	BlogPost = 'liberated_data',
}

export const humanReadablePostType: Map< PostType, string > = new Map( [
	[ PostType.BlogPost, 'Blog Post' ],
] );

export enum FieldType {
	Date = 'date',
	Text = 'text',
	Html = 'html',
}

export type Post = GenericPost< any, PostFields< any, FieldType > >;
export type PostField = GenericField< FieldType >;
export type DateField = GenericField< FieldType.Date > & {
	value: Date;
};
export type TextField = GenericField< FieldType.Text >;
export type HtmlField = GenericField< FieldType.Html >;

export interface GenericPost<
	Type extends PostType,
	Fields extends PostFields< any, any >,
> {
	type: Type;
	id: number;
	guid: string;
	url: string;
	fields: Fields;
}

export interface GenericField< T extends FieldType > {
	type: T;
	original: string;
	parsed: string;
}

type PostFields< FieldName extends string, T extends FieldType > = {
	[ Property in keyof FieldName ]: GenericField< T >;
};

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
