import { useEffect, useState } from 'react';
import { AppBus } from '@/bus/AppBus';
import { Message } from '@/bus/Message';
import { ContentBus } from '@/bus/ContentBus';
import {
	parsePostContent,
	parsePostDate,
	parsePostTitle,
} from '@/parser/blog-post';
import { BlogPost } from '@/model/content/BlogPost';
import {
	DateField,
	HtmlField,
	newDateField,
	newHtmlField,
	newTextField,
	TextField,
} from '@/model/content/Post';
import { FieldEditor } from '@/ui/flows/blog-post/FieldEditor';

enum fieldType {
	title = 1,
	date,
	content,
}

interface Props {
	post: BlogPost;
	onDateChanged: ( date: DateField ) => void;
	onTitleChanged: ( title: TextField ) => void;
	onContentChanged: ( content: HtmlField ) => void;
}

export function PostEditor( props: Props ) {
	const { post, onDateChanged, onTitleChanged, onContentChanged } = props;
	const [ lastClickedElement, setLastClickedElement ] = useState< string >();
	const [ waitingForSelection, setWaitingForSelection ] = useState<
		fieldType | false
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
	// according to which field is currently waiting for selection.
	useEffect(
		() => {
			if ( ! waitingForSelection || ! lastClickedElement ) {
				return;
			}
			async function updatePost(
				field: fieldType | false,
				value: string
			): Promise< void > {
				switch ( field ) {
					case fieldType.date:
						const newDate = parsePostDate( value );
						onDateChanged( newDate );
						break;
					case fieldType.title:
						const newTitle = parsePostTitle( value );
						onTitleChanged( newTitle );
						break;
					case fieldType.content:
						const newContent = parsePostContent( value );
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
			<FieldEditor
				field={ post.fields.title }
				label="Title"
				disabled={ !! waitingForSelection }
				waitingForSelection={
					!! waitingForSelection &&
					waitingForSelection === fieldType.title
				}
				onWaitingForSelection={ async ( isWaiting ) => {
					await ContentBus.enableHighlighting();
					setWaitingForSelection(
						isWaiting ? fieldType.title : false
					);
				} }
				onClear={ async () => {
					const newTitle = newTextField();
					onTitleChanged( newTitle );
				} }
			/>
			<FieldEditor
				field={ post.fields.date }
				label="Date"
				disabled={ !! waitingForSelection }
				waitingForSelection={
					!! waitingForSelection &&
					waitingForSelection === fieldType.date
				}
				onWaitingForSelection={ async ( isWaiting ) => {
					await ContentBus.enableHighlighting();
					setWaitingForSelection(
						isWaiting ? fieldType.date : false
					);
				} }
				onClear={ async () => {
					const newDate = newDateField();
					onDateChanged( newDate );
				} }
			/>
			<FieldEditor
				field={ post.fields.content }
				label="Content"
				disabled={ !! waitingForSelection }
				waitingForSelection={
					!! waitingForSelection &&
					waitingForSelection === fieldType.content
				}
				onWaitingForSelection={ async ( isWaiting ) => {
					await ContentBus.enableHighlighting();
					setWaitingForSelection(
						isWaiting ? fieldType.content : false
					);
				} }
				onClear={ async () => {
					const newContent = newHtmlField();
					onContentChanged( newContent );
				} }
			/>
		</>
	);
}
