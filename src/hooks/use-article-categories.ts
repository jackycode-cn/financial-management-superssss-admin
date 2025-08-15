import { reqArticlecategoryfindall } from "@/api/services/ArticleCategory";
import type { Category } from "@/types/normal";
import type { PaginationProps } from "antd";
import { type Dispatch, type SetStateAction, useCallback, useEffect, useState } from "react";

export function useArticleCategories(): [
	Category[],
	Dispatch<SetStateAction<Category[]>>,
	() => Promise<void>, // fetchData
	PaginationProps, // pagination
] {
	const [categoryList, setCategoryList] = useState<Category[]>([]);
	const [pagination, setPagination] = useState<PaginationProps>({
		total: 0,
		pageSize: 0,
		current: 0,
	});

	const fetchData = useCallback(async () => {
		const { items, pagination } = await reqArticlecategoryfindall();
		const data = items.map((item) => ({
			label: item.name,
			value: item.id,
		}));
		setPagination({
			pageSize: pagination.pageSize,
			total: pagination.total,
			current: pagination.page,
		});
		setCategoryList(data);
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return [categoryList, setCategoryList, fetchData, pagination];
}
