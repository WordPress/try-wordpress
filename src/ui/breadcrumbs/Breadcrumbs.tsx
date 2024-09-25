import { Link, useLocation } from 'react-router-dom';
import { Screens } from '@/ui/App';
import { useSessionContext } from '@/ui/session/SessionProvider';

export function Breadcrumbs( props: { className: string } ) {
	const { className } = props;
	const { session } = useSessionContext();
	const location = useLocation();

	const showSession = location.pathname.startsWith( '/session' );

	return (
		<nav className={ className }>
			<ul>
				<li>
					<Link to={ Screens.home() }>Home</Link>
				</li>
				{ ! showSession ? null : (
					<li>
						<Link to={ Screens.viewSession( session.id ) }>
							{ session.title }
						</Link>
					</li>
				) }
			</ul>
		</nav>
	);
}
