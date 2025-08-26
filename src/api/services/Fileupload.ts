import { apiClient } from "../apiClient";

import type { UploadImageFileEntity } from "#/api";

/**
*单文件上传(当使用数字魔法验证的时候，不能设置dest缓存目录，必须使用内存)
https://github.com/nestjs/nest/issues/14970
*/
export async function reqFileuploadfile(file: File): Promise<UploadImageFileEntity> {
	return await apiClient.post("/api/file/upload/image", undefined, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
		data: {
			file,
		},
	});
}

/**
 *文件上传存放本地
 */
export async function reqFileuploadlocalfile(): Promise<any> {
	return await apiClient.post("/api/file/upload/local");
}

/**
 *上传不公开的文件
 */
export async function reqFileuploadprivatefile(): Promise<any> {
	return await apiClient.post("/api/file/upload/private");
}

export async function reqFileuploadmultiplefiles(): Promise<any> {
	return await apiClient.post("/api/file/upload/multiple");
}
