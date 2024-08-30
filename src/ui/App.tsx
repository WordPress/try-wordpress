import { Preview } from '@/ui/Preview';
import {
	createHashRouter,
	createRoutesFromElements,
	LoaderFunction,
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
import { getConfig, setConfig } from '@/storage/config';
import { getSession } from '@/storage/session';

export const Screens = {
	home: () => '/home',
	newSession: () => '/sessions/new',
	viewSession: ( id: string ) => `/sessions/${ id }`,
};

export const sessionLoader: LoaderFunction = async ( { params } ) => {
	const sessionId = params.sessionId;
	if ( ! sessionId ) {
		throw new Response( 'sessionId param is required', { status: 404 } );
	}
	const session = await getSession( sessionId );
	if ( ! session ) {
		throw new Response( `Session with id ${ sessionId } was not found`, {
			status: 404,
		} );
	}
	return session;
};

function Routes( props: { initialScreen: string } ) {
	const { initialScreen } = props;
	return (
		<Route path="/" element={ <App /> }>
			<Route
				index
				element={ <Navigate to={ initialScreen } replace /> }
			/>
			<Route path="home" element={ <Home /> } />
			<Route path="sessions">
				<Route path="new" element={ <NewSession /> } />
				<Route
					path=":sessionId"
					element={ <ViewSession /> }
					loader={ sessionLoader }
				/>
			</Route>
		</Route>
	);
}

function App() {
	const location = useLocation();
	useEffect( () => {
		setConfig( { currentPath: location.pathname } ).catch( ( err ) =>
			console.log( err )
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
	const config = await getConfig();
	let initialScreen = config.currentPath;
	if ( ! initialScreen || initialScreen === '/' ) {
		initialScreen = Screens.home();
	}

	const router = createHashRouter(
		createRoutesFromElements( Routes( { initialScreen } ) )
	);

	return (
		<StrictMode>
			<RouterProvider router={ router } />
		</StrictMode>
	);
}
