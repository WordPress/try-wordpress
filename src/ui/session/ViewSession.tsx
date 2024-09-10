import { useSessionContext } from '@/ui/session/SessionProvider';
import { Post } from '@/api/ApiClient';
import { useEffect, useState } from 'react';

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
			<div>view session: { session.id }</div>
			{ apiClient?.siteUrl ? (
				<div>url: { apiClient.siteUrl }</div>
			) : null }
			<ul>
				{ posts.map( ( post ) => {
					return <li key={ post.id }>{ post.title }</li>;
				} ) }
			</ul>
			{ apiClient ? (
				<button
					onClick={ async () => {
						await apiClient?.createPost();
					} }
				>
					Create post
				</button>
			) : null }
		</>
	);
}
