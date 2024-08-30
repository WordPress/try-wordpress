import { Preview } from '@/ui/Preview';
import {
	createHashRouter,
	createRoutesFromElements,
	Navigate,
	Outlet,
	Route,
	RouterProvider,
	useLocation,
	useNavigate,
} from 'react-router-dom';
import { StrictMode, useEffect } from 'react';
import { NewSession } from '@/ui/screens/NewSession';
import { ViewSession } from '@/ui/screens/ViewSession';
import { Home } from '@/ui/screens/Home';
import { LocalStorage } from '@/storage/LocalStorage';

export const Screens = {
	home: () => '/home',
	newSession: () => '/sessions/new',
	viewSession: ( id: string ) => `/sessions/${ id }`,
};

async function createRouter() {
	let initialScreen = ( await LocalStorage.currentPath() ) ?? Screens.home();
	if ( initialScreen === '/' ) {
		initialScreen = Screens.home();
	}

	return createHashRouter(
		createRoutesFromElements(
			<Route path="/" element={ <App /> }>
				<Route
					index
					element={ <Navigate to={ initialScreen } replace /> }
				/>
				<Route path="home" element={ <Home /> } />
				<Route path="sessions">
					<Route path="new" element={ <NewSession /> } />
					<Route path=":id" element={ <ViewSession /> } />
				</Route>
			</Route>
		)
	);
}

function App() {
	const location = useLocation();
	useEffect( () => {
		LocalStorage.setCurrentPath( location.pathname ).catch( ( error ) =>
			console.error( error )
		);
	}, [ location ] );

	return (
		<>
			<div className="app">
				<Navbar className={ 'app-nav' } />
				<div className="app-main">
					<Outlet />
				</div>
			</div>
			<div className="preview">
				<Preview />
			</div>
		</>
	);
}

function Navbar( props: { className: string } ) {
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

export async function createApp() {
	return (
		<StrictMode>
			<RouterProvider router={ await createRouter() } />
		</StrictMode>
	);
}
