import { SubjectType } from '@/model/subject/Subject';
import {
	GenericBlueprint,
	BlueprintDateField,
	BlueprintTextField,
	BlueprintHtmlField,
} from '@/model/blueprint/Blueprint';
import { FieldType } from '@/model/field/Field';

type BlogPostBlueprintFields = {
	date: BlueprintDateField;
	title: BlueprintTextField;
	content: BlueprintHtmlField;
};

export interface BlogPostBlueprint
	extends GenericBlueprint< SubjectType.BlogPost, BlogPostBlueprintFields > {}

export function newBlogPostBlueprint( sourceUrl: string ): BlogPostBlueprint {
	return {
		id: '',
		type: SubjectType.BlogPost,
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
