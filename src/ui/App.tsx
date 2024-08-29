import { Preview } from '@/ui/Preview';
import {
	createHashRouter,
	createRoutesFromElements,
	Navigate,
	Outlet,
	Route,
	RouterProvider,
	useLocation,
} from "react-router-dom";
import { StrictMode, useEffect } from "react";
import { NewImport } from "@/ui/screens/NewImport";
import { ViewImport } from "@/ui/screens/ViewImport";
import { Home } from "@/ui/screens/Home";
import {AppData} from "@/storage/AppData";

function createRouter() {
	const savedPath = AppData.currentPath();

	return createHashRouter(
		createRoutesFromElements(
			<Route path="/" element={<App/>}>
				<Route index element={savedPath ? <Navigate to={savedPath} replace/> : <Home/>}/>
				<Route path="new-import" element={<NewImport/>}/>
				<Route path="view-import" element={<ViewImport/>}/>
			</Route>,
		)
	);
}

function App() {
	const location = useLocation();
	useEffect(() => {
		AppData.setCurrentPath(location.pathname);
	}, [location]);

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
