import { ContentBus } from '@/bus/ContentBus';
import { BlueprintField } from '@/model/blueprint/Blueprint';
import { Field } from '@/model/field/Field';

export function FieldEditor( props: {
	field: Field;
	blueprintField: BlueprintField;
	label: string;
	waitingForSelection: boolean;
	onWaitingForSelection: ( field: Field | false ) => void;
	onClear: () => void;
} ) {
	const {
		blueprintField,
		field,
		label,
		waitingForSelection,
		onWaitingForSelection,
		onClear,
	} = props;

	return (
		<div
			style={ {
				border: '1px solid black',
				marginBottom: '1rem',
				padding: '1rem',
			} }
		>
			<div>
				{ label }{ ' ' }
				<button
					disabled={ waitingForSelection || field.original === '' }
					onClick={ onClear }
				>
					Clear
				</button>
				<button
					disabled={ waitingForSelection }
					onClick={ async () => {
						onWaitingForSelection( field );
						await ContentBus.enableHighlighting();
					} }
				>
					Select
				</button>
				{ ! waitingForSelection ? null : (
					<button
						onClick={ async () => {
							onWaitingForSelection( false );
							await ContentBus.disableHighlighting();
						} }
					>
						Cancel
					</button>
				) }
			</div>
			<div style={ { paddingTop: '1rem' } }>
				selector: { blueprintField.selector }
			</div>
			<div style={ { paddingTop: '1rem' } }>
				original: { field.original }
			</div>
			<div style={ { paddingTop: '1rem' } }>parsed: { field.parsed }</div>
		</div>
	);
}
