import { Preview } from '@/ui/Preview';
import {
	createHashRouter,
	createRoutesFromElements,
	Outlet,
	Route,
	RouterProvider,
} from "react-router-dom";
import { StrictMode } from "react";
import { NewImport } from "@/ui/screens/NewImport";
import { ViewImport } from "@/ui/screens/ViewImport";
import { Home } from "@/ui/screens/Home";

const router = createHashRouter(
	createRoutesFromElements(
		<Route path="/" element={<App />}>
			<Route path="" element={<Home/>}/>
			<Route path="new-import" element={<NewImport/>}/>
			<Route path="view-import" element={<ViewImport/>}/>
		</Route>,
	),
);

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
			<RouterProvider router={router} />
		</StrictMode>
	);
}
