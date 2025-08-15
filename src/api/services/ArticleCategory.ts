import { apiClient } from "../apiClient";

import type {
	CategoryResponseDto,
	CategoryResponseWithPaginationDto,
	CreateArticleCategoryDto,
	UpdateArticleCategoryDto,
} from "#/api";

/**
 *创建文章分类
 */
export async function reqArticlecategorycreate(data: CreateArticleCategoryDto): Promise<CategoryResponseDto> {
	return await apiClient.post("/api/article-category", data);
}

/**
 *获取所有文章分类
 */
export async function reqArticlecategoryfindall(): Promise<CategoryResponseWithPaginationDto> {
	return await apiClient.get("/api/article-category");
}

/**
 *获取文章分类详情
 */
export async function reqArticlecategoryfindone(id: string): Promise<CategoryResponseDto> {
	return await apiClient.get(`/api/article-category/${id}`);
}

/**
 *更新文章分类
 */
export async function reqArticlecategoryupdate(
	id: string,
	data: UpdateArticleCategoryDto,
): Promise<CategoryResponseDto> {
	return await apiClient.patch(`/api/article-category/${id}`, data);
}

/**
 *删除文章分类
 */
export async function reqArticlecategoryremove(id: string): Promise<CategoryResponseDto> {
	return await apiClient.delete(`/api/article-category/${id}`);
}
