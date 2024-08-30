import { Preview } from '@/ui/preview/Preview';
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
	useRouteLoaderData,
} from 'react-router-dom';
import { StrictMode, useEffect } from 'react';
import { NewSession } from '@/ui/start/NewSession';
import { ViewSession } from '@/ui/session/ViewSession';
import { Home } from '@/ui/start/Home';
import { getConfig, setConfig } from '@/storage/config';
import { getSession, listSessions, Session } from '@/storage/session';
import { PlaceholderPreview } from '@/ui/preview/PlaceholderPreview';

export const Screens = {
	home: () => '/start/home',
	newSession: () => '/start/new-session',
	viewSession: ( id: string ) => `/session/${ id }`,
};

const homeLoader: LoaderFunction = async () => {
	return await listSessions();
};

const sessionLoader: LoaderFunction = async ( { params } ) => {
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
			<Route path="start">
				<Route path="home" element={ <Home /> } loader={ homeLoader } />
				<Route path="new-session" element={ <NewSession /> } />
			</Route>
			<Route
				id="session"
				path="session/:sessionId"
				loader={ sessionLoader }
			>
				<Route path="" element={ <ViewSession /> } />
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

	const session = useRouteLoaderData( 'session' ) as Session;

	const preview = ! session ? (
		<PlaceholderPreview />
	) : (
		<Preview session={ session } />
	);

	return (
		<>
			<div className="app">
				<Navbar className={ 'app-nav' } />
				<div className="app-main">
					<Outlet context={ session } />
				</div>
			</div>
			<div className="preview">{ preview }</div>
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
