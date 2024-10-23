import { ContentBus } from '@/bus/ContentBus';
import { PostField } from '@/model/subject/Post';
import { BlueprintField } from '@/model/blueprint/Blueprint';

export function FieldEditor( props: {
	postField: PostField;
	blueprintField: BlueprintField;
	label: string;
	waitingForSelection: boolean;
	onWaitingForSelection: ( field: PostField | false ) => void;
	onClear: () => void;
} ) {
	const {
		blueprintField,
		postField,
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
					disabled={
						waitingForSelection || postField.original === ''
					}
					onClick={ onClear }
				>
					Clear
				</button>
				<button
					disabled={ waitingForSelection }
					onClick={ async () => {
						onWaitingForSelection( postField );
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
				original: { postField.original }
			</div>
			<div style={ { paddingTop: '1rem' } }>
				parsed: { postField.parsed }
			</div>
		</div>
	);
}
