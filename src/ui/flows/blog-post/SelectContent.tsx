import { useEffect, useState } from 'react';
import { AppBus } from '@/bus/AppBus';
import { Message } from '@/bus/Message';
import { ContentBus } from '@/bus/ContentBus';
import { parsePostContent, parsePostDate, parsePostTitle } from '@/parser/post';
import { Post } from '@/api/Post';
import { useSessionContext } from '@/ui/session/SessionProvider';

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
	const { post, onExit } = props;
	const [ title, setTitle ] = useState< SectionContent >();
	const [ content, setContent ] = useState< SectionContent >();
	const [ date, setDate ] = useState< SectionContent >();
	const [ lastClickedElement, setLastClickedElement ] = useState< string >();
	const [ waitingForSelection, setWaitingForSelection ] = useState<
		section | false
	>( false );
	const { apiClient, playgroundClient } = useSessionContext();

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
		switch ( waitingForSelection ) {
			case section.title:
				const parsedTitle = parsePostTitle( original );
				setTitle( {
					originalHtml: parsedTitle.original,
					cleanHtml: parsedTitle.blocks,
				} );
				break;
			case section.date:
				const parsedDate = parsePostDate( original );
				setDate( {
					originalHtml: parsedDate.original,
					cleanHtml: parsedDate.blocks,
				} );
				break;
			case section.content:
				const parsedContent = parsePostContent( original );
				setContent( {
					originalHtml: parsedContent.original,
					cleanHtml: parsedContent.blocks,
				} );
				break;
		}
		setWaitingForSelection( false );
		setLastClickedElement( undefined );
	}, [ waitingForSelection, lastClickedElement ] );

	// Save the post when selections happen.
	useEffect(
		() => {
			if ( apiClient && title ) {
				apiClient
					.updatePost( post.id, { title: title.cleanHtml } )
					.then( () => playgroundClient.goTo( post.link ) );
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ title ]
	);
	useEffect(
		() => {
			if ( apiClient && content ) {
				apiClient
					.updatePost( post.id, { content } )
					.then( () => playgroundClient.goTo( post.link ) );
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ content ]
	);

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
