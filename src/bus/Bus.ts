import MessageSender = browser.runtime.MessageSender;
import { EventType, EventWithNamespace, EventWithResponder } from '@/bus/Event';

export const Namespace = 'TRY_WORDPRESS';
export type EventSender = MessageSender;

export type Listener = (
	event: EventWithNamespace,
	sender: EventSender,
	sendResponse: ( response: any ) => void
) => void;

export function startListening(
	eventType: EventType,
	callback: ( event: EventWithResponder ) => void
): Listener {
	const internalListener = (
		event: EventWithNamespace,
		sender: EventSender,
		sendResponse: ( response?: any ) => void
	) => {
		if ( event.namespace === Namespace && event.type === eventType ) {
			callback( { event, sendResponse } );
		}
	};
	browser.runtime.onMessage.addListener( internalListener );
	return internalListener;
}

export function stopListening( listener: Listener ) {
	if ( browser.runtime.onMessage.hasListener( listener ) ) {
		browser.runtime.onMessage.removeListener( listener );
	}
}
