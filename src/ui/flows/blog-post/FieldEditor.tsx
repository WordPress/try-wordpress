import { ContentBus } from '@/bus/ContentBus';

export function FieldEditor( props: {
	label: string;
	disabled: boolean;
	originalValue: string | undefined;
	parsedValue: string | undefined;
	waitingForSelection: boolean;
	onWaitingForSelection: ( isWaiting: boolean ) => void;
	onClear: () => void;
} ) {
	const {
		label,
		disabled,
		originalValue,
		parsedValue,
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
					disabled={ disabled || originalValue === '' }
					onClick={ onClear }
				>
					Clear
				</button>
				<button
					disabled={ disabled }
					onClick={ async () => {
						onWaitingForSelection( true );
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
				{ originalValue ?? 'Not found' }
			</div>
			<div style={ { paddingTop: '1rem' } }>{ parsedValue }</div>
		</div>
	);
}
