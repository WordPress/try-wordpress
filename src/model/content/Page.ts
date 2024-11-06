import {
	FieldType,
	GenericPost,
	HtmlField,
	PostType,
	TextField,
} from '@/model/content/Post';
import {
	GenericBlueprint,
	BlueprintDateField,
	BlueprintTextField,
	BlueprintHtmlField,
} from '@/model/content/Blueprint';

type PageFields = {
	title: TextField;
	content: HtmlField;
};

type PageBlueprintFields = {
	title: BlueprintTextField;
	content: BlueprintHtmlField;
};

export interface Page
	extends GenericPost< PostType.Page, PageFields > {}

export interface PageBlueprint
	extends GenericBlueprint< PostType.Page, PageBlueprintFields > {}

export function newPageBlueprint( sourceUrl: string ): PageBlueprint {
	return {
		id: '',
		type: PostType.Page,
		sourceUrl,
		valid: false,
		fields: {
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
