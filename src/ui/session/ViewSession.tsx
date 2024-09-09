import { useSessionContext } from '@/ui/session/SessionProvider';
import { Foo } from '@/api/ApiClient';
import { useEffect, useState } from 'react';

export function ViewSession() {
	const { session, apiClient } = useSessionContext();

	const [ foo, setFoo ] = useState< Foo >();
	useEffect( () => {
		if ( ! apiClient ) {
			return;
		}
		const getFoo = async () => {
			const result = await apiClient?.getFoo();
			setFoo( result );
		};
		void getFoo();
	}, [ apiClient?.siteUrl ] );

	return (
		<>
			<div>view session: { session.id }</div>
			{ apiClient?.siteUrl ? (
				<div>url: { apiClient.siteUrl }</div>
			) : null }
			{ foo ? <div>{ foo.name }</div> : null }
		</>
	);
}
