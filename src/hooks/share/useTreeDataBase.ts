import type { TablePaginationConfig } from "antd";
import { useState } from "react";
import { usePagination } from "./usePagination";

export type TreeLike<T, K extends string = "children"> = T & {
	[key in K]?: TreeLike<T, K>[];
};

export function useTreeDataBase<T, K extends string = "children">(pag?: TablePaginationConfig) {
	const pagination = usePagination({
		pageSize: 100,
		...pag,
	});

	const [treeData, setTreeData] = useState<TreeLike<T, K>[]>([]);

	return { treeData, pagination, setTreeData };
}
