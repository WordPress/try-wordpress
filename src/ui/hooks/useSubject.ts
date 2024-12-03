import { Subject, SubjectType } from '@/model/Subject';
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
			let subj = await apiClient!.subjects.findBySourceUrl(
				type,
				sourceUrl
			);
			if ( ! subj ) {
				subj = await apiClient!.subjects.create( type, sourceUrl );
			}
			setSubject( subj );
		}
		loadSubject().catch( console.error );
	}, [ type, sourceUrl, apiClient ] );

	return [ subject, setSubject ];
}
