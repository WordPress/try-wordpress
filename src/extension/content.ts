import { Message } from '@/bus/Message';
import { ContentBus } from '@/bus/ContentBus';
import { AppBus } from '@/bus/AppBus';

let currentElement: HTMLElement | null = null;

ContentBus.listen( ( message: Message ) => {
	switch ( message.action ) {
		case ContentBus.actions.EnableHighlighting:
			document.body.addEventListener( 'mouseover', onMouseOver );
			document.body.addEventListener( 'mouseout', onMouseOut );
			document.body.addEventListener( 'click', onClick );
			break;
		case ContentBus.actions.DisableHighlighting:
			document.body.removeEventListener( 'mouseover', onMouseOver );
			document.body.removeEventListener( 'mouseout', onMouseOut );
			document.body.removeEventListener( 'click', onClick );
			removeStyle();
			break;
		default:
			console.error( `Unknown action: ${ message.action }` );
			break;
	}
} );

function onClick( event: MouseEvent ) {
	event.preventDefault();
	const element = event.target as HTMLElement;
	if ( ! element ) {
		return;
	}
	const clone = element.cloneNode( true ) as HTMLElement;
	clone.style.outline = '';
	const content = clone.outerHTML.trim();
	void AppBus.elementClicked( content );
}

function onMouseOver( event: MouseEvent ) {
	const element = event.target as HTMLElement | null;
	if ( ! element ) {
		return;
	}
	currentElement = element;
	currentElement.style.outline = '1px solid blue';
	toggleCursorStyle();
}

function onMouseOut( event: MouseEvent ) {
	const element = event.target as HTMLElement | null;
	if ( ! element ) {
		return;
	}
	removeStyle();
	currentElement = null;
}

function removeStyle() {
	if ( ! currentElement ) {
		return;
	}
	currentElement.style.outline = '';
	toggleCursorStyle();
}

function toggleCursorStyle() {
	const styleId = 'hover-highlighter-style';
	let style = document.getElementById( styleId );
	if ( style ) {
		// If the style element exists, remove it
		style.remove();
	} else {
		// If the style element does not exist, create and inject it
		style = document.createElement( 'style' );
		style.id = styleId;
		style.textContent = `
		*:hover {
			cursor: crosshair !important;
		}
	  `;
		document.head.append( style );
	}
}
