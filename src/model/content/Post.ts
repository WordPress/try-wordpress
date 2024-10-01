export enum PostType {
	BlogPost = 'blog-post',
}

export enum DataType {
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

export type PostFields< FieldName extends string, T extends DataType > = {
	[ Property in keyof FieldName ]: PostField< T >;
};

export interface PostField< T extends DataType > {
	dataType: T;
	original: string;
	parsed: string;
}

export type DateField = PostField< DataType.Date > & {
	utcString: string;
};
export type TextField = PostField< DataType.Text >;
export type HtmlField = PostField< DataType.Html >;

export function newDateField(
	original: string = '',
	parsed: string = ''
): DateField {
	const date = parsed === '' ? new Date() : new Date( parsed );
	return {
		dataType: DataType.Date,
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
		dataType: DataType.Text,
		original,
		parsed,
	};
}

export function newHtmlField(
	original: string = '',
	parsed: string = ''
): HtmlField {
	return {
		dataType: DataType.Html,
		original,
		parsed,
	};
}
