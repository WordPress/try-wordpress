import { useEffect, useState } from 'react';
import { AppBus } from '@/bus/AppBus';
import { Message } from '@/bus/Message';
import { ContentBus } from '@/bus/ContentBus';
import { cleanHtml } from '@/parser/cleanHtml';
import { Post } from '@/api/Post';

enum section {
	title = 1,
	date,
	content,
}

interface SectionContent {
	originalHtml: string;
	cleanHtml: string;
}

export function SelectContent( props: { post: Post; onExit: () => void } ) {
	const { onExit } = props;
	const [ title, setTitle ] = useState< SectionContent >();
	const [ content, setContent ] = useState< SectionContent >();
	const [ date, setDate ] = useState< SectionContent >();
	const [ lastClickedElement, setLastClickedElement ] = useState< string >();
	const [ waitingForSelection, setWaitingForSelection ] = useState<
		section | false
	>( false );

	// Listen to click events coming from the content script.
	useEffect( () => {
		AppBus.listen( async ( message: Message ) => {
			switch ( message.action ) {
				case AppBus.actions.ElementClicked:
					await ContentBus.disableHighlighting();
					setLastClickedElement( ( message.payload as any ).content );
			}
		} );
		return () => {
			void ContentBus.disableHighlighting();
			AppBus.stopListening();
		};
	}, [] );

	// Handle a click on an event in the content script,
	// according to which section is currently waiting for selection.
	useEffect( () => {
		if ( ! lastClickedElement ) {
			return;
		}
		const original = lastClickedElement;
		const clean = cleanHtml( original );

		switch ( waitingForSelection ) {
			case section.title:
				setTitle( {
					originalHtml: original,
					cleanHtml: clean,
				} );
				break;
			case section.date:
				setDate( {
					originalHtml: original,
					cleanHtml: clean,
				} );
				break;
			case section.content:
				setContent( {
					originalHtml: original,
					cleanHtml: clean,
				} );
				break;
		}
		setWaitingForSelection( false );
		setLastClickedElement( undefined );
	}, [ waitingForSelection, lastClickedElement ] );

	const isValid = title && date && content;
	return (
		<>
			<div>Select the content of the post</div>
			<button
				disabled={ ! isValid }
				onClick={ async () => {
					await ContentBus.disableHighlighting();
					console.log( 'TODO: import' );
					onExit();
				} }
			>
				Import
			</button>
			<Section
				label="Title"
				content={ title }
				disabled={ !! waitingForSelection }
				waitingForSelection={
					!! waitingForSelection &&
					waitingForSelection === section.title
				}
				onWaitingForSelection={ async ( isWaiting ) => {
					await ContentBus.enableHighlighting();
					setWaitingForSelection( isWaiting ? section.title : false );
				} }
			/>
			<Section
				label="Date"
				content={ date }
				disabled={ !! waitingForSelection }
				waitingForSelection={
					!! waitingForSelection &&
					waitingForSelection === section.date
				}
				onWaitingForSelection={ async ( isWaiting ) => {
					await ContentBus.enableHighlighting();
					setWaitingForSelection( isWaiting ? section.date : false );
				} }
			/>
			<Section
				label="Content"
				content={ content }
				disabled={ !! waitingForSelection }
				waitingForSelection={
					!! waitingForSelection &&
					waitingForSelection === section.content
				}
				onWaitingForSelection={ async ( isWaiting ) => {
					await ContentBus.enableHighlighting();
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
	content: SectionContent | undefined;
	disabled: boolean;
	waitingForSelection: boolean;
	onWaitingForSelection: ( isWaiting: boolean ) => void;
} ) {
	const {
		label,
		content,
		disabled,
		waitingForSelection,
		onWaitingForSelection,
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
				{ content?.originalHtml ?? 'Not found' }
			</div>
			<div style={ { paddingTop: '1rem' } }>{ content?.cleanHtml }</div>
		</div>
	);
}
