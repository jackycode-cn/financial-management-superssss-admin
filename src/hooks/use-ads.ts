import type { Advertisement, Reqadvertisementfindallquery } from "#/api";
import { reqAdvertisementfindall } from "@/api/services/advertise";
import { printErrorAndThrow } from "@/utils/printError";
import { useCallback, useState } from "react";
import { usePagination } from "./share";

export function useAds() {
	const [loading, setLoading] = useState(false);
	const [ads, setAds] = useState<Advertisement[]>([]);
	const [pagination, setPagination] = usePagination();
	const [searchParams, setSearchParams] = useState<Reqadvertisementfindallquery>({
		keyword: "",
		page: 1,
		pageSize: 20,
		status: "ENABLED",
	});

	const getAds = useCallback(
		async (params = {}) => {
			try {
				setLoading(true);
				const finalParams = { ...searchParams, ...params };
				setSearchParams(finalParams);

				const res = await reqAdvertisementfindall({
					page: finalParams.page || 1,
					pageSize: finalParams.pageSize || 20,
					keyword: finalParams.keyword,
					status: finalParams.status,
				});

				// 如果是第一页，则替换所有数据；否则追加数据
				if (finalParams.page === 1) {
					setAds(res.items || []);
				} else {
					setAds((prev) => [...prev, ...(res.items || [])]);
				}

				setPagination({
					...pagination,
					current: finalParams.page,
					pageSize: finalParams.pageSize,
					total: res.pagination.total || 0,
				});
			} catch (error) {
				printErrorAndThrow(error, "獲取廣告失敗");
			} finally {
				setLoading(false);
			}
		},
		[searchParams, pagination, setPagination],
	);

	const loadMore = useCallback(async () => {
		const nextPage = (searchParams.page || 1) + 1;
		await getAds({
			...searchParams,
			page: nextPage,
		});
	}, [getAds, searchParams]);

	const reset = useCallback(() => {
		setAds([]);
		setPagination({
			current: 1,
			pageSize: 20,
			total: 0,
		});
		setSearchParams({
			keyword: "",
			page: 1,
			pageSize: 20,
			status: "ENABLED",
		});
	}, [setPagination]);

	const hasMore = ads.length < (pagination.total || 0);

	return {
		loading,
		ads,
		pagination,
		setPagination,
		getAds,
		loadMore,
		reset,
		hasMore,
	};
}
