import { createContext, useContext } from 'react';
import { Session } from '@/storage/session';
import { PlaygroundInfo } from '@/ui/preview/Playground';

export interface SessionContext {
	session: Session;
	playgroundInfo?: PlaygroundInfo;
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
