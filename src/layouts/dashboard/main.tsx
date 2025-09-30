import { AuthGuard } from "@/components/auth/auth-guard";
import { LineLoading } from "@/components/loading";
import Page403 from "@/pages/sys/error/Page403";
import { useSettings } from "@/store/settingStore";
import { cn } from "@/utils";
import { Suspense } from "react";
import { Outlet, ScrollRestoration } from "react-router";

// /**
//  * find auth by path
//  * @param path
//  * @returns
//  */
// function findAuthByPath(path: string): string[] {
// 	const foundItem = allItems.find((item) => item.path === path);
// 	return foundItem?.auth || [];
// }

// const navData = GLOBAL_CONFIG.routerMode === "frontend" ? clone(frontendNavData) : backendNavData;
// const allItems = navData.reduce((acc: any[], group) => {
// 	const flattenedItems = flattenTrees(group.items);
// 	return concat(acc, flattenedItems);
// }, []);

const Main = () => {
	const { themeStretch } = useSettings();

	// const { pathname } = useLocation();
	// const currentNavAuth = findAuthByPath(pathname);

	return (
		<AuthGuard fallback={<Page403 />}>
			<main
				data-slot="slash-layout-main"
				className={cn(
					"flex-auto w-full flex flex-col",
					"transition-[max-width] duration-300 ease-in-out",
					"px-4 sm:px-6 py-4 sm:py-6 md:px-8 mx-auto",
					{
						"max-w-full": themeStretch,
						"xl:max-w-screen-xl": !themeStretch,
					},
				)}
				style={{
					willChange: "max-width",
				}}
			>
				<Suspense fallback={<LineLoading />}>
					<Outlet />
					<ScrollRestoration />
				</Suspense>
			</main>
		</AuthGuard>
	);
};

export default Main;
