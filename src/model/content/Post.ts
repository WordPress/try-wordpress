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
	Sections extends PostSections< any, any >,
> {
	type: Type;
	id: number;
	guid: string;
	url: string;
	sections: Sections;
}

export type PostSections< SectionName extends string, T extends DataType > = {
	[ Property in keyof SectionName ]: PostSection< T >;
};

export interface PostSection< T extends DataType > {
	dataType: T;
	original: string;
	parsed: string;
}

export type DateSection = PostSection< DataType.Date > & {
	utcString: string;
};
export type TextSection = PostSection< DataType.Text >;
export type HtmlSection = PostSection< DataType.Html >;

export function newDateSection(
	original: string = '',
	parsed: string = ''
): DateSection {
	const date = parsed === '' ? new Date() : new Date( parsed );
	return {
		dataType: DataType.Date,
		original,
		parsed,
		utcString: date.toUTCString(),
	};
}

export function newTextSection(
	original: string = '',
	parsed: string = ''
): TextSection {
	return {
		dataType: DataType.Text,
		original,
		parsed,
	};
}

export function newHtmlSection(
	original: string = '',
	parsed: string = ''
): HtmlSection {
	return {
		dataType: DataType.Html,
		original,
		parsed,
	};
}
