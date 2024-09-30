import { useEffect, useState } from 'react';
import { ContentBus } from '@/bus/ContentBus';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { useNavigate } from 'react-router-dom';
import { Screens } from '@/ui/App';
import { Toolbar } from '@/ui/flows/blog-post/Toolbar';

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
				return;
			}
			setIsLoading( false );
		}
		maybeRedirect().catch( ( err ) => console.log( err ) );
	}, [ session.id, apiClient ] );

	const element = (
		<>
			<Toolbar>
				<button
					onClick={ async () => {
						const currentPage =
							await ContentBus.getCurrentPageInfo();
						let post = await apiClient!.posts.findByGuid(
							currentPage.url
						);
						if ( ! post ) {
							post = await apiClient!.posts.create( {
								guid: currentPage.url,
							} );
						}
						navigate(
							Screens.flows.blogPost.edit( session.id, post.id )
						);
					} }
				>
					Continue
				</button>
			</Toolbar>
			<div>
				Navigate to the page of the post you&apos;d like to import
			</div>
		</>
	);

	return <>{ isLoading ? 'Loading...' : element }</>;
}
