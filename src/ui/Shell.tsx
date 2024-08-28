import { Container, createRoot } from 'react-dom/client';
import { App } from '@/ui/App';
import { Preview } from '@/ui/Preview';

function Shell() {
	return (
		<div className="shell">
			<App />
			<Preview />
		</div>
	);
}

export function bootUI() {
	const root = createRoot( document.getElementById( 'app' ) as Container );
	root.render( <Shell /> );
}
