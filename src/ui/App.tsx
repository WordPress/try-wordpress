import { Main } from '@/ui/Main';
import { Preview } from '@/ui/Preview';
import { createElement } from "react";

function App() {
	return (
		<div className="app">
			<Main />
			<Preview />
		</div>
	);
}

export function createApp() {
	return createElement( App, {}, null );
}
