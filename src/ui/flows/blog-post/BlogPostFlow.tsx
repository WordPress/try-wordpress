import { useEffect, useState } from 'react';
import { ContentBus } from '@/bus/ContentBus';
import { Message } from '@/bus/Message';
import { AppBus } from '@/bus/AppBus';

enum Steps {
	start = 1,
	selectContent,
	import,
}

export function BlogPostFlow() {
	const [ currentStep, setCurrentStep ] = useState( Steps.start );

	const startElement = (
		<Start onExit={ () => setCurrentStep( Steps.selectContent ) } />
	);

	const selectContentElement = (
		<SelectContent onExit={ () => setCurrentStep( Steps.import ) } />
	);

	const importElement = <Import onExit={ () => console.log( 'import' ) } />;

	return (
		<>
			{ currentStep === Steps.start ? startElement : null }
			{ currentStep === Steps.selectContent
				? selectContentElement
				: null }
			{ currentStep === Steps.import ? importElement : null }
		</>
	);
}

function Start( props: { onExit: () => void } ) {
	const { onExit } = props;
	return (
		<>
			<div>
				Navigate to the page of the post you&apos;d like to import
			</div>
			<button
				onClick={ async () => {
					await ContentBus.enableHighlighting();
					onExit();
				} }
			>
				Continue
			</button>
		</>
	);
}

function SelectContent( props: { onExit: () => void } ) {
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

function Import( props: { onExit: () => void } ) {
	const { onExit } = props;
	return (
		<>
			<div>Click import to import the post</div>
			<button
				onClick={ () => {
					onExit();
				} }
			>
				Import
			</button>
		</>
	);
}
