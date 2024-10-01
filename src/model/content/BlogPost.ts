import {
	DateField,
	GenericPost,
	HtmlField,
	PostType,
	TextField,
} from '@/model/content/Post';

type BlogPostFields = {
	date: DateField;
	title: TextField;
	content: HtmlField;
};

export interface BlogPost
	extends GenericPost< PostType.BlogPost, BlogPostFields > {}
