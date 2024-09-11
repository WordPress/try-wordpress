import { useEffect, useState } from 'react';
import { ContentBus } from '@/bus/ContentBus';
import { Message } from '@/bus/Message';
import { AppBus } from '@/bus/AppBus';
import { Start } from '@/ui/flows/blog-post/Start';
import { SelectContent } from '@/ui/flows/blog-post/SelectContent';
import { Import } from '@/ui/flows/blog-post/Import';

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
