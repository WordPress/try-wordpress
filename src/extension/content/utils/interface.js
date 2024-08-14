/**
 * Add hover styles for the element.
 * @param {HTMLElement} element
 */
export const addStyle = ( element ) => {
	if ( ! element ) {
		return;
	}

	element.style.outline = '1px solid #000';
	toggleCursorStyle();
};

const toggleCursorStyle = () => {
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
			cursor: pointer !important;
		}
	  `;
		document.head.append( style );
	}
};

/**
 * Remove hover styles for the element.
 * @param {HTMLElement} element
 */
export const removeStyle = ( element ) => {
	if ( ! element ) {
		return;
	}
	element.style.outline = '';
	toggleCursorStyle();
};

/**
 * Copy the element and its content to the clipboard.
 */
export const displayConfirmationMessage = () => {
	const message = document.createElement( 'div' );
	message.style.position = 'fixed';
	message.style.top = '0';
	message.style.left = '0';
	message.style.width = '100%';
	message.style.height = '100%';
	message.style.backgroundColor = 'rgba(56, 88, 233, 0.75)';
	message.style.color = 'white';
	message.style.fontSize = '2em';
	message.style.display = 'flex';
	message.style.justifyContent = 'center';
	message.style.alignItems = 'center';
	message.style.zIndex = '999999';
	message.innerText = 'Element copied to clipboard!';
	document.body.appendChild( message );

	setTimeout( () => {
		document.body.removeChild( message );
	}, 400 );
};

/**
 * Add user controls to the page.
 */
export const addUserControls = () => {
	const controls = document.createElement( 'div' );
	controls.id = 'pe-user-controls';
	controls.textContent = 'Click to copy';

	// Style the element
	controls.style.position = 'fixed';
	controls.style.top = '2vh';
	controls.style.left = '50%';
	controls.style.transform = 'translateX(-50%)';
	controls.style.backgroundColor = '#3858e9';
	controls.style.border = '1px solid #fff';
	controls.style.color = 'white';
	controls.style.padding = '6px 12px';
	controls.style.fontSize = '12px';
	controls.style.borderRadius = '15px';
	controls.style.cursor = 'pointer';
	controls.style.zIndex = '99999999';
	controls.style.whiteSpace = 'nowrap';

	// Add the element to the body
	document.body.appendChild( controls );

	document.addEventListener( 'mousemove', ( event ) => {
		controls.style.left = event.clientX + 60 + 'px';
		controls.style.top = event.clientY - 10 + 'px';
	} );
};

export const updateUserControlText = ( text, callback ) => {
	const controls = document.getElementById( 'pe-user-controls' );

	if ( ! controls || ! text ) {
		return;
	}

	controls.textContent = text;

	if ( callback ) {
		callback();
	}
};

/**
 * Remove the user controls from the page.
 */
export const removeUserControls = () => {
	const controls = document.getElementById( 'pe-user-controls' );
	if ( controls ) {
		document.body.removeChild( controls );
	}
};
