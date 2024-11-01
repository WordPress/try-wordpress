import { useCallback, useEffect, useRef } from 'react';
import { stopListening, startListening, Listener } from '@/bus/Bus';
import { EventType, EventWithResponder } from '@/bus/Event';

// Listen to events coming from the content script.
export function ContentEventHandler( props: {
	eventType: EventType;
	onEvent: ( event: EventWithResponder ) => void;
} ) {
	const { eventType, onEvent } = props;
	const listenerRef = useRef< Listener >();
	const callback = useCallback( onEvent, [ onEvent ] );

	// Start listening for events.
	useEffect( () => {
		if ( listenerRef.current ) {
			stopListening( listenerRef.current );
		}
		listenerRef.current = startListening( eventType, callback );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ callback ] );

	// Stop listening on unmount.
	useEffect( () => {
		return () => {
			if ( listenerRef.current !== undefined ) {
				stopListening( listenerRef.current );
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	return <></>;
}
