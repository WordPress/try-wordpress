import { Blueprint } from '@/model/blueprint/Blueprint';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { useEffect, useState } from 'react';

export function useBlueprint(
	blueprintId: string
): [ Blueprint | undefined, ( blueprint: Blueprint ) => void ] {
	const [ blueprint, setBlueprint ] = useState< Blueprint >();
	const { apiClient } = useSessionContext();

	useEffect( () => {
		if ( apiClient ) {
			apiClient.blueprints
				.findById( blueprintId )
				.then( ( bp ) => {
					if ( ! bp ) {
						throw Error(
							`blueprint with id ${ blueprintId } not found`
						);
					}
					setBlueprint( bp );
				} )
				.catch( console.error );
		}
	}, [ blueprintId, apiClient ] );

	return [ blueprint, setBlueprint ];
}
