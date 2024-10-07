export function findDeepestChild( html: string ): Element | undefined {
	const container = document.createElement( 'div' );
	container.innerHTML = html.trim();

	let deepestChild = container as Element;
	while ( deepestChild.firstElementChild ) {
		if ( ! deepestChild.firstElementChild ) {
			break;
		} else {
			deepestChild = deepestChild.firstElementChild;
		}
	}

	if ( deepestChild.innerHTML === html ) {
		// There are no children.
		return undefined;
	}
	return deepestChild;
}

export function getSelectors( elem: HTMLElement ) {
	const selectors = [];

	let currentElement;
	while ( ( currentElement = elem.parentElement ) ) {
		const tagName = elem.tagName.toLowerCase();
		if ( elem.id ) {
			selectors.push( tagName + '#' + elem.id );
			break;
		}

		const classes = elem.classList
			.values()
			.filter( filterSelectors )
			.toArray();

		if ( classes.length ) {
			selectors.push( tagName + '.' + classes.join( '.' ) );
		} else {
			const index =
				Array.prototype.indexOf.call( currentElement.children, elem ) +
				1;
			selectors.push( tagName + ':nth-child(' + index + ')' );
		}

		elem = currentElement;
	}

	return selectors.reverse();
}

function filterSelectors( c: string ): boolean {
	return (
		c.indexOf( 'wp-' ) > -1 ||
		c.indexOf( 'page' ) > -1 ||
		c.indexOf( 'post' ) > -1 ||
		c.indexOf( 'column' ) > -1
	);
}
