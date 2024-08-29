import { Preview } from '@/ui/Preview';
import {
	createHashRouter,
	createRoutesFromElements, Navigate,
	Outlet,
	Route,
	RouterProvider,
} from "react-router-dom";
import { StrictMode } from "react";
import { NewImport } from "@/ui/screens/NewImport";
import { ViewImport } from "@/ui/screens/ViewImport";
import { Home } from "@/ui/screens/Home";

function createRouter() {
	const navigateTo = '/new-import';

	return createHashRouter(
		createRoutesFromElements(
			<Route path="/" element={<App/>}>
				<Route index element={navigateTo ? <Navigate to={navigateTo} replace/> : <Home/>}/>
				<Route path="new-import" element={<NewImport/>}/>
				<Route path="view-import" element={<ViewImport/>}/>
			</Route>,
		)
	);
}

function App() {
	return (
		<div className="app">
			<div className="main">
				<Outlet />
			</div>
			<Preview />
		</div>
	);
}

export function createApp() {
	return (
		<StrictMode>
			<RouterProvider router={createRouter()} />
		</StrictMode>
	);
}
