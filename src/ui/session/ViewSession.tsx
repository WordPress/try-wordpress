import { useSessionContext } from '@/ui/session/SessionProvider';
import { Post } from '@/api/ApiClient';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Screens } from '@/ui/App';

export function ViewSession() {
	const { session, apiClient } = useSessionContext();

	const [ posts, setPosts ] = useState< Post[] >( [] );
	useEffect( () => {
		if ( ! apiClient ) {
			return;
		}
		const getPosts = async () => {
			setPosts( await apiClient.getPosts() );
		};
		void getPosts();
	}, [ apiClient?.siteUrl ] );

	return (
		<>
			<h1>
				{ session.title } ({ session.url })
			</h1>
			<ul>
				<li>
					<Link to={ Screens.flowBlogPost( session.id ) }>
						Import Blog Post
					</Link>
				</li>
			</ul>
		</>
	);
}
