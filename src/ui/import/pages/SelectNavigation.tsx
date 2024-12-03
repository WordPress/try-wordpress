import { useNavigationHtml } from '@/ui/import/pages/useNavigationHtml';
import { useSelectedPages } from '@/ui/import/pages/useSelectedPages';
import { EventTypes } from '@/bus/Event';
import { CommandTypes, sendCommandToContent } from '@/bus/Command';
import { Screens } from '@/ui/App';
import { useSessionContext } from '@/ui/session/SessionProvider';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toolbar } from '@/ui/import/pages/Toolbar';
import { ContentEventHandler } from '@/ui/components/ContentEventHandler';

// Ask the user where the navigation is and store its html in local storage.
// Once we have the navigation html, proceed to next step.
export function SelectNavigation() {
	const { session } = useSessionContext();
	const navigate = useNavigate();
	const [ , setNavigationHtml ] = useNavigationHtml();
	const [ , setSelectedPages ] = useSelectedPages();

	// Enable highlighting in source site.
	useEffect( () => {
		void sendCommandToContent( {
			type: CommandTypes.SwitchToNavigationSelectionMode,
			payload: {},
		} );
	}, [] );

	// Disable highlighting on unmount.
	useEffect( () => {
		return () => {
			void sendCommandToContent( {
				type: CommandTypes.SwitchToDefaultMode,
				payload: {},
			} );
		};
	}, [] );

	return (
		<>
			<Toolbar backUrl={ Screens.importPagesStart( session.id ) } />
			<p>Click on one of the entries of the navigation menu.</p>
			<p>
				If the menu is not shown on screen, click the Back button and
				then open the menu.
			</p>
			<ContentEventHandler
				eventType={ EventTypes.OnElementClick }
				onEvent={ async ( event ) => {
					void sendCommandToContent( {
						type: CommandTypes.SwitchToDefaultMode,
						payload: {},
					} );
					setNavigationHtml( ( event.event.payload as any ).content );
					setSelectedPages( undefined );
					navigate( Screens.importPagesSelectPages( session.id ) );
				} }
			/>
		</>
	);
}
