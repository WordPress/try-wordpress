import { Field } from '@/model/field/Field';
import { BlogPost } from '@/model/subject/BlogPost';
import { BlogPostBlueprint } from '@/model/blueprint/BlogPost';
import { FieldsEditor } from '@/ui/components/FieldsEditor/FieldsEditor';
import { getSchemaFields } from '@/schemas/fields';

interface Props {
	blueprint: BlogPostBlueprint;
	subject: BlogPost;
	onFieldChanged: ( name: string, field: Field, selector: string ) => void;
}

export function BlogPostBlueprintEditor( props: Props ) {
	const { blueprint, subject, onFieldChanged } = props;
	const schemaFields = getSchemaFields( subject.type );

	const subjectFields: { name: string; field: Field }[] = [];
	const selectors: {
		name: string;
		selector?: string;
	}[] = [];

	Object.keys( schemaFields ).forEach( ( name ) => {
		subjectFields.push( {
			name,
			field: subject.fields[ name ],
		} );
		selectors.push( {
			name,
			// @ts-ignore
			selector: blueprint.fields[ name ].selector,
		} );
	} );

	return (
		<FieldsEditor
			fields={ subjectFields }
			selectors={ selectors }
			onFieldChanged={ onFieldChanged }
		/>
	);
}
