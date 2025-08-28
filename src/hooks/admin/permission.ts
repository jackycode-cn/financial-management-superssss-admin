import { reqPermissionfindall } from "@/api/services";
import type { PermissionOneEntity } from "@/types";
import { convertListToTree } from "@/utils/convertListToTree";
import { printErrorAndThrow } from "@/utils/printError";
import type { TablePaginationConfig } from "antd";
import { useCallback } from "react";
import { useTreeDataBase } from "../share/useTreeDataBase";

export function useUserPermissionData(pag: TablePaginationConfig = { pageSize: 2000 }) {
	const {
		treeData,
		setTreeData,
		pagination: [pagination, setPagination],
	} = useTreeDataBase<PermissionOneEntity>(pag);

	/** 加载数据 */
	const loadData = useCallback(async () => {
		try {
			const { items, pagination: pagn } = await reqPermissionfindall({
				page: pagination.current,
				pageSize: pagination.pageSize,
			});

			setTreeData(convertListToTree(items, null, "id", "parentId"));

			setPagination((prev) => ({
				...prev,
				total: pagn.total,
				pageSize: pagn.pageSize,
				current: pagn.page,
				showSizeChanger: true,
			}));

			return { items, pagination: pagn };
		} catch (error) {
			printErrorAndThrow(error, "加載");
		}
	}, [pagination, setTreeData, setPagination]);

	return {
		treeData,
		setTreeData,
		pagination,
		setPagination,
		loadData,
	};
}

export type UserPermissionReturn = ReturnType<typeof useUserPermissionData>;
