import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { Post, PostContent, PostDate, PostTitle } from '@/model/Post';
import { SelectContent } from '@/ui/flows/blog-post/SelectContent';
import { Screens } from '@/ui/App';
import { ContentBus } from '@/bus/ContentBus';
import { Toolbar } from '@/ui/flows/blog-post/Toolbar';

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

	const isValid =
		!! post &&
		post.title.original !== '' &&
		post.date.original !== '' &&
		post.content.original !== '';

	return (
		<>
			{ ! post ? (
				'Loading...'
			) : (
				<>
					<Toolbar>
						<button
							disabled={ ! isValid }
							onClick={ async () => {
								await ContentBus.disableHighlighting();
								console.log( 'TODO: import' );
							} }
						>
							Import
						</button>
					</Toolbar>
					<SelectContent
						post={ post }
						onDateChanged={ async ( date: PostDate ) => {
							const p = await apiClient!.posts.update( post.id, {
								date,
							} );
							setPost( p );
							void playgroundClient.goTo( post.url );
						} }
						onTitleChanged={ async ( title: PostTitle ) => {
							const p = await apiClient!.posts.update( post.id, {
								title,
							} );
							setPost( p );
							void playgroundClient.goTo( post.url );
						} }
						onContentChanged={ async ( content: PostContent ) => {
							const p = await apiClient!.posts.update( post.id, {
								content,
							} );
							setPost( p );
							void playgroundClient.goTo( post.url );
						} }
					/>
				</>
			) }
		</>
	);
}
