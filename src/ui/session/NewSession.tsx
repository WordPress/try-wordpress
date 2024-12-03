import { useNavigate } from 'react-router-dom';
import { Screens } from '@/ui/App';
import { createSession } from '@/storage/session';
import {
	CommandTypes,
	CurrentPageInfo,
	sendCommandToContent,
} from '@/bus/Command';
import { Button } from '@wordpress/components';

export function NewSession() {
	const navigate = useNavigate();
	const handleContinue = async () => {
		try {
			const info = ( await sendCommandToContent( {
				type: CommandTypes.GetCurrentPageInfo,
				payload: {},
			} ) ) as CurrentPageInfo;
			const session = await createSession( {
				url: info.url,
				title: info.title ?? new URL( info.url ).hostname,
			} );
			navigate( Screens.viewSession( session.id ) );
		} catch ( error ) {
			console.error( 'Failed to create session', error );
			return (
				<span>
					Failed to create session: { ( error as Error ).message }
				</span>
			);
		}
	};

	return (
		<>
			<p>
				Start by navigating to the main page of your site, then click
				Continue.
			</p>
			<Button
				variant="primary"
				className="button-block"
				onClick={ handleContinue }
			>
				Continue
			</Button>
		</>
	);
}
