import { ContentBus } from '@/bus/ContentBus';
import { PostField } from '@/model/content/Post';

export function FieldEditor( props: {
	field: PostField;
	label: string;
	waitingForSelection: boolean;
	onWaitingForSelection: ( field: PostField | false ) => void;
	onClear: () => void;
} ) {
	const {
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
			<div style={ { paddingTop: '1rem' } }>{ field.original }</div>
			<div style={ { paddingTop: '1rem' } }>{ field.parsed }</div>
		</div>
	);
}
