import type { RouteObjectWithMeta } from "../sections/dashboard/frontend";

/**
 * 递归过滤路由：根据用户权限过滤掉无权访问的路由（包括其所有子路由）
 * @param routes 路由配置数组
 * @param accessCodes 用户拥有的权限码列表
 * @returns 过滤后的路由数组（深拷贝，不修改原数据）
 */
export function filterRoutesByPermissions(routes: RouteObjectWithMeta[], accessCodes: string[]): RouteObjectWithMeta[] {
	return routes
		.map((route) => {
			// 1. 检查当前路由是否有权限限制
			if (route.meta?.accessCodes) {
				const hasPermission = route.meta.accessCodes.some((code) => accessCodes.includes(code));
				if (!hasPermission) {
					return null; // 无权限，整条路由（含子路由）丢弃
				}
			}

			// 2. 递归处理子路由
			let filteredChildren: RouteObjectWithMeta[] | undefined = undefined;
			if (route.children && route.children.length > 0) {
				filteredChildren = filterRoutesByPermissions(route.children, accessCodes);
				// 可选：如果子路由全被过滤掉，是否保留当前路由？
				// 目前保留（比如布局路由），你也可以加逻辑：if (filteredChildren.length === 0) return null;
			}

			// 3. 返回新对象（避免 mutate 原始路由）
			return {
				...route,
				...(filteredChildren !== undefined && filteredChildren.length > 0
					? { children: filteredChildren }
					: { children: undefined }), // 清理空 children
			};
		})
		.filter((route): route is RouteObjectWithMeta => route !== null); // 类型守卫 + 过滤 null
}
