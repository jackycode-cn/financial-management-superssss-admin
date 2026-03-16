import type { HttpStatusCode } from "./custom.https";
/**
 * 通用的 API 响应结构
 */
interface CustomResponse<T = unknown> {
	/** 请求是否成功 */
	success: boolean;
	/** HTTP 状态码 */
	code: HttpStatusCode;
	/** 操作结果描述 */
	message?: string;
	/** 返回的数据内容 */
	data?: T;
	/** 响应生成的时间戳 */
	timestamp?: string;
	/** 唯一的请求 ID */
	requestId?: string;
	/** 详细的错误信息（可选） */
	detail?: string | null;
}

/**
 * 错误的 API 响应结构
 */
interface CustomErrorResponse {
	/** 请求是否成功 */
	success: boolean;
	/** HTTP 状态码 */
	code: HttpStatusCode | number | string;
	/** 错误消息（可选） */
	errorMessage: string | null;
	errors?: string[];
	/** 响应生成的时间戳 */
	timestamp?: string;
	/** 唯一的请求 ID */
	requestId?: string;
}

/**
 * 发送成功响应的选项
 * @template T 数据类型
 */
type SendResponseOptions<T = unknown> = {
	/** 操作结果描述（可选） */
	message?: string;
	/** 返回的数据（可选） */
	data?: T;
	/** HTTP 状态码（可选） */
	code?: HttpStatusCode;
};

/**
 * 发送错误响应的选项
 */
type SendErrorOptions = {
	/** HTTP 状态码（可选） */
	code?: HttpStatusCode;
	/** 详细错误信息（可选） */
	detail?: string;
	/** 错误消息（可选） */
	errorMessage?: string;
};
interface MyPagination {
	/**
	 * 当前页码（从1开始）
	 * 示例: 1
	 */
	page: number;
	/**
	 * 每页条数
	 * 示例: 10
	 */
	pageSize: number;
	/**
	 * 总条数
	 * 示例: 100
	 */
	total: number;
	/**
	 * 总页数
	 * 示例: 10
	 */
	totalPages: number;
	/**
	 * 是否有下一页
	 * 示例: true
	 */
	hasNext?: boolean;
}

export interface MyPaginationResponse<T> {
	pagination: MyPagination;

	items: T[];
}
