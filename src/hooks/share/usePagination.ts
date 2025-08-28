import type { TablePaginationConfig } from "antd";
import { useState } from "react";

export function usePagination(pag?: TablePaginationConfig) {
	const [pagination, setPagination] = useState<TablePaginationConfig>({
		current: 1,
		pageSize: 10,
		total: 0,
		...pag,
	});
	return [pagination, setPagination] as const;
}
