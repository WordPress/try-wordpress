import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { BlogPost } from '@/model/content/BlogPost';
import { PostEditor } from '@/ui/posts/PostEditor';
import { ContentBus } from '@/bus/ContentBus';
import { Toolbar } from '@/ui/posts/Toolbar';
import {
	parsePostContent,
	parsePostDate,
	parsePostTitle,
} from '@/parser/blog-post';

export function EditPost() {
	const [ post, setPost ] = useState< BlogPost >();
	const { postId } = useParams();
	const { apiClient, playgroundClient } = useSessionContext();

	useEffect( () => {
		if ( ! apiClient ) {
			return;
		}
		apiClient.blogPosts
			.findById( postId! )
			.then( ( p: BlogPost | null ) => {
				if ( ! p ) {
					throw Error( `post with id ${ postId } not found` );
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
						fieldOrder={ {
							title: 0,
							date: 1,
							content: 2,
						} }
						onFieldChanged={ async ( name, field ) => {
							let fieldsToUpdate: object | undefined;
							switch ( name ) {
								case 'date':
									field = parsePostDate( field.original );
									fieldsToUpdate = { date: field };
									break;
								case 'title':
									field = parsePostTitle( field.original );
									fieldsToUpdate = { title: field };
									break;
								case 'content':
									field = parsePostContent( field.original );
									fieldsToUpdate = { content: field };
									break;
							}
							if ( ! fieldsToUpdate ) {
								return;
							}
							const p = await apiClient!.blogPosts.update(
								post.id,
								fieldsToUpdate
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
