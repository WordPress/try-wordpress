import { ReactElement, useEffect, useState } from 'react';
import { AppBus } from '@/bus/AppBus';
import { Message } from '@/bus/Message';
import { ContentBus } from '@/bus/ContentBus';
import { BlogPost } from '@/model/content/BlogPost';
import { PostField } from '@/model/content/Post';
import { FieldEditor } from '@/ui/flows/blog-post/FieldEditor';

interface Props {
	post: BlogPost;
	fieldOrder: Record< string, number >;
	onFieldChanged: ( name: string, field: PostField ) => void;
}

export function PostEditor( props: Props ) {
	const { post, fieldOrder, onFieldChanged } = props;
	const [ lastClickedElement, setLastClickedElement ] = useState< string >();
	const [ fieldWaitingForSelection, setFieldWaitingForSelection ] = useState<
		false | { field: PostField; name: string }
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
			if ( ! fieldWaitingForSelection || ! lastClickedElement ) {
				return;
			}
			fieldWaitingForSelection.field.original = lastClickedElement;
			onFieldChanged(
				fieldWaitingForSelection.name,
				fieldWaitingForSelection.field
			);
			setFieldWaitingForSelection( false );
			setLastClickedElement( undefined );
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ fieldWaitingForSelection, lastClickedElement ]
	);

	const fields: { name: string; field: PostField }[] = [];
	for ( const [ name, field ] of Object.entries( post.fields ) ) {
		const order = fieldOrder[ name ];
		fields[ order ] = { name, field };
	}

	const elements: ReactElement[] = [];
	for ( const { name, field } of fields ) {
		const isWaitingForSelection =
			!! fieldWaitingForSelection &&
			fieldWaitingForSelection.name === name;

		elements.push(
			<FieldEditor
				key={ name }
				label={ name }
				field={ field }
				waitingForSelection={ isWaitingForSelection }
				onWaitingForSelection={ async ( f: PostField | false ) => {
					await ContentBus.enableHighlighting();
					if ( !! f ) {
						setFieldWaitingForSelection( { field: f, name } );
					} else {
						setFieldWaitingForSelection( false );
					}
				} }
				onClear={ async () => {
					field.original = '';
					field.parsed = '';
					onFieldChanged( name, field );
				} }
			/>
		);
	}

	return <>{ elements }</>;
}
