import { Blueprint } from '@/model/blueprint/Blueprint';
import { Subject, SubjectType } from '@/model/subject/Subject';
import { useEffect, useState } from 'react';
import { useSessionContext } from '@/ui/session/SessionProvider';

// Create or load a Subject to preview the Blueprint's results.
// If a Subject already exists for the Blueprint's source URL, we use that Subject,
// otherwise we create a new one.
export function useSubjectForBlueprint(
	blueprint: Blueprint | undefined
): [ Subject | undefined, ( subject: Subject ) => void ] {
	const [ subject, setSubject ] = useState< Subject >();
	const { apiClient } = useSessionContext();

	useEffect( () => {
		if ( ! blueprint || ! apiClient ) {
			return;
		}
		async function loadSubject( bp: Blueprint ) {
			let p: Subject | null;
			switch ( bp.type ) {
				case SubjectType.BlogPost:
					p = await apiClient!.blogPosts.findByGuid( bp.sourceUrl );
					break;
				default:
					throw Error( `unknown blueprint type ${ bp.type }` );
			}
			if ( ! p ) {
				switch ( bp.type ) {
					case SubjectType.BlogPost:
						p = await apiClient!.blogPosts.create( {
							guid: bp.sourceUrl,
						} );
						break;
					default:
						throw Error( `unknown blueprint type ${ bp.type }` );
				}
			}
			setSubject( p );
		}
		loadSubject( blueprint ).catch( console.error );
	}, [ blueprint, apiClient ] );

	return [ subject, setSubject ];
}
