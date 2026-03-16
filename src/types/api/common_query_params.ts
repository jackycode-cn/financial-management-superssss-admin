import type { TimeRangeDto } from "./output.d.ts";
export interface Reqadpositionsfindallquery {
	/** 广告位类型 */
	type?: string;
	/** 状态 */
	status?: boolean;
	/** 排序字段 */
	sortBy?: string;
	/** 排序方向 */
	sortOrder?: string;
	/** 關鍵字查找 */
	keyword?: string;
	page: number;
	pageSize: number;
}
export interface Reqadvertisementfindallquery {
	/** 查询关键字 */
	keyword?: string;
	/** 广告状态 */
	status?: "DRAFT" | "ENABLED" | "DISABLED" | "EXPIRED";
	/** 广告位ID */
	adPositionId?: string;
	page: number;
	pageSize: number;
}
export interface Reqadvertisementfindonequery {
	/** 是否需要包含广告位信息 */
	includeAdPosition?: number;
}
export interface Reqadvertisementgetarticleadvertisementsbypublicarticleidquery {
	/** 是否需要包含广告位信息 */
	includeAdPosition?: number;
}
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
	/** 文章分類ID */
	category_id?: number;
}
export interface Reqarticlegetarticlereadingquery {
	/** 页码（默认：1） */
	page?: number;
	/** 每页条数（默认：10） */
	pageSize?: number;
}
export interface Reqarticlegetarticlesbyslugquery {
	/** 是否需要廣告信息 */
	needAd: number;
}
export interface Reqeavfindallattributedefsquery {
	/** 所屬實體類型ID */
	entityTypeId?: string;
	/** 屬性名稱 */
	attrName?: string;
	/** 屬性代碼 */
	attrCode?: string;
	/** 屬性類型 */
	attrType?: string;
	/** 分組名稱 */
	groupName?: string;
	/** 狀態：0禁用 1啟用 */
	status?: number;
	page: number;
	pageSize: number;
}
export interface Reqeavfindallentitytypesquery {
	/** 實體類型名稱 */
	typeName?: string;
	/** 實體類型代碼 */
	typeCode?: string;
	/** 狀態：0禁用 1啟用 */
	status?: number;
	/** 頁碼 */
	page?: number;
	/** 頁面大小 */
	pageSize?: number;
}
export interface Reqeavfindbyentityquery {
	/** 實體ID */
	entityId: string;
	/** 實體類型ID */
	entityTypeId?: string;
}
export interface Reqemailgetarticleemailsquery {
	/** 文章郵箱地址 */
	email?: string;
	/** 關聯的設備ID */
	deviceId?: string;
	/** 分頁查詢參數 */
	page?: number;
	/** 分頁查詢參數：每頁數量 */
	limit?: number;
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
