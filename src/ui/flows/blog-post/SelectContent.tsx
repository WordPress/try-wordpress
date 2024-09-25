import { useEffect, useState } from 'react';
import { AppBus } from '@/bus/AppBus';
import { Message } from '@/bus/Message';
import { ContentBus } from '@/bus/ContentBus';
import { parsePostContent, parsePostDate, parsePostTitle } from '@/parser/post';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { Post, PostContent, PostDate, PostTitle } from '@/model/Post';

enum section {
	title = 1,
	date,
	content,
}

export function SelectContent( props: { post: Post; onExit: () => void } ) {
	const { post, onExit } = props;
	const [ date, setDate ] = useState< PostDate >();
	const [ title, setTitle ] = useState< PostTitle >();
	const [ content, setContent ] = useState< PostContent >();
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
				setTitle( parsePostTitle( original ) );
				break;
			case section.date:
				setDate( parsePostDate( original ) );
				break;
			case section.content:
				setContent( parsePostContent( original ) );
				break;
		}
		setWaitingForSelection( false );
		setLastClickedElement( undefined );
	}, [ waitingForSelection, lastClickedElement ] );

	// Save the post when selections happen.
	useEffect(
		() => {
			if ( apiClient && title ) {
				apiClient.posts
					.update( post.id, { title } )
					.then( () => playgroundClient.goTo( post.url ) );
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ title ]
	);
	useEffect(
		() => {
			if ( apiClient && content ) {
				apiClient.posts
					.update( post.id, { content } )
					.then( () => playgroundClient.goTo( post.url ) );
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ content ]
	);
	useEffect(
		() => {
			if ( apiClient && date ) {
				apiClient.posts
					.update( post.id, { date } )
					.then( () => playgroundClient.goTo( post.url ) );
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ date ]
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
				originalValue={ title?.original }
				parsedValue={ title?.parsed }
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
				originalValue={ date?.original }
				parsedValue={ date?.parsed }
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
				originalValue={ content?.original }
				parsedValue={ content?.parsed }
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
	disabled: boolean;
	originalValue: string | undefined;
	parsedValue: string | undefined;
	waitingForSelection: boolean;
	onWaitingForSelection: ( isWaiting: boolean ) => void;
} ) {
	const {
		label,
		disabled,
		originalValue,
		parsedValue,
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
				{ originalValue ?? 'Not found' }
			</div>
			<div style={ { paddingTop: '1rem' } }>{ parsedValue }</div>
		</div>
	);
}
