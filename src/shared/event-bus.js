export class EventBus {
	#window;
	#targetWindow;
	#listeners;

	constructor( options = {} ) {
		if ( ! options.targetWindow ) {
			throw Error( 'targetWindow option must be set' );
		}
		this.#targetWindow = options.targetWindow;
		this.#window = options.window || window;
		this.#listeners = [];
		this.#window.addEventListener( 'message', this.handleEvent );
	}

	addListener( type, callback ) {
		// TODO.
		console.log( type, callback );
	}

	handleEvent( event ) {
		// TODO.
		console.log( event.target );
	}
}
