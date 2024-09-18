import { useState } from 'react';
import { Start } from '@/ui/flows/blog-post/Start';
import { SelectContent } from '@/ui/flows/blog-post/SelectContent';
import { Finish } from '@/ui/flows/blog-post/Finish';
import { useSessionContext } from '@/ui/session/SessionProvider';

enum Steps {
	start = 1,
	loading,
	selectContent,
	finish,
}

export function BlogPostFlow() {
	const [ currentStep, setCurrentStep ] = useState( Steps.start );
	const [ postUrl, setPostUrl ] = useState< string >();
	const { apiClient } = useSessionContext();

	// Proceed from loading screen once the apiClient is ready.
	if ( currentStep === Steps.loading && postUrl && !! apiClient ) {
		setCurrentStep( Steps.selectContent );
	}

	return (
		<>
			{ currentStep !== Steps.start ? null : (
				<Start
					onExit={ ( url: string ) => {
						setPostUrl( url );
						setCurrentStep(
							! apiClient ? Steps.loading : Steps.selectContent
						);
					} }
				/>
			) }
			{ currentStep !== Steps.loading ? null : <div>Loading...</div> }
			{ currentStep !== Steps.selectContent ? null : (
				<SelectContent
					onExit={ () => setCurrentStep( Steps.finish ) }
				/>
			) }
			{ currentStep !== Steps.finish ? null : <Finish /> }
		</>
	);
}
