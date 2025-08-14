import { apiClient } from "../apiClient";

import type {
	AssignUserRoleDto,
	CreateUserEntity,
	CreateUserWithAccountDto,
	FindOneUserEntity,
	Requserfindallquery,
	Requserfinduseronequery,
	Requserremovequery,
	Requserswitchrolequery,
	RoleOneEntity,
	RolePermissionCodes,
	SwitchUserRoleEntity,
	UpdatePasswordDto,
	UpdateUserDto,
	UserEntity,
	UsersEntity,
} from "#/api";

/**
 *创建用户
 */
export async function reqUsercreateuser(data: CreateUserWithAccountDto): Promise<CreateUserEntity> {
	return await apiClient.post("/api/user", data);
}

/**
 *获取多个用户
 */
export async function reqUserfindall(query: Requserfindallquery): Promise<UsersEntity> {
	return await apiClient.get("/api/user", {
		params: query,
	});
}

/**
 *获取单个用户
 */
export async function reqUserfinduserone(query: Requserfinduseronequery, id: string): Promise<FindOneUserEntity> {
	return await apiClient.get(`/api/user/get/${id}`, {
		params: query,
	});
}

/**
 *更新用戶信息
 */
export async function reqUserupdate(id: string, data: UpdateUserDto): Promise<UserEntity> {
	return await apiClient.put(`/api/user/update/${id}`, data);
}

/**
 *重置用户密码
 */
export async function reqUserresetpassword(id: string): Promise<string> {
	return await apiClient.get(`/api/user/reset-password/${id}`);
}

/**
 *普通用户修改自己的密码
 */
export async function reqUserupdatepassword(data: UpdatePasswordDto): Promise<string> {
	return await apiClient.put("/api/user/update-password", data);
}

/**
 *删除用户
 */
export async function reqUserremove(query: Requserremovequery, id: string): Promise<string> {
	return await apiClient.delete(`/api/user/${id}`, {
		params: query,
	});
}

/**
 *分配用户的角色
 */
export async function reqUserassignrole(data: AssignUserRoleDto): Promise<string> {
	return await apiClient.post("/api/user/assign-roles", data);
}

/**
 *用户切换所属角色
 */
export async function reqUserswitchrole(query: Requserswitchrolequery): Promise<SwitchUserRoleEntity> {
	return await apiClient.get("/api/user/switch-role", {
		params: query,
	});
}

/**
 *获取个人资料
 */
export async function reqUsergetownprofile(): Promise<UserEntity> {
	return await apiClient.get("/api/user/self/profile");
}

/**
 *获取用户的角色
 */
export async function reqUsergetroles(id: string): Promise<RoleOneEntity[]> {
	return await apiClient.get(`/api/user/get-roles/${id}`);
}

/**
 *获取用户的所有权限码
 */
export async function reqUsergetpermissions(): Promise<RolePermissionCodes> {
	return await apiClient.get("/api/user/get-permissions");
}
