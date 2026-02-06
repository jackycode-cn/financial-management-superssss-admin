import { reqAdpositionsfindall } from "@/api/services/Advertisingspacemanagement";
import type { AdPositionResponseDto } from "@/types";
import { printErrorAndThrow } from "@/utils/printError";
import { useCallback, useState } from "react";
import { usePagination } from "../share";

export function useAdPositions() {
	const [loading, setLoading] = useState(false);
	const [positions, setPositions] = useState<AdPositionResponseDto[]>([]);
	const [pagination, setPagination] = usePagination();
	const [searchParams, setSearchParams] = useState({
		keyword: "",
		page: 1,
		pageSize: 20,
		status: true as boolean | undefined,
	});

	const getPositions = useCallback(
		async (params = {}) => {
			try {
				setLoading(true);
				const finalParams = { ...searchParams, ...params };
				setSearchParams(finalParams);

				const res = await reqAdpositionsfindall({
					page: finalParams.page || 1,
					pageSize: finalParams.pageSize || 20,
					keyword: finalParams.keyword,
					status: finalParams.status,
				});

				// 如果是第一页，则替换所有数据；否则追加数据
				if (finalParams.page === 1) {
					setPositions(res.items || []);
				} else {
					setPositions((prev) => [...prev, ...(res.items || [])]);
				}

				setPagination({
					...pagination,
					current: finalParams.page,
					pageSize: finalParams.pageSize,
					total: res.pagination?.total || 0,
				});
			} catch (error) {
				printErrorAndThrow(error, "獲取廣告位置失敗");
			} finally {
				setLoading(false);
			}
		},
		[searchParams, pagination, setPagination],
	);

	const loadMore = useCallback(async () => {
		const nextPage = (searchParams.page || 1) + 1;
		await getPositions({
			...searchParams,
			page: nextPage,
		});
	}, [getPositions, searchParams]);

	const reset = useCallback(() => {
		setPositions([]);
		setPagination({
			current: 1,
			pageSize: 20,
			total: 0,
		});
		setSearchParams({
			keyword: "",
			page: 1,
			pageSize: 20,
			status: true,
		});
	}, [setPagination]);

	const hasMore = positions.length < (pagination.total || 0);

	return {
		loading,
		positions,
		pagination,
		setPagination,
		getPositions,
		loadMore,
		reset,
		hasMore,
	};
}
