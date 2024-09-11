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

	return (
		<>
			{ currentStep !== Steps.start ? null : (
				<Start onExit={ () => setCurrentStep( Steps.selectContent ) } />
			) }
			{ currentStep !== Steps.selectContent ? null : (
				<SelectContent
					onExit={ () => setCurrentStep( Steps.import ) }
				/>
			) }
			{ currentStep !== Steps.import ? null : (
				<Import onExit={ () => console.log( 'import' ) } />
			) }
		</>
	);
}
