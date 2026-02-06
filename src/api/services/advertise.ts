import { apiClient } from "../apiClient";

import type {
	Advertisement,
	AssignCommonDto,
	AssignCommonStringListDto,
	BatchAssignDto,
	CreateAdvertisementDto,
	GetArticleAdvertisementElement,
	PaginationAdvertisementResponseDto,
	Reqadvertisementfindallquery,
	UpdateAdvertisementDto,
} from "#/api";

/**
 *创建广告
 */
export async function reqAdvertisementcreate(data: CreateAdvertisementDto): Promise<Advertisement> {
	return await apiClient.post("/api/advertisement", data);
}

/**
 *获取所有广告
 */
export async function reqAdvertisementfindall(
	query: Reqadvertisementfindallquery,
): Promise<PaginationAdvertisementResponseDto> {
	return await apiClient.get("/api/advertisement", {
		params: query,
	});
}

/**
 *获取广告详情
 */
export async function reqAdvertisementfindone(id: string): Promise<Advertisement> {
	return await apiClient.get(`/api/advertisement/${id}`);
}

/**
 *更新广告
 */
export async function reqAdvertisementupdate(id: string, data: UpdateAdvertisementDto): Promise<Advertisement> {
	return await apiClient.patch(`/api/advertisement/${id}`, data);
}

/**
 *删除广告
 */
export async function reqAdvertisementremove(id: string): Promise<Advertisement> {
	return await apiClient.delete(`/api/advertisement/${id}`);
}

/**
 *分配广告文章
 */
export async function reqAdvertisementassignadvertisementarticles(
	advertisementId: string,
	data: AssignCommonDto,
): Promise<BatchAssignDto> {
	return await apiClient.post(`/api/advertisement/assign/article/${advertisementId}`, data);
}

/**
 *根据文章的公开ID 获取所有相关联的广告
 */
export async function reqAdvertisementgetarticleadvertisementsbypublicarticleid(
	publicArticleId: string,
): Promise<GetArticleAdvertisementElement[]> {
	return await apiClient.get(`/api/advertisement/article/public/${publicArticleId}`);
}

/**
 *根据文章ID 获取所有相关联的广告
 */
export async function reqAdvertisementgetarticleadvertisements(
	articleId: string,
): Promise<GetArticleAdvertisementElement[]> {
	return await apiClient.get(`/api/advertisement/article/${articleId}`);
}

/**
 *根据广告ID 和公开文章ID列表 分配广告文章
 */
export async function reqAdvertisementassignadvertisementarticlesbypublicarticleids(
	advertisementId: string,
	data: AssignCommonStringListDto,
): Promise<BatchAssignDto> {
	return await apiClient.post(`/api/advertisement/assign/article/public/${advertisementId}`, data);
}
