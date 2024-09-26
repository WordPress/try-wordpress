import { useEffect, useState } from 'react';
import { AppBus } from '@/bus/AppBus';
import { Message } from '@/bus/Message';
import { ContentBus } from '@/bus/ContentBus';
import { parsePostContent, parsePostDate, parsePostTitle } from '@/parser/post';
import { Post, PostContent, PostDate, PostTitle } from '@/model/Post';

enum section {
	title = 1,
	date,
	content,
}

interface Props {
	post: Post;
	onDateChanged: ( date: PostDate ) => void;
	onTitleChanged: ( title: PostTitle ) => void;
	onContentChanged: ( content: PostContent ) => void;
}

export function SelectContent( props: Props ) {
	const { post, onDateChanged, onTitleChanged, onContentChanged } = props;
	const [ date, setDate ] = useState< PostDate >( post.date );
	const [ title, setTitle ] = useState< PostTitle >( post.title );
	const [ content, setContent ] = useState< PostContent >( post.content );
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
	useEffect(
		() => {
			if ( ! waitingForSelection || ! lastClickedElement ) {
				return;
			}
			async function updatePost(
				field: section | false,
				value: string
			): Promise< void > {
				switch ( field ) {
					case section.date:
						const newDate = parsePostDate( value );
						setDate( newDate );
						onDateChanged( newDate );
						break;
					case section.title:
						const newTitle = parsePostTitle( value );
						setTitle( newTitle );
						onTitleChanged( newTitle );
						break;
					case section.content:
						const newContent = parsePostContent( value );
						setContent( newContent );
						onContentChanged( newContent );
						break;
					default:
						throw Error( `unexpected field: ${ field }` );
				}
			}
			updatePost( waitingForSelection, lastClickedElement ).catch(
				( err ) => console.error( err )
			);
			setWaitingForSelection( false );
			setLastClickedElement( undefined );
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ waitingForSelection, lastClickedElement ]
	);

	return (
		<>
			<Section
				label="Title"
				originalValue={ title.original }
				parsedValue={ title.parsed }
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
					const newTitle = new PostTitle();
					setTitle( newTitle );
					onTitleChanged( newTitle );
				} }
			/>
			<Section
				label="Date"
				originalValue={ date.original }
				parsedValue={ date.utcString }
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
					const newDate = new PostDate();
					setDate( newDate );
					onDateChanged( newDate );
				} }
			/>
			<Section
				label="Content"
				originalValue={ content.original }
				parsedValue={ content.parsed }
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
					const newContent = new PostContent();
					setContent( newContent );
					onContentChanged( newContent );
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
