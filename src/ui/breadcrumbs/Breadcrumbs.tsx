import { useNavigate } from 'react-router-dom';
import { Screens } from '@/ui/App';

export function Breadcrumbs( props: { className: string } ) {
	const { className } = props;
	const navigate = useNavigate();
	return (
		<nav className={ className }>
			<ul>
				<button onClick={ () => navigate( Screens.home() ) }>
					Home
				</button>
			</ul>
		</nav>
	);
}
