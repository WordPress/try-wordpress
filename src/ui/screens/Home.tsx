import { useNavigate } from 'react-router-dom';
import { Screens } from '@/ui/App';

export function Home() {
	const navigate = useNavigate();
	return (
		<>
			<h1>
				Welcome to <br />
				Try WordPress
			</h1>
			<button onClick={ () => navigate( Screens.newSession() ) }>
				Start Import
			</button>
		</>
	);
}
