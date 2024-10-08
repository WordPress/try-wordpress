import { PropsWithChildren } from 'react';

export function Toolbar( props: PropsWithChildren ) {
	return <div className="posts-toolbar">{ props.children }</div>;
}
