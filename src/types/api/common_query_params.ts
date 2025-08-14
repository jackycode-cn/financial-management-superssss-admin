import type { TimeRangeDto } from "./output.d.ts";
export interface Reqarticlefindallquery {
	page: number;
	pageSize: number;
	/** 文章是否已归档 */
	is_archive?: boolean;
	/** 文章是否為外部鏈接 是外部文章 */
	is_external?: boolean;
	/** 文章是否為首頁特推 */
	is_featured?: boolean;
	/** 文章是否為首頁熱門 */
	is_hot?: boolean;
	/** 文章是否已發布 */
	is_published?: boolean;
	/** 文章是否為首頁頂部 */
	is_top?: boolean;
	/** 文章標題 */
	title?: string;
	slug?: string;
}
export interface Reqemailsendcodequery {
	to: string;
}
export interface Reqpermissionfindallquery {
	/** 页码（默认：1） */
	page?: number;
	/** 每页条数（默认：10） */
	pageSize?: number;
}
export interface Reqrolefindallquery {
	/** 页码（默认：1） */
	page?: number;
	/** 每页条数（默认：10） */
	pageSize?: number;
}
export interface Reqtaskgettasklistquery {
	/** 页码（默认：1） */
	page?: number;
	/** 每页条数（默认：10） */
	pageSize?: number;
}
export interface Requserfindallquery {
	/** 可選的 deleted 字段，用於篩選已刪除或未刪除的用戶。該字段的值必須是 0 或 1，其中 0 表示未刪除，1 表示已刪除。 */
	deleted?: boolean;
	/** 可選的 name 字段，用於篩選用戶名稱。 */
	name?: string;
	/** 可選的 email 字段，用於篩選用戶的電子郵件地址。 */
	email?: string;
	/** 可選的 account 字段，用於篩選用戶的帳號。 */
	account?: string;
	/** 可选 mobile 字段，用户筛选用户手机号码 */
	mobile?: string;
	createTimeRange?: TimeRangeDto;
	/** 是否禁止使用 */
	disabled?: boolean;
	/** 页码（默认：1） */
	page?: number;
	/** 每页条数（默认：10） */
	pageSize?: number;
}
export interface Requserfinduseronequery {
	userId?: string;
	deleted?: boolean;
}
export interface Requserremovequery {
	isSoft: boolean;
}
export interface Requserswitchrolequery {
	roleId: string;
}
