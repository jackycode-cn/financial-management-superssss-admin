import { reqArticlecategoryfindall } from "@/api/services/ArticleCategory";
import type { CategoryResponseDto } from "@/types";
import type { Category } from "@/types/normal";
import type { PaginationProps } from "antd";
import { type Dispatch, type SetStateAction, useCallback, useEffect, useState } from "react";

export function useArticleCategories(): [
	Category[],
	Dispatch<SetStateAction<Category[]>>,
	() => Promise<void>, // fetchData
	PaginationProps, // pagination
	CategoryResponseDto[],
	Dispatch<SetStateAction<CategoryResponseDto[]>>,
] {
	const [categoryList, setCategoryList] = useState<Category[]>([]);
	const [pagination, setPagination] = useState<PaginationProps>({
		total: 0,
		pageSize: 1000,
		current: 0,
	});
	const [categoryInfoList, setCategoryInfoList] = useState<CategoryResponseDto[]>([]);

	const fetchData = useCallback(async () => {
		const { items, pagination } = await reqArticlecategoryfindall();
		const data = items.map((item) => ({
			label: item.name,
			value: item.id,
		}));
		setCategoryInfoList(items);
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

	return [categoryList, setCategoryList, fetchData, pagination, categoryInfoList, setCategoryInfoList];
}
