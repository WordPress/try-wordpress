import { useEffect, useState } from 'react';
import { Start } from '@/ui/flows/blog-post/Start';
import { SelectContent } from '@/ui/flows/blog-post/SelectContent';
import { Finish } from '@/ui/flows/blog-post/Finish';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { ApiPost } from '@/api/ApiPost';

enum Steps {
	start = 1,
	loading,
	selectContent,
	finish,
}

export function BlogPostFlow() {
	const [ currentStep, setCurrentStep ] = useState( Steps.start );
	const [ sourcePostUrl, setSourcePostUrl ] = useState< string >();
	const [ post, setPost ] = useState< ApiPost >();
	const { apiClient, playgroundClient } = useSessionContext();

	// Get existing post from the API, or create a new one.
	// Once we have the post, make playground navigate to it.
	useEffect( () => {
		if ( ! sourcePostUrl || ! apiClient ) {
			return;
		}
		const getOrCreatePost = async (): Promise< ApiPost > => {
			let p = await apiClient.getPostByGuid( sourcePostUrl );
			if ( ! p ) {
				p = await apiClient.createPost( { guid: sourcePostUrl } );
			}
			return p;
		};
		getOrCreatePost()
			.then( async ( p: ApiPost ) => {
				void playgroundClient.goTo( p.link );
				setPost( p );
				setCurrentStep( Steps.selectContent );
			} )
			.catch( ( err ) => console.error( err ) );
	}, [ sourcePostUrl, apiClient, playgroundClient ] );

	return (
		<>
			{ currentStep !== Steps.start ? null : (
				<Start
					onExit={ ( url: string ) => {
						setSourcePostUrl( url );
						setCurrentStep( Steps.loading );
					} }
				/>
			) }
			{ currentStep !== Steps.loading ? null : <div>Loading...</div> }
			{ currentStep !== Steps.selectContent || ! post ? null : (
				<SelectContent
					post={ post }
					onExit={ () => setCurrentStep( Steps.finish ) }
				/>
			) }
			{ currentStep !== Steps.finish ? null : <Finish /> }
		</>
	);
}
