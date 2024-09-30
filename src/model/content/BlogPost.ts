import { DateSection, HtmlSection, TextSection } from '@/model/content/Section';

export interface BlogPost {
	id: number;
	guid: string;
	url: string;
	date: DateSection;
	title: TextSection;
	content: HtmlSection;
}
