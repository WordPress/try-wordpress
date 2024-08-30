import { useLoaderData } from 'react-router-dom';
import { Session } from '@/storage/session';

export function ViewSession() {
	const session = useLoaderData() as Session;
	return (
		<>
			<span>{ `view session: ${ session.id }` }</span>
		</>
	);
}
