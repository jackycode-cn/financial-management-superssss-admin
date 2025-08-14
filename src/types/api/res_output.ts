// To parse this data:
//
//   import { Convert, ResOutput } from "./file";
//
//   const resOutput = Convert.toResOutput(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface MergedJson {
	"Auth-refreshToken-res": AuthRefreshTokenRes;
	"Register-register-res": RegisterRegisterRes;
	"Article-findOne-res": ArticleFindOneRes;
	"User-findAll-res": UserFindAllRes;
	"Article-create-res": ArticleCreateRes;
	"Article-findAll-res": ArticleFindAllRes;
	"Login-getLogin-res": LoginGetLoginRes;
	"Article-update-res": ArticleUpdateRes;
	"Article-remove-res": ArticleRemoveRes;
}

export interface ArticleCreateRes {
	create: Ate;
}

export interface Ate {
	message: string;
	article: Article;
}

export interface Article {
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
	id?: number;
	public_id: string;
	title: string;
	slug: string;
	description: string;
	content: string;
	category_id: number;
	toc: Toc[];
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
	published_at: null;
	updated_at: null;
	created_at?: Date;
	is_external: boolean;
	external_url: null;
	external_author: null;
	creator_id?: number;
}

export interface Toc {
	title: string;
	anchor: string;
}

export interface Pagination {
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
	hasNext: boolean;
}

export interface ArticleFindOneRes {
	findOne: FindOne;
}

export interface ArticleRemoveRes {
	remove: string;
}

export interface ArticleUpdateRes {
	update: Ate;
}

export interface AuthRefreshTokenRes {
	refreshToken: RefreshToken;
}

export interface RefreshToken {
	refreshToken: string;
	accessToken: string;
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
	username: string;
	avatar: string;
	roleId: number;
	account: string;
}

export interface RegisterRegisterRes {
	register: string;
}

export interface UserFindAllRes {
	findAll: UserFindAllResFindAll;
}

export interface UserFindAllResFindAll {
	items: Item[];
	pagination: Pagination;
}

export interface Item {
	id: number;
	userId: string;
	userName: string;
	roleId: null;
	state: null;
	headImgUrl: string;
	mobile: null;
	created: Date;
	edited: null;
	email: null;
	lastLogin: null;
	gender: string;
	birthday: null;
	address: null;
	isVerified: boolean;
	loginCount: number;
	updatedAt: null;
	companyName: null;
	role: null;
	account: string;
	disabled: boolean;
	deleted: boolean;
}
