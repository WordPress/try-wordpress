import { Session } from '@/storage/session';

export function Preview( props: { session: Session } ) {
	const { session } = props;
	return (
		<>
			<span>Preview { `${ session.id }` }</span>
		</>
	);
}
