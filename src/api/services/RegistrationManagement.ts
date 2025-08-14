import { apiClient } from "../apiClient";

import type { RegisterUserDto } from "#/api";

/**
 *用戶註冊
 */
export async function reqRegisterregister(data: RegisterUserDto): Promise<string> {
	return await apiClient.post("/api/auth/register", data);
}
