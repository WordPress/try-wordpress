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
	const [ postUrl, setPostUrl ] = useState< string >();
	const { apiClient, playgroundClient } = useSessionContext();

	// Proceed from loading screen once the apiClient is ready.
	if ( currentStep === Steps.loading && postUrl && !! apiClient ) {
		setCurrentStep( Steps.selectContent );
	}

	// Get existing post from the API, or create a new one.
	useEffect( () => {
		if ( ! postUrl || ! apiClient ) {
			return;
		}
		const getOrCreatePost = async (): Promise< Post > => {
			let post = await apiClient.getPostByGuid( postUrl );
			if ( ! post ) {
				post = await apiClient.createPost( { guid: postUrl } );
			}
			return post;
		};
		getOrCreatePost()
			.then( async ( post: Post ) => {
				await playgroundClient.goTo( post.link );
			} )
			.catch( ( err ) => console.error( err ) );
	}, [ postUrl, apiClient ] );

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
