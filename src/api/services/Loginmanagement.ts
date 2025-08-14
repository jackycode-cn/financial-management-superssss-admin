import { apiClient } from "../apiClient";

import type { LoginBodyDto, LoginEntity } from "#/api";

/**
 *普通登錄
 */
export async function reqLogingetlogin(data: LoginBodyDto): Promise<LoginEntity> {
	return await apiClient.post("/api/auth/login", data);
}
