import { Field } from '@/model/field/Field';
import { FieldsEditor } from '@/ui/components/FieldsEditor/FieldsEditor';
import { PageBlueprint } from '@/model/blueprint/Page';
import { Page } from '@/model/subject/Page';

interface Props {
	blueprint: PageBlueprint;
	subject: Page;
	onFieldChanged: ( name: string, field: Field, selector: string ) => void;
}

export function PageBlueprintEditor( props: Props ) {
	const { blueprint, subject, onFieldChanged } = props;

	const subjectFields: { name: string; field: Field }[] = [
		{ name: 'title', field: subject.fields.title },
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
