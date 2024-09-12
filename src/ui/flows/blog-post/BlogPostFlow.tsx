import { useState } from 'react';
import { Start } from '@/ui/flows/blog-post/Start';
import { SelectContent } from '@/ui/flows/blog-post/SelectContent';
import { Finish } from '@/ui/flows/blog-post/Finish';

enum Steps {
	start = 1,
	selectContent,
	finish,
}

export function BlogPostFlow() {
	const [ currentStep, setCurrentStep ] = useState( Steps.start );

	return (
		<>
			{ currentStep !== Steps.start ? null : (
				<Start onExit={ () => setCurrentStep( Steps.selectContent ) } />
			) }
			{ currentStep !== Steps.selectContent ? null : (
				<SelectContent
					onExit={ () => setCurrentStep( Steps.finish ) }
				/>
			) }
			{ currentStep !== Steps.finish ? null : <Finish /> }
		</>
	);
}
