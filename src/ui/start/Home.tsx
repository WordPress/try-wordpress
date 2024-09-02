import { useLoaderData, useNavigate } from 'react-router-dom';
import { Screens } from '@/ui/App';
import { Session } from '@/storage/session';

export function Home() {
	const navigate = useNavigate();
	const sessions = useLoaderData() as Session[];
	return (
		<>
			<h1>
				Welcome to <br />
				Try WordPress
			</h1>
			<SessionPicker sessions={ sessions } />
			<button onClick={ () => navigate( Screens.newSession() ) }>
				Start a new Import
			</button>
		</>
	);
}

function SessionPicker( props: { sessions: Session[] } ) {
	const { sessions } = props;
	const navigate = useNavigate();

	if ( sessions.length === 0 ) {
		return;
	}

	return (
		<>
			<p>Continue a previous Import:</p>
			<ul>
				{ sessions.map( ( session ) => {
					return (
						<li key={ session.id }>
							<button
								onClick={ () =>
									navigate(
										Screens.viewSession( session.id )
									)
								}
							>
								{ session.title } ({ session.url })
							</button>
						</li>
					);
				} ) }
			</ul>
			<p>Or:</p>
		</>
	);
}
