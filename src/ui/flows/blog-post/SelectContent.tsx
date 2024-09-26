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
	const [ date, setDate ] = useState< PostDate >( post.date );
	const [ title, setTitle ] = useState< PostTitle >( post.title );
	const [ content, setContent ] = useState< PostContent >( post.content );
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
	useEffect(
		() => {
			if (
				! apiClient ||
				! waitingForSelection ||
				! lastClickedElement
			) {
				return;
			}
			async function updatePost(
				field: section | false,
				value: string
			): Promise< void > {
				let p: Post;
				switch ( field ) {
					case section.date:
						p = await apiClient!.posts.update( post.id, {
							date: parsePostDate( value ),
						} );
						setDate( p.date );
						break;
					case section.title:
						p = await apiClient!.posts.update( post.id, {
							title: parsePostTitle( value ),
						} );
						setTitle( p.title );
						break;
					case section.content:
						p = await apiClient!.posts.update( post.id, {
							content: parsePostContent( value ),
						} );
						setContent( p.content );
						break;
					default:
						throw Error( `unexpected field: ${ field }` );
				}
			}
			updatePost( waitingForSelection, lastClickedElement )
				.then( () => playgroundClient.goTo( post.url ) )
				.catch( ( err ) => console.error( err ) );

			setWaitingForSelection( false );
			setLastClickedElement( undefined );
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ waitingForSelection, lastClickedElement ]
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
				onClear={ async () => {
					const p = await apiClient!.posts.update( post.id, {
						title: new PostTitle(),
					} );
					setTitle( p.title );
					await playgroundClient.goTo( p.url );
				} }
			/>
			<Section
				label="Date"
				originalValue={ date?.original }
				parsedValue={ date?.utcString }
				disabled={ !! waitingForSelection }
				waitingForSelection={
					!! waitingForSelection &&
					waitingForSelection === section.date
				}
				onWaitingForSelection={ async ( isWaiting ) => {
					await ContentBus.enableHighlighting();
					setWaitingForSelection( isWaiting ? section.date : false );
				} }
				onClear={ async () => {
					const p = await apiClient!.posts.update( post.id, {
						date: new PostDate(),
					} );
					setDate( p.date );
					await playgroundClient.goTo( p.url );
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
				onClear={ async () => {
					const p = await apiClient!.posts.update( post.id, {
						content: new PostContent(),
					} );
					setContent( p.content );
					await playgroundClient.goTo( p.url );
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
