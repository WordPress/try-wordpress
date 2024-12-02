import { Field } from '@/model/field/Field';
import { BlogPost } from '@/model/subject/BlogPost';
import { BlogPostBlueprint } from '@/model/blueprint/BlogPost';
import { FieldsEditor } from '@/ui/components/FieldsEditor/FieldsEditor';

interface Props {
	blueprint: BlogPostBlueprint;
	subject: BlogPost;
	onFieldChanged: ( name: string, field: Field, selector: string ) => void;
}

export function BlogPostBlueprintEditor( props: Props ) {
	const { blueprint, subject, onFieldChanged } = props;

	const subjectFields: { name: string; field: Field }[] = [
		{ name: 'title', field: subject.fields.title },
		{ name: 'date', field: subject.fields.date },
		{ name: 'content', field: subject.fields.content },
	];

	const selectors: {
		name: string;
		selector?: string;
	}[] = [
		{
			name: 'title',
			selector: blueprint.fields.title.selector,
		},
		{
			name: 'date',
			selector: blueprint.fields.date.selector,
		},
		{
			name: 'content',
			selector: blueprint.fields.content.selector,
		},
	];

	return (
		<FieldsEditor
			fields={ subjectFields }
			selectors={ selectors }
			onFieldChanged={ onFieldChanged }
		/>
	);
}
