import { reqUsergetpermissions } from "@/api/services";
import { GLOBAL_CONFIG } from "@/global-config";
import DashboardLayout from "@/layouts/dashboard";
import LoginAuthGuard from "@/routes/components/login-auth-guard";
import { filterRoutesByPermissions } from "@/routes/utils/filterRoutesByPermissions";
import useUserStore from "@/store/userStore";
import { Navigate } from "react-router";
import { type RouteObjectWithMeta, frontendDashboardRoutes } from "./frontend";

const getRoutes = async (): Promise<RouteObjectWithMeta[]> => {
	// 获取所有的权限
	const accessCodes = await reqUsergetpermissions();
	// userStore.actions;

	const permissionCodes = [...accessCodes.buttonPermissions, ...accessCodes.menuPermissions];
	useUserStore.getState().actions.setPermissions(permissionCodes);
	useUserStore.getState().actions.setButtonPermissions(accessCodes.buttonPermissions);
	useUserStore.getState().actions.setMenuPermissions(accessCodes.menuPermissions);
	// userStore.actions.setPermissions(permissionCodes);
	// 过滤出前端路由中需要的权限 如果在定义路由的meta里面包含着权限值 但是权限值不在accessCodes中 则过滤掉
	const filteredFrontendRoutes = filterRoutesByPermissions(frontendDashboardRoutes, accessCodes.menuPermissions);
	return filteredFrontendRoutes;
};

export const dashboardRoutes: RouteObjectWithMeta[] = [
	{
		element: (
			<LoginAuthGuard>
				<DashboardLayout />
			</LoginAuthGuard>
		),
		children: [{ index: true, element: <Navigate to={GLOBAL_CONFIG.defaultRoute} replace /> }, ...(await getRoutes())],
	},
];
