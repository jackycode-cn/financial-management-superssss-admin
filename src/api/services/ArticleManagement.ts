import { apiClient } from "../apiClient";

import type {
	ArticleEntity,
	ArticlesEntities,
	Ate,
	CreateArticleDto,
	CreateArticleEntity,
	Reqarticlefindallquery,
	UpdateArticleDto,
} from "#/api";

/**
 *创建文章
 */
export async function reqArticlecreate(data: CreateArticleDto): Promise<CreateArticleEntity> {
	return await apiClient.post("/api/article", data);
}

/**
 *获取文章列表
 */
export async function reqArticlefindall(query: Reqarticlefindallquery): Promise<ArticlesEntities> {
	return await apiClient.get("/api/article", {
		params: query,
	});
}

/**
 *获取文章详情
 */
export async function reqArticlefindone(id: string): Promise<ArticleEntity> {
	return await apiClient.get(`/api/article/${id}`);
}

/**
 *更新文章
 */
export async function reqArticleupdate(id: string, data: UpdateArticleDto): Promise<Ate> {
	return await apiClient.post(`/api/article/${id}`, data);
}

/**
 *删除文章
 */
export async function reqArticleremove(id: string): Promise<string> {
	return await apiClient.delete(`/api/article/${id}`);
}
