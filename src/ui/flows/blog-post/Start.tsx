import { ContentBus } from '@/bus/ContentBus';

export function Start( props: { onExit: ( postUrl: string ) => void } ) {
	const { onExit } = props;
	return (
		<>
			<div>
				Navigate to the page of the post you&apos;d like to import
			</div>
			<button
				onClick={ async () => {
					const postUrl = await ContentBus.getCurrentUrl();
					await ContentBus.enableHighlighting();
					onExit( postUrl );
				} }
			>
				Continue
			</button>
		</>
	);
}
