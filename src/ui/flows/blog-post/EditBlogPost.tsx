import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { Post } from '@/model/Post';
import { SelectContent } from '@/ui/flows/blog-post/SelectContent';
import { Screens } from '@/ui/App';

export function EditBlogPost() {
	const [ post, setPost ] = useState< Post >();
	const { postId } = useParams();
	const { session, apiClient, playgroundClient } = useSessionContext();
	const navigate = useNavigate();

	useEffect( () => {
		if ( ! apiClient ) {
			return;
		}
		apiClient.posts.findById( postId! ).then( ( p: Post | null ) => {
			if ( ! p ) {
				// This can happen when the app initially loads with a URL that was saved in local storage.
				// Instead of throwing an error, we just send the user to the "new blog post" screen.
				navigate( Screens.flows.blogPost.new( session.id ) );
				return;
			}
			setPost( p );
			playgroundClient.goTo( p.url );
		} );
	}, [ apiClient, postId ] );

	return (
		<>
			{ ! post ? (
				'Loading...'
			) : (
				<SelectContent post={ post } onExit={ () => {} } />
			) }
		</>
	);
}
