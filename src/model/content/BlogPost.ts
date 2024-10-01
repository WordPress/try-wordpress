import {
	DateSection,
	HtmlSection,
	Post,
	PostType,
	TextSection,
} from '@/model/content/Post';

type BlogPostSections = {
	date: DateSection;
	title: TextSection;
	content: HtmlSection;
};

export interface BlogPost extends Post< PostType.BlogPost, BlogPostSections > {}
