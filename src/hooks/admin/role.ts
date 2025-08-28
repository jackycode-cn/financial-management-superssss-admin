import { reqRolefindall } from "@/api/services";
import type { RoleOneEntity } from "@/types";
import { convertListToTree } from "@/utils/convertListToTree";
import { printErrorAndThrow } from "@/utils/printError";
import type { TablePaginationConfig } from "antd";
import { useCallback } from "react";
import { useTreeDataBase } from "../share/useTreeDataBase";

export function useLoadRoleData(pagn: TablePaginationConfig = { pageSize: 2000 }) {
	const {
		treeData,
		setTreeData,
		pagination: [pagination, setPagination],
	} = useTreeDataBase<RoleOneEntity>(pagn);

	const loadData = useCallback(async () => {
		if (!pagination.current) {
			return;
		}
		try {
			const { items, pagination: pagnRes } = await reqRolefindall({
				page: pagination.current,
				pageSize: pagination.pageSize,
			});
			setTreeData(convertListToTree(items, null, "id", "parentId"));
			setPagination((prev) => ({
				...prev,
				total: pagnRes.total,
				current: pagnRes.page,
				pageSize: pagnRes.pageSize,
				showSizeChanger: true,
			}));

			return { items, pagination: pagnRes };
		} catch (error) {
			printErrorAndThrow(error, "加載角色數據出錯");
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
