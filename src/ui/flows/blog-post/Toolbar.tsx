import { PropsWithChildren } from 'react';

export function Toolbar( props: PropsWithChildren ) {
	return <div className="flow-blog-post-toolbar">{ props.children }</div>;
}
