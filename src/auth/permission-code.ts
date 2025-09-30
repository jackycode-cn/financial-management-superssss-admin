/** 此处权限码给后端给出的对应的权限码 */
export enum PERMISSION_CODE {
	// 系統管理
	MENU_ADMIN = "menu:admin",
	BUTTON_ADMIN = "button:admin",
	// 文章分类管理
	MENU_ARTICLE_CATEGORY = "menu:article:category",
	// 文章管理
	MENU_ARTICLE = "menu:article",
	// 文章查看
	MENU_ARTICLE_VIEW = "menu:article:view",
	/** 读取权限的权限 */
	PERMISSION_READ = "permission:read",
}

export type PermissionCode = `${PERMISSION_CODE}`;
