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
	const { apiClient, playgroundClient } = useSessionContext();

	// Proceed from loading screen once the apiClient is ready.
	if ( currentStep === Steps.loading && sourcePostUrl && !! apiClient ) {
		setCurrentStep( Steps.selectContent );
	}

	// Get existing post from the API, or create a new one.
	useEffect( () => {
		if ( ! sourcePostUrl || ! apiClient ) {
			return;
		}
		const getOrCreatePost = async (): Promise< Post > => {
			let post = await apiClient.getPostByGuid( sourcePostUrl );
			if ( ! post ) {
				post = await apiClient.createPost( { guid: sourcePostUrl } );
			}
			return post;
		};
		getOrCreatePost()
			.then( async ( post: Post ) => {
				await playgroundClient.goTo( post.link );
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
