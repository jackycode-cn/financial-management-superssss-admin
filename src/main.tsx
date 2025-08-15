import ReactDOM from "react-dom/client";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router";
import App from "./App";
import menuService from "./api/services/menuService";
import { registerLocalIcons } from "./components/icon";
import { GLOBAL_CONFIG } from "./global-config";
import "./global.css";
import "./locales/i18n";
import ErrorBoundary from "./routes/components/error-boundary";
import { routesSection } from "./routes/sections";
import "./theme/theme.css";

await registerLocalIcons();

if (GLOBAL_CONFIG.routerMode === "backend") {
	await menuService.getMenuList();
}

const router = createBrowserRouter(
	[
		{
			Component: () => (
				<App>
					<Outlet />
				</App>
			),
			errorElement: <ErrorBoundary />,
			children: routesSection,
		},
	],
	{
		basename: GLOBAL_CONFIG.publicPath,
	},
);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<RouterProvider router={router} />);
