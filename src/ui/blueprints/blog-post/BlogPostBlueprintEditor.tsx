import { ReactElement, useEffect, useState } from 'react';
import { ContentBus } from '@/bus/ContentBus';
import { FieldEditor } from '@/ui/blueprints/FieldEditor';
import { Field } from '@/model/field/Field';
import { BlogPost } from '@/model/subject/BlogPost';
import { BlogPostBlueprint } from '@/model/blueprint/BlogPost';
import { useLastClickedElement } from '@/ui/blueprints/useLastClickedElement';

interface Props {
	blueprint: BlogPostBlueprint;
	subject: BlogPost;
	onFieldChanged: ( name: string, field: Field, selector: string ) => void;
}

export function BlogPostBlueprintEditor( props: Props ) {
	const { blueprint, subject, onFieldChanged } = props;
	const [ fieldWaitingForSelection, setFieldWaitingForSelection ] = useState<
		false | { field: Field; name: string }
	>( false );
	const [ lastClickedElement, resetLastClickedElement ] =
		useLastClickedElement();

	const subjectFields: { name: string; field: Field }[] = [
		{ name: 'title', field: subject.title },
		{ name: 'date', field: subject.date },
		{ name: 'content', field: subject.content },
	];

	// Handle a click on an event in the content script,
	// according to which field is currently waiting for selection.
	useEffect(
		() => {
			if ( ! fieldWaitingForSelection || ! lastClickedElement ) {
				return;
			}
			const selector = 'TODO';
			fieldWaitingForSelection.field.original = lastClickedElement;
			onFieldChanged(
				fieldWaitingForSelection.name,
				fieldWaitingForSelection.field,
				selector
			);
			setFieldWaitingForSelection( false );
			resetLastClickedElement();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ fieldWaitingForSelection, lastClickedElement ]
	);

	const elements: ReactElement[] = [];
	for ( const { name, field } of subjectFields ) {
		const isWaitingForSelection =
			!! fieldWaitingForSelection &&
			fieldWaitingForSelection.name === name;

		const blueprintField =
			blueprint.fields[ name as keyof typeof blueprint.fields ];
		if ( ! blueprintField ) {
			throw new Error( `blueprint field ${ name } not found` );
		}

		elements.push(
			<FieldEditor
				key={ name }
				label={ name }
				blueprintField={ blueprintField }
				field={ field }
				waitingForSelection={ isWaitingForSelection }
				onWaitingForSelection={ async ( f: Field | false ) => {
					await ContentBus.enableHighlighting();
					if ( !! f ) {
						setFieldWaitingForSelection( { field: f, name } );
					} else {
						setFieldWaitingForSelection( false );
					}
				} }
				onClear={ async () => {
					field.original = '';
					field.parsed = '';
					onFieldChanged( name, field, '' );
				} }
			/>
		);
	}

	return <>{ elements }</>;
}
