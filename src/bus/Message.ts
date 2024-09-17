export const Namespace = 'TRY_WORDPRESS';

export interface Message {
	namespace: string;
	action: number;
	payload: object;
}

export type Listener = ( message: Message ) => void;
