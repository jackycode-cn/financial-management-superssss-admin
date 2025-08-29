export interface CreateTaskJobDto {
	/**
	 * 任务名称，唯一标识
	 */
	name: string;
	/**
	 * 任务类型，例如 sendWhatsappGroupMessage
	 * 示例: "sendWhatsappGroupMessage"
	 */
	type: string;
	/**
	 * 调用方式：bullmq | direct | schedule
	 */
	handlerType?: "bullmq" | "direct" | "schedule";
	/**
	 * 任务执行的处理器函数名或者队列，例如 chat
	 * 示例: "chat"
	 */
	handler?: "chat" | "cron" | "email" | "audio";
	/**
	 * 调度类型：cron | once | manual
	 */
	scheduleType?: "cron" | "once" | "manual";
	/**
	 * Cron 表达式，仅 cron 模式需要
	 * 示例: "0 9 * * *"
	 */
	cronTime?: string;
	/**
	 * 任务时区
	 */
	timezone?: string;
	/**
	 * 任务参数（JSON），结构应根据不同任务类型定义,可以为一个空对象
	 * 示例: {"templateId": "tpl_001", "receiverGroupId": "grp_001", "customVars": {"userName": "张三"}}
	 */
	params: Record<string, any>;
	/**
	 * 最大重试次数
	 */
	retryCount?: number;
	/**
	 * 超时时间（秒）
	 */
	timeout?: number;
	/**
	 * 是否启用任务
	 */
	enabled?: boolean;
	/**
	 * 任务描述
	 */
	description?: string;
	/**
	 * 创建人（审计）
	 */
	createdBy?: string;
	/**
	 * 下一次执行时间
	 */
	nextRunAt?: string;
}

export interface UpdateTaskJobDto {
	/**
	 * 任务名称，唯一标识
	 */
	name?: string;
	/**
	 * 任务类型，例如 sendWhatsappGroupMessage
	 * 示例: "sendWhatsappGroupMessage"
	 */
	type?: string;
	/**
	 * 调用方式：bullmq | direct | schedule
	 */
	handlerType?: "bullmq" | "direct" | "schedule";
	/**
	 * 任务执行的处理器函数名或者队列，例如 chat
	 * 示例: "chat"
	 */
	handler?: "chat" | "cron" | "email" | "audio";
	/**
	 * 调度类型：cron | once | manual
	 */
	scheduleType?: "cron" | "once" | "manual";
	/**
	 * Cron 表达式，仅 cron 模式需要
	 * 示例: "0 9 * * *"
	 */
	cronTime?: string;
	/**
	 * 任务时区
	 */
	timezone?: string;
	/**
	 * 任务参数（JSON），结构应根据不同任务类型定义,可以为一个空对象
	 * 示例: {"templateId": "tpl_001", "receiverGroupId": "grp_001", "customVars": {"userName": "张三"}}
	 */
	params?: Record<string, any>;
	/**
	 * 最大重试次数
	 */
	retryCount?: number;
	/**
	 * 超时时间（秒）
	 */
	timeout?: number;
	/**
	 * 是否启用任务
	 */
	enabled?: boolean;
	/**
	 * 任务描述
	 */
	description?: string;
	/**
	 * 创建人（审计）
	 */
	createdBy?: string;
	/**
	 * 下一次执行时间
	 */
	nextRunAt?: string;
}

export interface QueueActionDto {
	/**
	 * 队列名称，必须是预定义的队列名之一
	 * 示例: "chat"
	 */
	queueName: "chat" | "cron" | "email" | "audio";
}

export interface SwaggerErrorResponseDto {
	success: boolean;
	/**
	 * 示例: 500
	 */
	code: number;
	/**
	 * 示例: "Internal server error"
	 */
	errorMessage: string;
	/**
	 * 示例: "2025/4/9 02:43:19"
	 */
	timestamp: string;
	/**
	 * 示例: {"username": ["用户名不能为空", "用户名长度不能超过20"]}
	 */
	errors?: { [key: string]: Array };
}

export interface SwaggerBaseResponse {
	/**
	 * 请求是否成功的标志
	 * 示例: true
	 */
	success: boolean;
	/**
	 * 请求的响应状态码
	 * 示例: 200
	 */
	code: number;
	/**
	 * 请求的响应消息
	 * 示例: "请求成功"
	 */
	message?: string;
	/**
	 * 请求返回的具体数据，数据类型根据实际请求而定
	 */
	data?: any;
	/**
	 * 请求响应的时间戳
	 * 示例: "2025/4/9 02:43:19"
	 */
	timestamp?: string;
	/**
	 * 请求的唯一标识
	 * 示例: "d0838cc9-fdb4-4a2d-a3fb-329f0d3d2545"
	 */
	requestId?: string;
}

export interface UserDto {
	/**
	 * 示例: "1212121"
	 */
	account: string;
	/**
	 * 示例: "1212121"
	 */
	password: string;
}

export interface ExampleDto {
	/**
	 * 示例
	 * 示例: "示例"
	 */
	example: string;
	/**
	 * 名称
	 * 示例: "张三"
	 */
	name?: string;
	/**
	 * 年龄
	 * 示例: 18
	 */
	age?: number;

	array?: number[];
}

export interface RefreshTokenEntity {
	refreshToken: string;

	accessToken: string;
}

export interface FingerPrintDto {
	/**
	 * fingerprint
	 * 示例: "asas"
	 */
	fingerprint: string;
}

export interface UserInfoEntity {
	userId: string;

	username: string;

	avatar?: string;

	roleId?: number;

	account: string;
}

export interface LoginEntity {
	userInfo: UserInfoEntity;

	accessToken: string;

	refreshToken: string;
}

export interface LoginBodyDto {
	/**
	 * 登入賬號（郵箱或國際手機號）
	 * 示例: "user@example.com 或 +85212345678"
	 */
	account: string;
	/**
	 * 密碼
	 * 示例: "password123"
	 */
	password: string;
}

export interface RegisterUserDto {
	/**
	 * 登录账号（邮箱或国际手机号）
	 * 示例: "user@example.com 或 +85212345678"
	 */
	account: string;
	/**
	 * 密码
	 * 示例: "password123"
	 */
	password: string;
	/**
	 * 确认密码
	 * 示例: "password123"
	 */
	confirmPassword: string;
	/**
	 * 性别
	 * 示例: "male"
	 */
	gender?: "male" | "female" | "Unknown";
}

export interface UserRoleInfoEntity {
	name: string;

	intro: string;

	code: string;
	/**
	 * 角色id
	 */
	id: number;
}

export interface CreateUserEntity {
	/**
	 * 用户id
	 */
	id: number;

	userId: string;

	userName: string;
	/**
	 * 角色默认id
	 */
	roleId: number;

	state?: boolean;

	headImgUrl?: string;

	mobile?: string;

	created?: string | null;

	edited?: string | null;

	email?: string;

	lastLogin?: string | null;

	gender?: string;

	birthday?: string | null;

	address?: string;

	isVerified?: boolean;

	loginCount?: number;

	updatedAt?: string | null;

	companyName?: string;

	role?: UserRoleInfoEntity;

	account: string;
	/**
	 * disable
	 */
	disabled?: boolean;
	/**
	 * 是否删除
	 */
	deleted?: boolean;
}

export interface CreateUserDto {
	/**
	 * 用户 UUID
	 * 示例: "d290f1ee-6c54-4b01-90e6-d701748f0851"
	 */
	userId: string;
	/**
	 * 用户名
	 */
	userName: string;
	/**
	 * 密码
	 */
	password: string;
	/**
	 * 角色 ID
	 */
	roleId?: number;
	/**
	 * 启用状态
	 */
	state?: boolean;
	/**
	 * 头像 URL
	 */
	headImgUrl?: string;
	/**
	 * 手机号
	 */
	mobile?: string;
	/**
	 * 邮箱地址
	 */
	email?: string;
	/**
	 * 上次登录时间
	 */
	lastLogin?: string;
	/**
	 * 性别
	 */
	gender?: "Unknown" | "male" | "female";
	/**
	 * 生日
	 */
	birthday?: string;
	/**
	 * 地址
	 */
	address?: string;
	/**
	 * 是否已认证
	 */
	isVerified?: boolean;
	/**
	 * 登录次数
	 */
	loginCount?: number;
	/**
	 * 更新时间
	 */
	updatedAt?: string;
	/**
	 * 公司 UUID
	 */
	companyId?: string;
	/**
	 * 公司名称
	 */
	companyName?: string;
	/**
	 * 是否删除
	 */
	deleted?: boolean;
	/**
	 * 是否禁用
	 */
	disabled?: boolean;
}

export interface CreateUserWithAccountDto {
	/**
	 * 用户名
	 */
	userName: string;
	/**
	 * 密码
	 */
	password: string;
	/**
	 * 角色 ID
	 */
	roleId?: number;
	/**
	 * 启用状态
	 */
	state?: boolean;
	/**
	 * 头像 URL
	 */
	headImgUrl?: string;
	/**
	 * 手机号
	 */
	mobile?: string;
	/**
	 * 邮箱地址
	 */
	email?: string;
	/**
	 * 上次登录时间
	 */
	lastLogin?: string;
	/**
	 * 性别
	 */
	gender?: "Unknown" | "male" | "female";
	/**
	 * 生日
	 */
	birthday?: string;
	/**
	 * 地址
	 */
	address?: string;
	/**
	 * 是否已认证
	 */
	isVerified?: boolean;
	/**
	 * 登录次数
	 */
	loginCount?: number;
	/**
	 * 更新时间
	 */
	updatedAt?: string;
	/**
	 * 公司 UUID
	 */
	companyId?: string;
	/**
	 * 公司名称
	 */
	companyName?: string;
	/**
	 * 是否删除
	 */
	deleted?: boolean;
	/**
	 * 是否禁用
	 */
	disabled?: boolean;
	/**
	 * 账号
	 */
	account: string;
}

export interface UserEntity {
	/**
	 * 用户id
	 */
	id: number;

	userId: string;

	userName: string;
	/**
	 * 角色默认id
	 */
	roleId: number;

	state?: boolean;

	headImgUrl?: string;

	mobile?: string;

	created?: string | null;

	edited?: string | null;

	email?: string;

	lastLogin?: string | null;

	gender?: string;

	birthday?: string | null;

	address?: string;

	isVerified?: boolean;

	loginCount?: number;

	updatedAt?: string | null;

	companyName?: string;

	role?: UserRoleInfoEntity;

	account: string;
	/**
	 * disable
	 */
	disabled?: boolean;
	/**
	 * 是否删除
	 */
	deleted?: boolean;
}

export interface PaginationResponseEntity {
	/**
	 * 页码
	 */
	page: number;

	pageSize: number;

	total: number;

	totalPages: number;
	/**
	 * 是否有下一页
	 */
	hasNext: boolean;
}

export interface UsersEntity {
	items: UserEntity[];

	pagination: PaginationResponseEntity;
}

export interface TimeRangeDto {
	/**
	 * 开始时间 (ISO格式，例如：2023-01-01T00:00:00Z)
	 */
	startTime?: string;
	/**
	 * 结束时间 (ISO格式，例如：2023-12-31T23:59:59Z)
	 */
	endTime?: string;
}

export interface PermissionOneEntity {
	/**
	 * 权限分类（api | button | menu）
	 * 示例: "api"
	 */
	category?: "api" | "button" | "menu";
	/**
	 * 權限id
	 */
	id: number;

	parentId?: number | null;

	code?: string;

	name?: string;

	intro?: string;

	url?: string | null;

	created?: string | null;

	creator?: number | null;

	editor?: number | null;

	deleted?: boolean;

	edited?: string | null;

	isSystem?: boolean;
}

export interface FindOneUserEntity {
	/**
	 * 用户id
	 */
	id: number;

	userId: string;

	userName: string;
	/**
	 * 角色默认id
	 */
	roleId: number;

	state?: boolean;

	headImgUrl?: string;

	mobile?: string;

	created?: string | null;

	edited?: string | null;

	email?: string;

	lastLogin?: string | null;

	gender?: string;

	birthday?: string | null;

	address?: string;

	isVerified?: boolean;

	loginCount?: number;

	updatedAt?: string | null;

	companyName?: string;

	role?: UserRoleInfoEntity;

	account: string;
	/**
	 * disable
	 */
	disabled?: boolean;
	/**
	 * 是否删除
	 */
	deleted?: boolean;

	permissions: PermissionOneEntity[];

	roles: UserRoleInfoEntity[];
}

export interface UpdateUserDto {
	/**
	 * 用户名
	 */
	userName?: string;
	/**
	 * 密码
	 */
	password?: string;
	/**
	 * 角色 ID
	 */
	roleId?: number;
	/**
	 * 启用状态
	 */
	state?: boolean;
	/**
	 * 头像 URL
	 */
	headImgUrl?: string;
	/**
	 * 手机号
	 */
	mobile?: string;
	/**
	 * 邮箱地址
	 */
	email?: string;
	/**
	 * 上次登录时间
	 */
	lastLogin?: string;
	/**
	 * 性别
	 */
	gender?: "Unknown" | "male" | "female";
	/**
	 * 生日
	 */
	birthday?: string;
	/**
	 * 地址
	 */
	address?: string;
	/**
	 * 是否已认证
	 */
	isVerified?: boolean;
	/**
	 * 登录次数
	 */
	loginCount?: number;
	/**
	 * 更新时间
	 */
	updatedAt?: string;
	/**
	 * 公司 UUID
	 */
	companyId?: string;
	/**
	 * 公司名称
	 */
	companyName?: string;
	/**
	 * 是否删除
	 */
	deleted?: boolean;
	/**
	 * 是否禁用
	 */
	disabled?: boolean;
}

export interface UpdatePasswordDto {
	/**
	 * 登录账号（邮箱或国际手机号）
	 * 示例: "user@example.com 或 +85212345678"
	 */
	account: string;
	/**
	 * 密码
	 * 示例: "password123"
	 */
	password: string;
	/**
	 * 确认密码
	 * 示例: "password123"
	 */
	confirmPassword: string;
	/**
	 * 旧密码
	 * 示例: "oldPassword123"
	 */
	oldPassword: string;
}

export interface AssignUserRoleDto {
	/**
	 * 用户的唯一标识符，用于指定要分配角色的用户
	 * 示例: "1"
	 */
	user_id: number;
	/**
	 * 角色ID 數組
	 */
	roleIds: number[];
}

export interface SwitchUserRoleEntity {
	user: UserEntity;

	message: string;

	accessToken: string;

	refreshToken: string;
}

export interface RoleOneEntity {
	/**
	 * 角色id
	 */
	id: number;

	name: string;

	parentId?: number | null;

	code: string;

	intro: string;

	created: string;

	creator?: number | null;

	edited: string;

	editor?: number | null;

	deleted: boolean;
	isSystem?: boolean;
}

export interface RolePermissionCodes {
	/**
	 * 示例: ["menu:user", "menu:permission"]
	 */
	menuPermissions: string[];
	/**
	 * 示例: ["button:user:add", "button:permission:add"]
	 */
	buttonPermissions: string[];
}

export interface CreateRoleDto {
	/**
	 * 父级 ID
	 * 示例: 1
	 */
	parentId?: number | null;
	/**
	 *  角色代碼
	 */
	code?: string;
	/**
	 *  角色名稱
	 */
	name?: string;
	/**
	 *  角色介紹
	 */
	intro?: string;
}

export interface RoleListEntity {
	items: RoleOneEntity[];

	pagination: PaginationResponseEntity;
}

export interface UpdateRoleDto {
	/**
	 * 父级 ID
	 * 示例: 1
	 */
	parentId?: number | null;
	/**
	 *  角色代碼
	 */
	code?: string;
	/**
	 *  角色名稱
	 */
	name?: string;
	/**
	 *  角色介紹
	 */
	intro?: string;
	/**
	 *  是否刪除，可為空，預設 false
	 */
	deleted?: boolean;
}

export interface AssignPermissionDto {
	/**
	 * 角色 ID
	 */
	roleId: number;
	/**
	 * 權限 ID 數組
	 */
	permissionId: number[];
}

export interface CreatePermissionDto {
	/**
	 * 父级 ID
	 * 示例: 1
	 */
	parentId?: number | null;
	/**
	 * 权限分类（api | button | menu）
	 * 示例: "api"
	 */
	category: "api" | "button" | "menu";
	/**
   * 權限代碼
@example:user:create
   */
	code: string;
	/**
   * 權限名稱
@example:創建用戶
   */
	name: string;
	/**
   * 介紹
@example:創建用戶
   */
	intro: string;
	/**
   * 请求访问路径
@example:/user/get
   */
	url?: string | null;
	/**
	 * 是否是系统权限
	 */
	isSystem?: boolean;
}

export interface PermissionListEntity {
	items: PermissionOneEntity[];

	pagination: PaginationResponseEntity;
}

export interface UpdatePermissionDto {
	/**
	 * 父级 ID
	 * 示例: 1
	 */
	parentId?: number | null;
	/**
	 * 权限分类（api | button | menu）
	 * 示例: "api"
	 */
	category?: "api" | "button" | "menu";

	editor?: number;

	deleted?: boolean;
	/**
	 * 是否是系统权限
	 */
	isSystem?: boolean;
	/**
   * 權限代碼
@example:user:create
   */
	code?: string;
	/**
   * 權限名稱
@example:創建用戶
   */
	name?: string;
	/**
   * 介紹
@example:創建用戶
   */
	intro?: string;
	/**
   * 请求访问路径
@example:/user/get
   */
	url?: string | null;
}

export interface UploadImageFileEntity {
	/**
	 * 访问路径
	 */
	accessUrl: string;
	/**
	 * 临时访问路径 当不存在时 这个临时的访问链接也会是永久的
	 */
	tempAccessUrl: string;
}

export interface PushMessageDto {
	/**
   * 消息类型（可用于前端分类处理）
比如：text | system | chat | notice | update
   */
	type: "text" | "system" | "chat" | "notice" | "update";
	/**
	 * 具体的消息内容（支持任意格式，如 string、object）
	 */
	data: Record<string, any>;
	/**
	 * 推送的时间（毫秒时间戳）
	 */
	timestamp?: number;
	/**
	 * 发送方标识（系统、后台、用户等）
	 */
	sender?: string;
}

export interface PartialArticleEmtity {
	/**
	 * 文章ID 公開的id
	 */
	public_id?: string;
	/**
	 * 文章標題
	 */
	title: string;

	slug: string;
}

export interface CreateArticleEntity {
	message: string;

	article: PartialArticleEmtity;
}

export interface TocInfoDto {
	title: string;

	anchor: string;

	level?: number;
}
export interface CreateTagDto {
	/**
	 * 標籤名稱
	 */
	name: string;
	/**
	 * 標籤 Slug
	 */
	slug?: string | null;
}
export interface CreateArticleDto {
	/**
	 * 文章ID 公開的id
	 */
	public_id?: string;
	/**
	 * 文章標題
	 */
	title: string;

	slug: string;

	description?: string;

	content?: string;
	/**
	 * 文章分類ID
	 */
	category_id?: number;
	/**
	 * 文章目錄
	 */
	toc?: TocInfoDto[];
	/**
	 * 文章閱讀量
	 */
	reading?: number;
	/**
	 * 文章評論量
	 */
	comment_count?: number;
	/**
	 * 文章是否已归档
	 */
	is_archive?: boolean;
	/**
	 * 文章是否為首頁特推
	 */
	is_featured?: boolean;
	/**
	 * 文章是否為首頁熱門
	 */
	is_hot?: boolean;
	/**
	 * 文章是否為首頁頂部
	 */
	is_top?: boolean;
	/**
	 * 文章是否已發布
	 */
	is_published?: boolean;
	/**
	 * 文章SEO標題
	 */
	seo_title?: string;
	/**
	 * 文章SEO描述
	 */
	seo_description?: string;
	/**
	 * 文章SEO關鍵字
	 */
	seo_keywords?: string;
	/**
	 * 文章發布時間
	 */
	published_at?: string;
	/**
	 * 文章更新時間
	 */
	updated_at?: string;
	/**
	 * 文章是否為外部鏈接 是外部文章
	 */
	is_external?: boolean;
	/**
	 * 外部文章鏈接
	 */
	external_url?: string;
	/**
	 * 外部文章作者
	 */
	external_author?: string;
	/** 文章缩略图 */
	thumbnail?: string;
	/**
	 * 標籤
	 */
	tags?: CreateTagDto[];
}
export interface TagDto {
	/**
	 * 標籤名稱
	 */
	name: string;
	/**
	 * 標籤 Slug
	 */
	slug?: string | null;
	/**
	 * 標籤 ID
	 */
	id: number;
}
export interface ArticleEntity {
	/**
	 * 文章ID 公開的id
	 */
	public_id?: string;
	/**
	 * 文章標題
	 */
	title: string;

	slug: string;

	description?: string;

	content?: string;
	/**
	 * 文章分類ID
	 */
	category_id?: number;
	/**
	 * 文章目錄
	 */
	toc?: TocInfoDto[];
	/**
	 * 文章閱讀量
	 */
	reading?: number;
	/**
	 * 文章評論量
	 */
	comment_count?: number;
	/**
	 * 文章是否已归档
	 */
	is_archive?: boolean;
	/**
	 * 文章是否為首頁特推
	 */
	is_featured?: boolean;
	/**
	 * 文章是否為首頁熱門
	 */
	is_hot?: boolean;
	/**
	 * 文章是否為首頁頂部
	 */
	is_top?: boolean;
	/**
	 * 文章是否已發布
	 */
	is_published?: boolean;
	/**
	 * 文章SEO標題
	 */
	seo_title?: string;
	/**
	 * 文章SEO描述
	 */
	seo_description?: string;
	/**
	 * 文章SEO關鍵字
	 */
	seo_keywords?: string;
	/**
	 * 文章發布時間
	 */
	published_at?: string;
	/**
	 * 文章更新時間
	 */
	updated_at?: string;
	/**
	 * 文章是否為外部鏈接 是外部文章
	 */
	is_external?: boolean;
	/**
	 * 外部文章鏈接
	 */
	external_url?: string;
	/**
	 * 外部文章作者
	 */
	external_author?: string;
	/** 文章缩略图 */
	thumbnail?: string;

	id: string;
	/** 文章的创建时间 */
	created_at?: string;
	/** 文章关联的分类信息 */
	article_categories?: Pick<CategoryResponseDto, "id" | "name" | "slug">;
	/**
	 * 文章的标签
	 */
	articles_tags?: TagDto[];
}

export interface ArticlesEntities {
	items: ArticleEntity[];

	pagination: PaginationResponseEntity;
}

export interface UpdateArticleDto {
	/**
	 * 文章ID 公開的id
	 */
	public_id?: string;
	/**
	 * 文章標題
	 */
	title?: string;

	slug?: string;

	description?: string;

	content?: string;
	/**
	 * 文章分類ID
	 */
	category_id?: number;
	/**
	 * 文章目錄
	 */
	toc?: TocInfoDto[];
	/**
	 * 文章閱讀量
	 */
	reading?: number;
	/**
	 * 文章評論量
	 */
	comment_count?: number;
	/**
	 * 文章是否已归档
	 */
	is_archive?: boolean;
	/**
	 * 文章是否為首頁特推
	 */
	is_featured?: boolean;
	/**
	 * 文章是否為首頁熱門
	 */
	is_hot?: boolean;
	/**
	 * 文章是否為首頁頂部
	 */
	is_top?: boolean;
	/**
	 * 文章是否已發布
	 */
	is_published?: boolean;
	/**
	 * 文章SEO標題
	 */
	seo_title?: string;
	/**
	 * 文章SEO描述
	 */
	seo_description?: string;
	/**
	 * 文章SEO關鍵字
	 */
	seo_keywords?: string;
	/**
	 * 文章發布時間
	 */
	published_at?: string;
	/**
	 * 文章更新時間
	 */
	updated_at?: string;
	/**
	 * 文章是否為外部鏈接 是外部文章
	 */
	is_external?: boolean;
	/**
	 * 外部文章鏈接
	 */
	external_url?: string;
	/**
	 * 外部文章作者
	 */
	external_author?: string;
	/** 文章缩略图 */
	thumbnail?: string;
	/**
	 * 標籤
	 */
	tags?: CreateTagDto[];
}

export interface CategoryResponseDto {
	/**
	 * 分类ID
	 */
	id: number;

	name: string;
	/**
	 * 父分类ID
	 */
	parent_id?: number | null;

	level: number;
	/**
	 * 分类路径
	 */
	slug?: string | null;
	/**
	 * 创建时间
	 */
	created_at: string;
	/**
	 * 更新时间
	 */
	updated_at: string;
}

export interface CreateArticleCategoryDto {
	/**
	 * Category name
	 */
	name: string;
	/**
	 * Parent category ID
	 */
	parent_id?: number;
	/**
	 * Category level
	 */
	level?: number;
	/**
	 * URL-friendly category name
	 */
	slug?: string;
}

export interface CategoryResponseWithPaginationDto {
	items: CategoryResponseDto[];

	pagination: PaginationResponseEntity;
}

export interface UpdateArticleCategoryDto {
	/**
	 * Category name
	 */
	name?: string;
	/**
	 * Parent category ID
	 */
	parent_id?: number;
	/**
	 * Category level
	 */
	level?: number;
	/**
	 * URL-friendly category name
	 */
	slug?: string;
}
