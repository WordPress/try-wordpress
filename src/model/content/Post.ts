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

export type DateSection = PostSection< DataType.Date >;
export type TextSection = PostSection< DataType.Text >;
export type HtmlSection = PostSection< DataType.Html >;
