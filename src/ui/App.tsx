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
import { StrictMode, useEffect, useState } from 'react';
import { NewSession } from '@/ui/start/NewSession';
import { ViewSession } from '@/ui/session/ViewSession';
import { Home } from '@/ui/start/Home';
import { getConfig, setConfig } from '@/storage/config';
import { getSession, listSessions, Session } from '@/storage/session';
import { PlaceholderPreview } from '@/ui/preview/PlaceholderPreview';
import { SessionContext, SessionProvider } from '@/ui/session/SessionProvider';
import { ApiClient } from '@/api/ApiClient';
import { PlaygroundClient } from '@wp-playground/client';
import { Breadcrumbs } from '@/ui/breadcrumbs/Breadcrumbs';
import { NewBlueprint } from '@/ui/blueprints/NewBlueprint';
import { EditBlueprint } from '@/ui/blueprints/EditBlueprint';
import { PostType } from '@/model/content/Post';

export const Screens = {
	home: () => '/start/home',
	newSession: () => '/start/new-session',
	viewSession: ( sessionId: string ) => `/session/${ sessionId }`,
	blueprints: {
		new: ( sessionId: string, postType: PostType ) =>
			`/session/${ sessionId }/blueprints/new/${ postType }`,
		edit: ( sessionId: string, postId: string ) =>
			`/session/${ sessionId }/blueprints/${ postId }`,
	},
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
				<Route path="blueprints">
					<Route path="new/:postType" element={ <NewBlueprint /> } />
					<Route path=":blueprintId" element={ <EditBlueprint /> } />
				</Route>
			</Route>
		</Route>
	);
}

function App() {
	const navigate = useNavigate();
	const location = useLocation();
	useEffect( () => {
		setConfig( { currentPath: location.pathname } ).catch( ( err ) =>
			console.log( err )
		);
	}, [ location ] );

	const session = useRouteLoaderData( 'session' ) as Session;
	const [ playgroundClient, setPlaygroundClient ] =
		useState< PlaygroundClient >();
	const [ apiClient, setApiClient ] = useState< ApiClient >();
	const sectionContext: SessionContext = {
		session,
		apiClient,
		playgroundClient,
	};

	// Debugging tools.
	useEffect( () => {
		if ( ! ( window as any ).trywp ) {
			( window as any ).trywp = {
				navigateTo: ( url: string ) => navigate( url ),
			};
		}
		if ( apiClient ) {
			( window as any ).trywp.apiClient = apiClient;
			( window as any ).trywp.playgroundClient = playgroundClient;
		}
	}, [ apiClient, playgroundClient, navigate ] );

	const preview = ! session ? (
		<PlaceholderPreview />
	) : (
		<Preview
			onReady={ async ( client: PlaygroundClient ) => {
				// Because client is "function-y", we need to wrap it in a function so that React doesn't call it.
				// See: https://react.dev/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead.
				setPlaygroundClient( () => client );
				setApiClient(
					new ApiClient( client, await client.absoluteUrl )
				);
			} }
		/>
	);

	return (
		<SessionProvider value={ sectionContext }>
			<div className="app">
				<Breadcrumbs className="breadcrumbs" />
				<div className="app-main">
					<Outlet />
				</div>
			</div>
			<div className="preview">{ preview }</div>
		</SessionProvider>
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
