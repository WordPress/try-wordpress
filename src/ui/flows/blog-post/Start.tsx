import { ContentBus } from '@/bus/ContentBus';

export function Start( props: { onExit: () => void } ) {
	const { onExit } = props;
	return (
		<>
			<div>
				Navigate to the page of the post you&apos;d like to import
			</div>
			<button
				onClick={ async () => {
					await ContentBus.enableHighlighting();
					onExit();
				} }
			>
				Continue
			</button>
		</>
	);
}
