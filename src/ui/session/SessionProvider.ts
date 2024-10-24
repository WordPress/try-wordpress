import { createContext, useContext } from 'react';
import { Session } from '@/storage/session';
import { ApiClient } from '@/api/ApiClient';
import { PlaygroundClient } from '@wp-playground/client';

export interface SessionContext {
	session: Session;
	apiClient?: ApiClient;
	playgroundClient?: PlaygroundClient;
}

const sessionContext = createContext< SessionContext >( {
	session: {
		id: '',
		url: '',
		title: '',
	},
} );

export const SessionProvider = sessionContext.Provider;

export function useSessionContext() {
	return useContext( sessionContext );
}
