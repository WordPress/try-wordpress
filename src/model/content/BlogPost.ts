import {
	DateField,
	HtmlField,
	Post,
	PostType,
	TextField,
} from '@/model/content/Post';

type BlogPostSections = {
	date: DateField;
	title: TextField;
	content: HtmlField;
};

export interface BlogPost extends Post< PostType.BlogPost, BlogPostSections > {}
