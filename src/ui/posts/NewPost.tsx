import { useEffect, useState } from 'react';
import { ContentBus } from '@/bus/ContentBus';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { Screens } from '@/ui/App';
import { Toolbar } from '@/ui/posts/Toolbar';
import { humanReadablePostType, Post, PostType } from '@/model/content/Post';

export function NewPost() {
	const params = useParams();
	const postType = params.postType as PostType;
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
			let post: Post | null;
			switch ( postType ) {
				case PostType.BlogPost:
					post = await apiClient!.blogPosts.findByGuid(
						currentPage.url
					);
					break;
				default:
					throw new Error( `unknown post type ${ postType }` );
			}
			if ( post ) {
				navigate( Screens.posts.edit( session.id, post.id ) );
				return;
			}
			setIsLoading( false );
		}
		maybeRedirect().catch( ( err ) => console.log( err ) );
	}, [ session.id, apiClient, postType ] );

	const element = (
		<>
			<Toolbar>
				<button
					onClick={ async () => {
						const currentPage =
							await ContentBus.getCurrentPageInfo();
						let post: Post | null;
						switch ( postType ) {
							case PostType.BlogPost:
								post = await apiClient!.blogPosts.findByGuid(
									currentPage.url
								);
								if ( ! post ) {
									post = await apiClient!.blogPosts.create( {
										guid: currentPage.url,
									} );
								}
								break;
							default:
								throw new Error(
									`unknown post type ${ postType }`
								);
						}
						navigate( Screens.posts.edit( session.id, post.id ) );
					} }
				>
					Continue
				</button>
			</Toolbar>
			<div>
				Navigate to the page of the{ ' ' }
				{ humanReadablePostType.get( postType ) } you&apos;d like to
				import
			</div>
		</>
	);

	return <>{ isLoading ? 'Loading...' : element }</>;
}
