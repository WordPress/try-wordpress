import { useEffect, useState } from 'react';
import { AppBus } from '@/bus/AppBus';
import { Message } from '@/bus/Message';
import { ContentBus } from '@/bus/ContentBus';

enum section {
	title = 1,
	date,
	content,
}

export function SelectContent( props: { onExit: () => void } ) {
	const { onExit } = props;
	const [ title, setTitle ] = useState< string >();
	const [ content, setContent ] = useState< string >();
	const [ date, setDate ] = useState< string >();
	const [ lastClickedElement, setLastClickedElement ] = useState< string >();
	const [ waitingForSelection, setWaitingForSelection ] = useState<
		section | false
	>( false );

	useEffect( () => {
		AppBus.listen( async ( message: Message ) => {
			switch ( message.action ) {
				case AppBus.actions.ElementClicked:
					await ContentBus.disableHighlighting();
					setLastClickedElement( ( message.payload as any ).content );
			}
		} );
		return () => {
			AppBus.stopListening();
		};
	}, [] );

	if ( lastClickedElement ) {
		switch ( waitingForSelection ) {
			case section.title:
				setTitle( lastClickedElement );
				break;
			case section.date:
				setDate( lastClickedElement );
				break;
			case section.content:
				setContent( lastClickedElement );
				break;
		}
		setWaitingForSelection( false );
		setLastClickedElement( undefined );
	}

	const isValid = title && date && content;

	return (
		<>
			<div>Select the content of the post</div>
			<button
				disabled={ ! isValid }
				onClick={ async () => {
					await ContentBus.disableHighlighting();
					onExit();
				} }
			>
				Continue
			</button>
			<Section
				label="Title"
				value={ title }
				disabled={ !! waitingForSelection }
				waitingForSelection={
					!! waitingForSelection &&
					waitingForSelection === section.title
				}
				onWaitingForSelection={ ( isWaiting ) => {
					setWaitingForSelection( isWaiting ? section.title : false );
				} }
			/>
			<Section
				label="Date"
				value={ date }
				disabled={ !! waitingForSelection }
				waitingForSelection={
					!! waitingForSelection &&
					waitingForSelection === section.date
				}
				onWaitingForSelection={ ( isWaiting ) => {
					setWaitingForSelection( isWaiting ? section.date : false );
				} }
			/>
			<Section
				label="Content"
				value={ content }
				disabled={ !! waitingForSelection }
				waitingForSelection={
					!! waitingForSelection &&
					waitingForSelection === section.content
				}
				onWaitingForSelection={ ( isWaiting ) => {
					setWaitingForSelection(
						isWaiting ? section.content : false
					);
				} }
			/>
		</>
	);
}

function Section( props: {
	label: string;
	value: string | undefined;
	disabled: boolean;
	waitingForSelection: boolean;
	onWaitingForSelection: ( isWaiting: boolean ) => void;
} ) {
	const {
		label,
		value,
		disabled,
		waitingForSelection,
		onWaitingForSelection,
	} = props;

	return (
		<>
			<div>
				{ label }: { value ?? 'Not found' }
			</div>
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
		</>
	);
}
