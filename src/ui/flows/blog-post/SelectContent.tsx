import { useEffect, useState } from 'react';
import { AppBus } from '@/bus/AppBus';
import { Message } from '@/bus/Message';
import { ContentBus } from '@/bus/ContentBus';

export function SelectContent( props: { onExit: () => void } ) {
	const { onExit } = props;
	const [ content, setContent ] = useState< string >();

	useEffect( () => {
		AppBus.listen( async ( message: Message ) => {
			switch ( message.action ) {
				case AppBus.actions.ElementClicked:
					await ContentBus.disableHighlighting();
					setContent( ( message.payload as any ).content );
					break;
			}
		} );
		return () => {
			AppBus.stopListening();
		};
	}, [] );

	return (
		<>
			<div>Select the content of the post</div>
			<button
				onClick={ async () => {
					await ContentBus.disableHighlighting();
					onExit();
				} }
			>
				Continue
			</button>
			{ ! content ? null : <div>{ content }</div> }
		</>
	);
}
