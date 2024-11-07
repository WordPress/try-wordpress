import { ReactElement, useEffect, useState } from 'react';
import { FieldEditor } from '@/ui/blueprints/FieldEditor';
import { Field } from '@/model/field/Field';
import { Page } from '@/model/subject/Page';
import { PageBlueprint } from '@/model/blueprint/Page';
import { CommandTypes, sendCommandToContent } from '@/bus/Command';
import { EventTypes } from '@/bus/Event';
import { ContentEventHandler } from '@/ui/blueprints/ContentEventHandler';

interface Props {
	blueprint: PageBlueprint;
	subject: Page;
	onFieldChanged: ( name: string, field: Field, selector: string ) => void;
}

export function PageBlueprintEditor( props: Props ) {
	const { blueprint, subject, onFieldChanged } = props;
	const [ fieldWaitingForSelection, setFieldWaitingForSelection ] = useState<
		false | { field: Field; name: string }
	>( false );

	const subjectFields: { name: string; field: Field }[] = [
		{ name: 'title', field: subject.title },
		{ name: 'content', field: subject.content },
	];

	// Enable or disable highlighting according to whether a field is waiting for selection.
	useEffect( () => {
		const type =
			fieldWaitingForSelection === false
				? CommandTypes.DisableHighlighting
				: CommandTypes.EnableHighlighting;
		void sendCommandToContent( { type, payload: {} } );
	}, [ fieldWaitingForSelection ] );

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
					if ( f === false ) {
						setFieldWaitingForSelection( false );
					} else {
						setFieldWaitingForSelection( { field: f, name } );
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

	return (
		<>
			{ /*
			Handle a click on an element in the content script,
			according to which field is currently waiting for selection.
			*/ }
			<ContentEventHandler
				eventType={ EventTypes.OnElementClick }
				onEvent={ async ( event ) => {
					if ( fieldWaitingForSelection === false ) {
						console.warn(
							'Received an OnElementClick event but no field is waiting for selection'
						);
						return;
					}
					const selector = 'TODO';
					fieldWaitingForSelection.field.original = (
						event.event.payload as any
					 ).content;
					onFieldChanged(
						fieldWaitingForSelection.name,
						fieldWaitingForSelection.field,
						selector
					);
					setFieldWaitingForSelection( false );
				} }
			/>
			{ elements }
		</>
	);
}
