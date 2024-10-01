export enum PostType {
	BlogPost = 'blog-post',
}

export enum FieldType {
	Date = 'date',
	Text = 'text',
	Html = 'html',
}

export type Post = GenericPost< any, PostFields< any, FieldType > >;

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

export type PostField = GenericField< FieldType >;

interface GenericField< T extends FieldType > {
	fieldType: T;
	original: string;
	parsed: string;
}

export type DateField = GenericField< FieldType.Date > & {
	utcString: string;
};
export type TextField = GenericField< FieldType.Text >;
export type HtmlField = GenericField< FieldType.Html >;

type PostFields< FieldName extends string, T extends FieldType > = {
	[ Property in keyof FieldName ]: GenericField< T >;
};

export function newDateField(
	original: string = '',
	parsed: string = ''
): DateField {
	const date = parsed === '' ? new Date() : new Date( parsed );
	return {
		fieldType: FieldType.Date,
		original,
		parsed,
		utcString: date.toUTCString(),
	};
}

export function newTextField(
	original: string = '',
	parsed: string = ''
): TextField {
	return {
		fieldType: FieldType.Text,
		original,
		parsed,
	};
}

export function newHtmlField(
	original: string = '',
	parsed: string = ''
): HtmlField {
	return {
		fieldType: FieldType.Html,
		original,
		parsed,
	};
}
