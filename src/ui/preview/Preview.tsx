import { Session } from '@/storage/session';

export function Preview( props: { session: Session } ) {
	const { session } = props;
	return (
		<>
			<iframe id="playground" src="https://playground.wordpress.net" />
		</>
	);
}
