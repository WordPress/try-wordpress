import { Field } from '@/model/field/Field';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { CommandTypes, sendCommandToContent } from '@/bus/Command';
import { SingleFieldEditor } from '@/ui/components/FieldsEditor/SingleFieldEditor';
import { EventTypes } from '@/bus/Event';
import { ContentEventHandler } from '@/ui/components/ContentEventHandler';

// Displays a list of fields that can be "edited" by selecting the content of each field,
// which is done by clicking on elements in the source site.
export function FieldsEditor( props: {
	fields: { name: string; field: Field }[];
	selectors: {
		name: string;
		selector?: string;
	}[];
	onFieldChanged: ( name: string, field: Field, selector: string ) => void;
} ) {
	const { fields, onFieldChanged } = props;
	const [ fieldWaitingForSelection, setFieldWaitingForSelection ] = useState<
		false | { field: Field; name: string }
	>( false );

	// Transform the blueprint fields into a map queryable by field name.
	const blueprintFields = useMemo<
		Map< string, string | undefined >
	>( () => {
		const map = new Map< string, string >();
		props.selectors.forEach( ( f ) => {
			map.set( f.name, f.selector ?? '' );
		} );
		return map;
	}, [ props.selectors ] );

	// Enable or disable highlighting according to whether a field is waiting for selection.
	useEffect( () => {
		const type =
			fieldWaitingForSelection === false
				? CommandTypes.SwitchToDefaultMode
				: CommandTypes.SwitchToGenericSelectionMode;
		void sendCommandToContent( { type, payload: {} } );
	}, [ fieldWaitingForSelection ] );

	// Render each field.
	const elements: ReactElement[] = [];
	for ( const { name, field } of fields ) {
		const isWaitingForSelection =
			!! fieldWaitingForSelection &&
			fieldWaitingForSelection.name === name;

		const selector = blueprintFields.get( name );
		if ( selector === undefined ) {
			throw new Error( `selector for field ${ name } not found` );
		}

		elements.push(
			<SingleFieldEditor
				key={ name }
				field={ field }
				label={ name }
				selector={ selector }
				waitingForSelection={ isWaitingForSelection }
				onWaitingForSelection={ async ( f: Field | false ) => {
					if ( f === false ) {
						setFieldWaitingForSelection( false );
					} else {
						setFieldWaitingForSelection( { field: f, name } );
					}
				} }
				onClear={ async () => {
					field.rawValue = '';
					field.parsedValue = '';
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
					const selector = ' ';
					fieldWaitingForSelection.field.rawValue = (
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
