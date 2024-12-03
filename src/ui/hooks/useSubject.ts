import { newSubject, Subject, SubjectType } from '@/model/Subject';
import { useEffect, useState } from 'react';
import { useSessionContext } from '@/ui/session/SessionProvider';

// Create or load a Subject by its source URL.
// If a Subject already exists for the source URL, we use that Subject,
// otherwise we create a new one.
export function useSubject(
	type: SubjectType | undefined,
	sourceUrl: string | undefined
): [ Subject | undefined, ( subject: Subject ) => void ] {
	const [ subject, setSubject ] = useState< Subject >();
	const { apiClient } = useSessionContext();

	useEffect( () => {
		async function loadSubject() {
			if ( ! type || ! sourceUrl || ! apiClient ) {
				return;
			}
			let subj: Subject | null;
			switch ( type ) {
				case SubjectType.BlogPost:
					subj =
						await apiClient!.blogPosts.findBySourceUrl( sourceUrl );
					break;
				case SubjectType.Page:
					subj = await apiClient!.pages.findBySourceUrl( sourceUrl );
					break;
				default:
					throw Error( `unknown blueprint type ${ type }` );
			}
			if ( ! subj ) {
				switch ( type ) {
					case SubjectType.BlogPost:
						subj = await apiClient!.blogPosts.create(
							newSubject( type, sourceUrl )
						);
						break;
					case SubjectType.Page:
						subj = await apiClient!.pages.create(
							newSubject( type, sourceUrl )
						);
						break;
					default:
						throw Error( `unknown blueprint type ${ type }` );
				}
			}
			setSubject( subj );
		}
		loadSubject().catch( console.error );
	}, [ type, sourceUrl, apiClient ] );

	return [ subject, setSubject ];
}
