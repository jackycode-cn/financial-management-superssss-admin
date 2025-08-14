import { apiClient } from "../apiClient";

import type { PushMessageDto } from "#/api";

/**
 *浏览器通过这个接口接收消息
 */
export async function reqSsestream(): Promise<object> {
	return await apiClient.get("/api/sse/stream");
}

/**
 *向所有客户推送一条消息
 */
export async function reqSsesendmessage(data: PushMessageDto): Promise<any> {
	return await apiClient.post("/api/sse/send", data);
}
