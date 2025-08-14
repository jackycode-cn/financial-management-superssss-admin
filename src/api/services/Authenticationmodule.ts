import { apiClient } from "../apiClient";

import type { FingerPrintDto, RefreshTokenEntity } from "#/api";

/**
 *刷新token
 */
export async function reqAuthrefreshtoken(): Promise<RefreshTokenEntity> {
	return await apiClient.post("/api/auth/refresh");
}

/**
 *服務器保存刷新token
 */
export async function reqAuthrefreshtokenpro(): Promise<RefreshTokenEntity> {
	return await apiClient.post("/api/auth/refresh-token");
}

/**
 *设置fingerprint
 */
export async function reqAuthsetfingerprint(data: FingerPrintDto): Promise<string> {
	return await apiClient.post("/api/auth/set-fingerprint", data);
}
