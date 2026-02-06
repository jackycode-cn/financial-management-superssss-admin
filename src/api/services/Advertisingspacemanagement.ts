import { apiClient } from "../apiClient";

import type {
	AdPosition,
	CreateAdPositionDto,
	PaginationAdPositionResponseDto,
	Reqadpositionsfindallquery,
	UpdateAdPositionDto,
} from "#/api";

/**
 *创建广告位
 */
export async function reqAdpositionscreate(data: CreateAdPositionDto): Promise<AdPosition> {
	return await apiClient.post("/api/ad-position", data);
}

/**
 *获取所有广告位
 */
export async function reqAdpositionsfindall(
	query: Reqadpositionsfindallquery,
): Promise<PaginationAdPositionResponseDto> {
	return await apiClient.get("/api/ad-position", {
		params: query,
	});
}

/**
 *获取广告位详情
 */
export async function reqAdpositionsfindone(id: string): Promise<AdPosition> {
	return await apiClient.get(`/api/ad-position/${id}`);
}

/**
 *更新广告位
 */
export async function reqAdpositionsupdate(id: string, data: UpdateAdPositionDto): Promise<AdPosition> {
	return await apiClient.patch(`/api/ad-position/${id}`, data);
}

/**
 *删除广告位
 */
export async function reqAdpositionsremove(id: string): Promise<AdPosition> {
	return await apiClient.delete(`/api/ad-position/${id}`);
}
