import { useState } from 'react';

enum Steps {
	Start = 1,
	SelectTitle,
	SelectContent,
	Import,
}

export function BlogPostFlow() {
	const [ currentStep, setCurrentStep ] = useState( Steps.Start );

	const startElement =
		currentStep !== Steps.Start ? null : (
			<>
				<div>
					Navigate to the page of the post you&apos;d like to import
				</div>
				<button
					onClick={ () => {
						setCurrentStep( Steps.SelectTitle );
					} }
				>
					Continue
				</button>
			</>
		);

	const selectTitleElement =
		currentStep !== Steps.SelectTitle ? null : (
			<>
				<div>Select the title of the post</div>
				<button
					onClick={ () => {
						setCurrentStep( Steps.SelectContent );
					} }
				>
					Continue
				</button>
			</>
		);

	const selectContentElement =
		currentStep !== Steps.SelectContent ? null : (
			<>
				<div>Select the content of the post</div>
				<button
					onClick={ () => {
						setCurrentStep( Steps.Import );
					} }
				>
					Continue
				</button>
			</>
		);

	const importElement =
		currentStep !== Steps.Import ? null : (
			<>
				<div>Click import to import the post</div>
				<button
					onClick={ () => {
						console.log( 'import' );
					} }
				>
					Import
				</button>
			</>
		);

	return (
		<>
			{ currentStep === Steps.Start ? startElement : null }
			{ currentStep === Steps.SelectTitle ? selectTitleElement : null }
			{ currentStep === Steps.SelectContent
				? selectContentElement
				: null }
			{ currentStep === Steps.Import ? importElement : null }
		</>
	);
}
