import { useEffect, useState } from 'react';
import { Start } from '@/ui/flows/blog-post/Start';
import { SelectContent } from '@/ui/flows/blog-post/SelectContent';
import { Finish } from '@/ui/flows/blog-post/Finish';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { Post } from '@/api/Post';

enum Steps {
	start = 1,
	loading,
	selectContent,
	finish,
}

export function BlogPostFlow() {
	const [ currentStep, setCurrentStep ] = useState( Steps.start );
	const [ sourcePostUrl, setSourcePostUrl ] = useState< string >();
	const [ post, setPost ] = useState< Post >();
	const { apiClient, playgroundClient } = useSessionContext();

	// Proceed from loading screen once the apiClient is ready.
	if ( currentStep === Steps.loading && sourcePostUrl && !! apiClient ) {
		setCurrentStep( Steps.selectContent );
	}

	// Get existing post from the API, or create a new one.
	// Once we have the post, make playground navigate to it.
	useEffect( () => {
		if ( ! sourcePostUrl || ! apiClient ) {
			return;
		}
		const getOrCreatePost = async (): Promise< Post > => {
			let p = await apiClient.getPostByGuid( sourcePostUrl );
			if ( ! p ) {
				p = await apiClient.createPost( { guid: sourcePostUrl } );
			}
			return p;
		};
		getOrCreatePost()
			.then( async ( p: Post ) => {
				setPost( p );
				void playgroundClient.goTo( p.link );
			} )
			.catch( ( err ) => console.error( err ) );
	}, [ sourcePostUrl, apiClient, playgroundClient ] );

	return (
		<>
			{ currentStep !== Steps.start ? null : (
				<Start
					onExit={ ( url: string ) => {
						setSourcePostUrl( url );
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
