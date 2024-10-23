import { GenericPost, PostType } from '@/model/subject/Post';
import {
	GenericBlueprint,
	BlueprintDateField,
	BlueprintTextField,
	BlueprintHtmlField,
} from '@/model/blueprint/Blueprint';
import {
	DateField,
	FieldType,
	HtmlField,
	TextField,
} from '@/model/field/Field';

type BlogPostFields = {
	date: DateField;
	title: TextField;
	content: HtmlField;
};

type BlogPostBlueprintFields = {
	date: BlueprintDateField;
	title: BlueprintTextField;
	content: BlueprintHtmlField;
};

export interface BlogPost
	extends GenericPost< PostType.BlogPost, BlogPostFields > {}

export interface BlogPostBlueprint
	extends GenericBlueprint< PostType.BlogPost, BlogPostBlueprintFields > {}

export function newBlogPostBlueprint( sourceUrl: string ): BlogPostBlueprint {
	return {
		id: '',
		type: PostType.BlogPost,
		sourceUrl,
		valid: false,
		fields: {
			date: {
				type: FieldType.Date,
				selector: '',
			},
			title: {
				type: FieldType.Text,
				selector: '',
			},
			content: {
				type: FieldType.Html,
				selector: '',
			},
		},
	};
}
