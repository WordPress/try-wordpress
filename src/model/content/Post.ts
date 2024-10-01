export enum PostType {
	BlogPost = 'blog-post',
}

export enum FieldType {
	Date = 'date',
	Text = 'text',
	Html = 'html',
}

export interface Post<
	Type extends PostType,
	Fields extends PostFields< any, any >,
> {
	type: Type;
	id: number;
	guid: string;
	url: string;
	fields: Fields;
}

export type PostFields< FieldName extends string, T extends FieldType > = {
	[ Property in keyof FieldName ]: PostField< T >;
};

export interface PostField< T extends FieldType > {
	fieldType: T;
	original: string;
	parsed: string;
}

export type DateField = PostField< FieldType.Date > & {
	utcString: string;
};
export type TextField = PostField< FieldType.Text >;
export type HtmlField = PostField< FieldType.Html >;

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
