import { useSessionContext } from '@/ui/session/SessionProvider';

export function ViewSession() {
	const { session, playgroundInfo } = useSessionContext();

	return (
		<>
			<div>view session: { session.id }</div>
			{ playgroundInfo?.url ? (
				<div>url: { playgroundInfo.url }</div>
			) : null }
		</>
	);
}
