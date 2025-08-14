import { apiClient } from "../apiClient";

import type {
	AssignPermissionDto,
	CreateRoleDto,
	Reqrolefindallquery,
	RoleListEntity,
	RoleOneEntity,
	UpdateRoleDto,
} from "#/api";

/**
 *創建角色
 */
export async function reqRolecreate(data: CreateRoleDto): Promise<string> {
	return await apiClient.post("/api/api/role", data);
}

/**
 *獲取所有角色
 */
export async function reqRolefindall(query: Reqrolefindallquery): Promise<RoleListEntity> {
	return await apiClient.get("/api/api/role", {
		params: query,
	});
}

/**
 *根據id獲取角色
 */
export async function reqRolefindone(id: string): Promise<RoleOneEntity> {
	return await apiClient.get(`/api/api/role/${id}`);
}

/**
 *更新角色
 */
export async function reqRoleupdate(id: string, data: UpdateRoleDto): Promise<string> {
	return await apiClient.put(`/api/api/role/${id}`, data);
}

/**
 *刪除角色
 */
export async function reqRoleremove(id: string): Promise<string> {
	return await apiClient.delete(`/api/api/role/${id}`);
}

/**
 *獲取角色的權限
 */
export async function reqRolegetpermissions(id: string): Promise<RoleOneEntity[]> {
	return await apiClient.get(`/api/api/role/get-permissions/${id}`);
}

/**
 *分配角色的權限
 */
export async function reqRoleassignpermission(data: AssignPermissionDto): Promise<string> {
	return await apiClient.post("/api/api/role/assign-permissions", data);
}
