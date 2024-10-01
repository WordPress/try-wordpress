import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { PostEditor } from '@/ui/posts/PostEditor';
import { ContentBus } from '@/bus/ContentBus';
import { Toolbar } from '@/ui/posts/Toolbar';
import {
	parsePostContent,
	parsePostDate,
	parsePostTitle,
} from '@/parser/blog-post';
import { Post, PostType } from '@/model/content/Post';

export function EditPost() {
	const [ post, setPost ] = useState< Post >();
	const { postId } = useParams();
	const { apiClient, playgroundClient } = useSessionContext();

	useEffect( () => {
		if ( ! apiClient ) {
			return;
		}
		async function loadPost() {
			const genericPost = await apiClient!.posts.findById( postId! );
			if ( ! genericPost ) {
				throw Error( `post with id ${ postId } not found` );
			}
			let p: Post | null;
			switch ( genericPost.type ) {
				case PostType.BlogPost:
					p = await apiClient!.blogPosts.findById( postId! );
					break;
				default:
					throw Error( `unknown post type ${ genericPost.type }` );
			}
			if ( ! p ) {
				throw Error( `post with id ${ postId } not found` );
			}
			setPost( p );
			playgroundClient.goTo( p.url );
		}
		loadPost().catch( console.error );
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
