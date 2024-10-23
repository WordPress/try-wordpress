import { Blueprint } from '@/model/blueprint/Blueprint';
import { Post, PostType } from '@/model/content/Post';
import { useEffect, useState } from 'react';
import { useSessionContext } from '@/ui/session/SessionProvider';

// Load a post to preview the blueprint's results.
// If a post already exists for the blueprint's source URL, we use that post,
// otherwise we create a new post.
export function usePostForBlueprint(
	blueprint: Blueprint | undefined
): [ Post | undefined, ( post: Post ) => void ] {
	const [ post, setPost ] = useState< Post >();
	const { apiClient } = useSessionContext();

	useEffect( () => {
		if ( ! blueprint || ! apiClient ) {
			return;
		}
		async function loadPost( bp: Blueprint ) {
			let p: Post | null;
			switch ( bp.type ) {
				case PostType.BlogPost:
					p = await apiClient!.blogPosts.findByGuid( bp.sourceUrl );
					break;
				default:
					throw Error( `unknown blueprint type ${ bp.type }` );
			}
			if ( ! p ) {
				switch ( bp.type ) {
					case PostType.BlogPost:
						p = await apiClient!.blogPosts.create( {
							guid: bp.sourceUrl,
						} );
						break;
					default:
						throw Error( `unknown post type ${ bp.type }` );
				}
			}
			setPost( p );
		}
		loadPost( blueprint ).catch( console.error );
	}, [ blueprint, apiClient ] );

	return [ post, setPost ];
}
