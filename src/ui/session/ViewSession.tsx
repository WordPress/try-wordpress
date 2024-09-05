import { useSessionContext } from '@/ui/session/SessionProvider';
import { ApiClient, Foo } from '@/api/ApiClient';
import { useEffect, useState } from 'react';

export function ViewSession() {
	const { session, playgroundInfo } = useSessionContext();

	const apiClient = playgroundInfo?.url
		? new ApiClient( { url: playgroundInfo?.url } )
		: null;

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
	}, [ playgroundInfo ] );

	return (
		<>
			<div>view session: { session.id }</div>
			{ playgroundInfo?.url ? (
				<div>url: { playgroundInfo.url }</div>
			) : null }
			{ foo ? <div>{ foo.name }</div> : null }
		</>
	);
}
