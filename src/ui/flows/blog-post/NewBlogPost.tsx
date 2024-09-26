import { useEffect, useState } from 'react';
import { ContentBus } from '@/bus/ContentBus';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { useNavigate } from 'react-router-dom';
import { Screens } from '@/ui/App';

export function NewBlogPost() {
	const navigate = useNavigate();
	const [ isLoading, setIsLoading ] = useState( true );
	const { session, apiClient } = useSessionContext();

	// Check if there is already a post for the page that is currently active in the source site,
	// and if yes, redirect to that post.
	useEffect( () => {
		if ( ! apiClient ) {
			return;
		}
		async function maybeRedirect() {
			const currentPage = await ContentBus.getCurrentPageInfo();
			const post = await apiClient!.posts.findByGuid( currentPage.url );
			if ( post ) {
				navigate( Screens.flows.blogPost.edit( session.id, post.id ) );
			}
			setIsLoading( false );
		}
		maybeRedirect().catch( ( err ) => console.log( err ) );
	}, [ apiClient ] );

	return <div>{ isLoading ? 'Loading...' : 'new' }</div>;
}
