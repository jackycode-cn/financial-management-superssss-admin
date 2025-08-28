import { reqUserfindall } from "@/api/services";
import type { Requserfindallquery, UserEntity } from "@/types";
import { printError } from "@/utils/printError";
import { type TablePaginationConfig, message } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { omitBy } from "lodash";
import { useCallback, useEffect, useState } from "react";

export type FilterParamsType = {
	createTimeRange?: [Dayjs, Dayjs];
} & Requserfindallquery & {
		disabled?: 0 | 1;
		deleted?: 0 | 1;
	};

export function useUserList(defaultPageSize = 8, autoLoad = true) {
	const [users, setUsers] = useState<UserEntity[]>([]);
	const [loading, setLoading] = useState(false);
	const [filterParams, setFilterParams] = useState<FilterParamsType>({});
	const [pagination, setPagination] = useState<TablePaginationConfig>({
		current: 1,
		pageSize: defaultPageSize,
		total: 0,
		showSizeChanger: true,
	});

	const getQueryParams = useCallback(
		(params: FilterParamsType = {}) => {
			const paginationParams = {
				page: pagination.current ?? 1,
				pageSize: pagination.pageSize ?? defaultPageSize,
			};

			const filteredParams: Requserfindallquery = omitBy(
				{
					...paginationParams,
					...params,
				},
				(v) => v === "" || v === undefined,
			);

			if (params.createTimeRange) {
				filteredParams.createTimeRange = {
					startTime: dayjs(params.createTimeRange[0]).toISOString(),
					endTime: dayjs(params.createTimeRange[1]).toISOString(),
				};
			}

			if ([0, 1].includes(filteredParams.disabled as any)) {
				filteredParams.disabled = Boolean(filteredParams.disabled);
			}
			if ([0, 1].includes(filteredParams.deleted as any)) {
				filteredParams.deleted = Boolean(filteredParams.deleted);
			}

			return filteredParams;
		},
		[pagination.current, pagination.pageSize, defaultPageSize],
	);

	/** 加载用户数据 */
	const loadUsers = useCallback(
		async (params: FilterParamsType = {}, isRefresh = false) => {
			setLoading(true);
			try {
				setFilterParams((prev) => (isRefresh ? prev : params));
				const filterInfo = getQueryParams(params);

				if (isRefresh) {
					filterInfo.page = pagination.current;
					filterInfo.pageSize = pagination.pageSize;
				}

				const res = await reqUserfindall(filterInfo);
				setUsers(res.items);
				setPagination({
					current: res.pagination.page,
					pageSize: res.pagination.pageSize,
					total: res.pagination.total,
					showSizeChanger: true,
				});

				if (!isRefresh) {
					message.success("用戶數據加載成功");
				}
			} catch (error: any) {
				printError(error, "用戶數據加載出錯");
				throw error;
			} finally {
				setLoading(false);
			}
		},
		[getQueryParams, pagination.current, pagination.pageSize],
	);

	const changePagination = useCallback(
		(newPagination: TablePaginationConfig) => {
			setPagination((prev) => ({
				...prev,
				current: newPagination.current || 1,
				pageSize: newPagination.pageSize || defaultPageSize,
			}));

			loadUsers(
				{
					...filterParams,
					page: newPagination.current ?? 1,
					pageSize: newPagination.pageSize ?? defaultPageSize,
				},
				true,
			);
		},
		[filterParams, loadUsers, defaultPageSize],
	);

	useEffect(() => {
		if (autoLoad) {
			loadUsers();
		}
	}, [autoLoad, loadUsers]);

	return {
		users,
		pagination,
		loading,
		loadUsers,
		changePagination,
		getQueryParams,
	};
}
