import { useNavigate } from 'react-router-dom';
import { Screens } from '@/ui/App';
import { createSession } from '@/storage/session';
import { ContentBus } from '@/bus/ContentBus';

export function NewSession() {
	const navigate = useNavigate();
	const handleContinue = async () => {
		try {
			const info = await ContentBus.getCurrentPageInfo();
			if ( ! info ) {
				throw new Error( 'Failed to retrieve site info' );
			}
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
			<button onClick={ handleContinue }>Continue</button>
		</>
	);
}
