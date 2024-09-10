import { useState } from 'react';
import { ContentApi } from '@/api/ContentApi';

enum Steps {
	start = 1,
	selectContent,
	import,
}

const contentApi = new ContentApi();

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
					await contentApi.enableHighlighting();
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
	return (
		<>
			<div>Select the content of the post</div>
			<button
				onClick={ async () => {
					await contentApi.disableHighlighting();
					onExit();
				} }
			>
				Continue
			</button>
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
