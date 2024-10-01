import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { BlogPost } from '@/model/content/BlogPost';
import { PostEditor } from '@/ui/flows/blog-post/PostEditor';
import { Screens } from '@/ui/App';
import { ContentBus } from '@/bus/ContentBus';
import { Toolbar } from '@/ui/flows/blog-post/Toolbar';
import { DateField, HtmlField, TextField } from '@/model/content/Post';

export function EditBlogPost() {
	const [ post, setPost ] = useState< BlogPost >();
	const { postId } = useParams();
	const { session, apiClient, playgroundClient } = useSessionContext();
	const navigate = useNavigate();

	useEffect( () => {
		if ( ! apiClient ) {
			return;
		}
		apiClient.blogPosts
			.findById( postId! )
			.then( ( p: BlogPost | null ) => {
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
		post.fields.title.original !== '' &&
		post.fields.date.original !== '' &&
		post.fields.content.original !== '';

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
					<PostEditor
						post={ post }
						onDateChanged={ async ( date: DateField ) => {
							const p = await apiClient!.blogPosts.update(
								post.id,
								{
									date,
								}
							);
							setPost( p );
							void playgroundClient.goTo( post.url );
						} }
						onTitleChanged={ async ( title: TextField ) => {
							const p = await apiClient!.blogPosts.update(
								post.id,
								{
									title,
								}
							);
							setPost( p );
							void playgroundClient.goTo( post.url );
						} }
						onContentChanged={ async ( content: HtmlField ) => {
							const p = await apiClient!.blogPosts.update(
								post.id,
								{
									content,
								}
							);
							setPost( p );
							void playgroundClient.goTo( post.url );
						} }
					/>
				</>
			) }
		</>
	);
}
