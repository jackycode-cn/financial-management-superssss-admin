import { apiClient } from "../apiClient";

import type {
	CreatePermissionDto,
	PermissionListEntity,
	PermissionOneEntity,
	Reqpermissionfindallquery,
	UpdatePermissionDto,
} from "#/api";

/**
 *創建權限
 */
export async function reqPermissioncreate(data: CreatePermissionDto): Promise<string> {
	return await apiClient.post("/api/api/permission", data);
}

/**
 *獲取所有權限
 */
export async function reqPermissionfindall(query: Reqpermissionfindallquery): Promise<PermissionListEntity> {
	return await apiClient.get("/api/api/permission", {
		params: query,
	});
}

/**
 *根據id獲取權限
 */
export async function reqPermissionfindpermission(id: string): Promise<PermissionOneEntity> {
	return await apiClient.get(`/api/api/permission/get/${id}`);
}

/**
 *更新權限
 */
export async function reqPermissionupdate(id: string, data: UpdatePermissionDto): Promise<string> {
	return await apiClient.put(`/api/api/permission/${id}`, data);
}

/**
 *刪除權限
 */
export async function reqPermissionremove(id: string): Promise<string> {
	return await apiClient.delete(`/api/api/permission/${id}`);
}
