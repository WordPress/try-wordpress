export function Import( props: { onExit: () => void } ) {
	const { onExit } = props;
	return (
		<>
			<div>Click import to import the post</div>
			<button
				onClick={ () => {
					onExit();
				} }
			>
				Import
			</button>
		</>
	);
}
