export interface MergedJson {
	"Role-assignPermission-res": RoleAssignPermissionRes;
	"Auth-refreshToken-res": AuthRefreshTokenRes;
	"File-uploadFile-res": FileUploadFileRes;
	"Article-assignAdvertisementToArticleByPublicId-res": ArticleAssignAdvertisementToArticleByPublicIdRes;
	"ArticleCategory-remove-res": ArticleCategoryRemoveRes;
	"Advertisement-assignAdvertisementArticlesByPublicArticleIds-res": AdvertisementAssignAdvertisementArticlesByPublicArticleIdsRes;
	"Article-getLatestArticles-res": ArticleGetLatestArticlesRes;
	"Role-create-res": CreateRes;
	"ArticleCategory-update-res": ArticleCategoryUpdateRes;
	"Advertisement-getArticleAdvertisements-res": AdvertisementGetArticleAdvertisementsRes;
	"Article-getArticlesBySlug-res": ArticleGetArticlesBySlugRes;
	"Article-findOne-res": ArticleFindOneRes;
	"Article-assignAdvertisementToArticle-res": ArticleAssignAdvertisementToArticleRes;
	"User-findAll-res": UserFindAllRes;
	"AdPositions-findAll-res": AdPositionsFindAllRes;
	"Advertisement-assignAdvertisementArticles-res": AdvertisementAssignAdvertisementArticlesRes;
	"Article-create-res": ArticleCreateRes;
	"Role-getPermissions-res": RoleGetPermissionsRes;
	"AdPositions-remove-res": AdPositionsRemoveRes;
	"Article-increaseReading-res": ArticleIncreaseReadingRes;
	"App-healthCheck-res": AppHealthCheckRes;
	"Article-getArticleReading-res": ArticleGetArticleReadingRes;
	"User-remove-res": RemoveRes;
	"User-updatePassword-res": UserUpdatePasswordRes;
	"Permission-update-res": UpdateRes;
	"Role-findAll-res": FindAllRes;
	"Advertisement-create-res": AdvertisementCreateRes;
	"User-getPermissions-res": UserGetPermissionsRes;
	"Article-findAll-res": ArticleFindAllRes;
	"Login-getLogin-res": LoginGetLoginRes;
	"Role-update-res": UpdateRes;
	"Advertisement-update-res": AdvertisementUpdateRes;
	"ArticleCategory-findAll-res": ArticleCategoryFindAllRes;
	"AdPositions-update-res": AdPositionsUpdateRes;
	"Advertisement-remove-res": AdvertisementRemoveRes;
	"User-createUser-res": UserCreateUserRes;
	"User-update-res": UserUpdateRes;
	"User-getOwnProfile-res": UserGetOwnProfileRes;
	"Article-update-res": ArticleUpdateRes;
	"Auth-setFingerprint-res": AuthSetFingerprintRes;
	"AdPositions-findOne-res": AdPositionsFindOneRes;
	"Advertisement-findAll-res": AdvertisementFindAllRes;
	"ArticleCategory-create-res": ArticleCategoryCreateRes;
	"Permission-create-res": CreateRes;
	"Advertisement-findOne-res": AdvertisementFindOneRes;
	"Permission-findAll-res": FindAllRes;
	"Article-remove-res": RemoveRes;
	"AdPositions-create-res": AdPositionsCreateRes;
	"Advertisement-getArticleAdvertisementsByPublicArticleId-res": AdvertisementGetArticleAdvertisementsByPublicArticleIdRes;
	"User-updateSelf-res": UserUpdateSelfRes;
	"ArticleCategory-getArticleCountByCategoryId-res": ArticleCategoryGetArticleCountByCategoryIdRes;
}

export interface AdPositionsCreateRes {
	create: AdPositionsCreateResCreate;
}

export interface AdPositionsCreateResCreate {
	id: string;
	name: string;
	code: string;
	description: string;
	width: number;
	height: number;
	type: string;
	status: boolean;
	maxAds: number;
	createdAt: string;
	updatedAt: string;
}

export interface AdPositionsFindAllRes {
	findAll: AdPositionsFindAllResFindAll;
}

export interface AdPositionsFindAllResFindAll {
	pagination: Pagination;
	items: AdPositionsCreateResCreate[];
}

export interface Pagination {
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
	hasNext: boolean;
}

export interface AdPositionsFindOneRes {
	findOne: AdPositionsCreateResCreate;
}

export interface AdPositionsRemoveRes {
	remove: AdPositionsCreateResCreate;
}

export interface AdPositionsUpdateRes {
	update: AdPositionsCreateResCreate;
}

export interface AdvertisementAssignAdvertisementArticlesRes {
	assignAdvertisementArticles: AssignAdvertisement;
}

export interface AssignAdvertisement {
	delete: number;
	create: number;
}

export interface AdvertisementAssignAdvertisementArticlesByPublicArticleIdsRes {
	assignAdvertisementArticlesByPublicArticleIds: AssignAdvertisement;
}

export interface AdvertisementCreateRes {
	create: GetArticleAdvertisementElement;
}

export interface GetArticleAdvertisementElement {
	id: string;
	title: Title;
	coverImage: string;
	shortDesc: string;
	redirectUrl: string;
	adPositionId: AdPositionId;
	priority: number;
	status: Status;
	startTime: string;
	endTime: string;
	clickCount: number;
	viewCount: number;
	clickRate: number;
	maxClicks: null;
	maxViews: null;
	createdAt: string;
	updatedAt: string;
	creator: null;
	editor: null;
}

export enum AdPositionId {
	Cml4Z3U930000Um06Gbkryqou = "cml4z3u930000um06gbkryqou",
}

export enum Status {
	Enabled = "ENABLED",
}

export enum Title {
	卡數一筆清好簡1易Credit366 = "卡數一筆清好簡1易 | credit366",
	广告标题 = "广告标题",
}

export interface AdvertisementFindAllRes {
	findAll: AdvertisementFindAllResFindAll;
}

export interface AdvertisementFindAllResFindAll {
	pagination: Pagination;
	items: GetArticleAdvertisementElement[];
}

export interface AdvertisementFindOneRes {
	findOne: GetArticleAdvertisementElement;
}

export interface AdvertisementGetArticleAdvertisementsRes {
	getArticleAdvertisements: GetArticleAdvertisementElement[];
}

export interface AdvertisementGetArticleAdvertisementsByPublicArticleIdRes {
	getArticleAdvertisementsByPublicArticleId: GetArticleAdvertisementElement[];
}

export interface AdvertisementRemoveRes {
	remove: GetArticleAdvertisementElement;
}

export interface AdvertisementUpdateRes {
	update: GetArticleAdvertisementElement;
}

export interface AppHealthCheckRes {
	healthCheck: string;
}

export interface ArticleAssignAdvertisementToArticleRes {
	assignAdvertisementToArticle: AssignAdvertisement;
}

export interface ArticleAssignAdvertisementToArticleByPublicIdRes {
	assignAdvertisementToArticleByPublicId: AssignAdvertisement;
}

export interface ArticleCreateRes {
	create: Ate;
}

export interface Ate {
	message: string;
	article: GetLatestArticles;
}

export interface GetLatestArticles {
	public_id: string;
	title: string;
	slug: string;
	id?: number;
}

export interface ArticleFindAllRes {
	findAll: ArticleFindAllResFindAll;
}

export interface ArticleFindAllResFindAll {
	items: FindOne[];
	pagination: Pagination;
}

export interface FindOne {
	public_id: string;
	title: string;
	slug: string;
	description: string;
	category_id: number;
	toc: null;
	reading: number;
	comment_count: number;
	is_archive: boolean;
	is_featured: boolean;
	is_hot: boolean;
	is_top: boolean;
	is_published: boolean;
	seo_title: string;
	seo_description: string;
	seo_keywords: string;
	published_at: string;
	updated_at: null | string;
	is_external: boolean;
	external_url: string;
	external_author: ExternalAuthor;
	thumbnail: string;
	created_at: string;
	article_categories: ArticleCategories;
	creator: Creator;
	content?: string;
	editor?: null;
	articles_tags?: any[];
}

export interface ArticleCategories {
	id: number;
	name: string;
	slug: string;
}

export interface Creator {
	userId: string;
	userName: Username;
	headImgUrl: string;
}

export enum Username {
	Superadmin = "superadmin",
}

export enum ExternalAuthor {
	Empty = "",
	張家豪Gorden = "張家豪Gorden",
	陳敏莉 = "陳敏莉",
}

export interface ArticleFindOneRes {
	findOne: FindOne;
}

export interface ArticleGetArticleReadingRes {
	getArticleReading: GetArticleReading;
}

export interface GetArticleReading {
	items: GetArticleReadingItem[];
	pagination: Pagination;
}

export interface GetArticleReadingItem {
	reading: number;
	public_id: string;
	title: string;
	slug: string;
	published_at: string;
}

export interface ArticleGetArticlesBySlugRes {
	getArticlesBySlug: FindOne;
}

export interface ArticleGetLatestArticlesRes {
	getLatestArticles: GetLatestArticles;
}

export interface ArticleIncreaseReadingRes {
	increaseReading: string;
}

export interface RemoveRes {
	remove: string;
}

export interface ArticleUpdateRes {
	update: Ate;
}

export interface ArticleCategoryCreateRes {
	create: ArticleCategoryCreateResCreate;
}

export interface ArticleCategoryCreateResCreate {
	id: number;
	name: string;
	parent_id: number | null;
	level: number;
	slug: string;
	created_at: string;
	updated_at: string;
}

export interface ArticleCategoryFindAllRes {
	findAll: ArticleCategoryFindAllResFindAll;
}

export interface ArticleCategoryFindAllResFindAll {
	items: ArticleCategoryCreateResCreate[];
	pagination: Pagination;
}

export interface ArticleCategoryGetArticleCountByCategoryIdRes {
	getArticleCountByCategoryId: GetArticleCountByCategoryId;
}

export interface GetArticleCountByCategoryId {
	items: GetArticleCountByCategoryIdItem[];
	pagination: Pagination;
}

export interface GetArticleCountByCategoryIdItem {
	count: number;
	name: string;
	slug: string;
	category_id: number;
}

export interface ArticleCategoryRemoveRes {
	remove: ArticleCategoryCreateResCreate;
}

export interface ArticleCategoryUpdateRes {
	update: ArticleCategoryCreateResCreate;
}

export interface AuthRefreshTokenRes {
	refreshToken: RefreshToken;
}

export interface RefreshToken {
	refreshToken: string;
	accessToken: string;
}

export interface AuthSetFingerprintRes {
	setFingerprint: string;
}

export interface FileUploadFileRes {
	uploadFile: UploadFile;
}

export interface UploadFile {
	accessUrl: string;
	tempAccessUrl: string;
}

export interface LoginGetLoginRes {
	getLogin: GetLogin;
}

export interface GetLogin {
	userInfo: UserInfo;
	accessToken: string;
	refreshToken: string;
}

export interface UserInfo {
	userId: string;
	username: Username;
	avatar: string;
	roleId: number;
	account: string;
}

export interface CreateRes {
	create: string;
}

export interface FindAllRes {
	findAll: PermissionFindAllResFindAll;
}

export interface PermissionFindAllResFindAll {
	items: GetPermission[];
	pagination: Pagination;
}

export interface GetPermission {
	id: number;
	parentId: number | null;
	code: string;
	name: string;
	intro: string;
	category?: Category;
	url?: null | string;
	created: string;
	creator: number | null;
	editor: number | null;
	deleted: boolean;
	edited: string;
	isSystem: boolean;
}

export enum Category {
	Api = "api",
	Menu = "menu",
}

export interface UpdateRes {
	update: string;
}

export interface RoleAssignPermissionRes {
	assignPermission: string;
}

export interface RoleGetPermissionsRes {
	getPermissions: GetPermission[];
}

export interface UserCreateUserRes {
	createUser: CreateUser;
}

export interface CreateUser {
	id: number;
	userId: string;
	userName: string;
	roleId: number;
	state: boolean | null;
	headImgUrl: string;
	mobile: string;
	created: string;
	edited: null | string;
	email: string;
	lastLogin: null;
	gender: string;
	birthday: null | string;
	address: string;
	isVerified: boolean;
	loginCount: number;
	updatedAt: null;
	companyName: null | string;
	role: Role;
	account: string;
	disabled: boolean;
	deleted: boolean;
}

export interface Role {
	id: number;
	name: string;
	code: string;
	intro: string;
}

export interface UserFindAllRes {
	findAll: UserFindAllResFindAll;
}

export interface UserFindAllResFindAll {
	items: CreateUser[];
	pagination: Pagination;
}

export interface UserGetOwnProfileRes {
	getOwnProfile: CreateUser;
}

export interface UserGetPermissionsRes {
	getPermissions: GetPermissions;
}

export interface GetPermissions {
	menuPermissions: string[];
	buttonPermissions: any[];
}

export interface UserUpdateRes {
	update: CreateUser;
}

export interface UserUpdatePasswordRes {
	updatePassword: string;
}

export interface UserUpdateSelfRes {
	updateSelf: CreateUser;
}
