import { ResultStatus } from "#/enum";
import { GLOBAL_CONFIG } from "@/global-config";
import { t } from "@/locales/i18n";
import userStore from "@/store/userStore";
import type { CustomErrorResponse, CustomResponse, RefreshTokenEntity } from "@/types";
import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { toast } from "sonner";

// Token 刷新接口
const REFRESH_TOKEN_URL = "/api/auth/refresh";

// 普通请求实例
const axiosInstance = axios.create({
	baseURL: GLOBAL_CONFIG.apiBaseUrl,
	timeout: 50000,
	headers: { "Content-Type": "application/json;charset=utf-8" },
});

// 专门用于刷新 token 的实例，避免无限循环
const refreshInstance = axios.create({
	baseURL: GLOBAL_CONFIG.apiBaseUrl,
	timeout: 10000,
	headers: { "Content-Type": "application/json;charset=utf-8" },
});

// 请求拦截器：自动带上 token
axiosInstance.interceptors.request.use(
	(config) => {
		const tokenInfo = userStore.getState().userToken;
		if (tokenInfo.accessToken) {
			config.headers = config.headers || {};
			config.headers.Authorization = `Bearer ${tokenInfo.accessToken}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// =================== 刷新 Token 逻辑 ===================

// 标记是否正在刷新 token
let isRefreshing = false;
// 请求队列，等待 token 刷新后继续执行
let requestsQueue: ((token: string) => void)[] = [];

/**
 * 刷新 token 并重试原始请求
 */
const refreshTokenAndRetry = async (error: AxiosError<CustomErrorResponse>) => {
	const originalRequest: AxiosRequestConfig = { ...error.config };

	if (originalRequest) {
		originalRequest.headers = originalRequest?.headers || {};
	}
	const refreshToken = userStore.getState().userToken?.refreshToken;
	if (!refreshToken) {
		return Promise.reject(new Error(t("sys.api.errMsg401")));
	}
	// 如果正在刷新，挂起请求到队列
	if (isRefreshing) {
		return new Promise((resolve) => {
			requestsQueue.push((token) => {
				if (token && originalRequest) {
					originalRequest.headers = originalRequest.headers || {};
					originalRequest.headers.Authorization = `Bearer ${token}`;
					resolve(axiosInstance(originalRequest));
				} else {
					resolve(Promise.reject(error));
				}
			});
		});
	}

	isRefreshing = true;

	try {
		// 调用刷新 token 接口
		const response = await refreshInstance.post<CustomResponse<RefreshTokenEntity>>(
			REFRESH_TOKEN_URL,
			{},
			{
				headers: {
					Authorization: `Bearer ${refreshToken}`,
				},
			},
		);
		const newToken = response.data.data?.accessToken;
		const newRefreshToken = response.data.data?.refreshToken;
		if (!newToken || !newRefreshToken) {
			throw new Error(t("sys.api.errMsg401"));
		}
		userStore.getState().actions.setUserToken({
			accessToken: newToken,
			refreshToken: newRefreshToken,
		});

		// 执行队列中的请求
		// biome-ignore lint/complexity/noForEach: <explanation>
		requestsQueue.forEach((cb) => cb(newToken));
		requestsQueue = [];

		// 重试原始请求
		originalRequest.headers = originalRequest.headers || {};
		originalRequest.headers.Authorization = `Bearer ${newToken}`;
		return axiosInstance(originalRequest);
	} catch (refreshError) {
		// 刷新失败，清空队列并退出登录
		// biome-ignore lint/complexity/noForEach: <explanation>
		requestsQueue.forEach((cb) => cb(""));
		requestsQueue = [];

		userStore.getState().actions.clearUserInfoAndToken();
		toast.error(t("sys.api.errMsg401"), { position: "bottom-center" });
		return Promise.reject(refreshError);
	} finally {
		isRefreshing = false;
	}
};

// =================== 响应拦截器 ===================

axiosInstance.interceptors.response.use(
	(res: AxiosResponse<CustomResponse<any>>) => {
		if (!res.data) throw new Error(t("sys.api.apiRequestFailed"));
		const { code, data, message } = res.data;

		if (code === ResultStatus.SUCCESS || code === ResultStatus.SUCCESS_POST) {
			return data;
		}
		throw new Error(message || t("sys.api.apiRequestFailed"));
	},
	async (error: AxiosError<CustomErrorResponse>) => {
		console.error(error);
		const { response, message } = error || {};
		const errMsg = response?.data?.errorMessage || message || t("sys.api.errorMessage");

		// 如果是 401，尝试刷新 token
		if (response?.status === 401) {
			// 防止刷新接口本身 401 无限循环
			if (response.config?.url === REFRESH_TOKEN_URL) {
				userStore.getState().actions.clearUserInfoAndToken();
				toast.error(t("sys.api.errMsg401"), { position: "top-center" });
				return Promise.reject(error);
			}

			try {
				const result = await refreshTokenAndRetry(error);
				return result;
			} catch (e) {
				return Promise.reject(e);
			}
		}

		// 其他错误，统一提示
		toast.error(errMsg, { position: "top-center" });
		return Promise.reject(error);
	},
);

// =================== API 客户端封装 ===================

class APIClient {
	get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ url, ...config, method: "GET" });
	}
	post<T = unknown>(url: string, data: any = {}, config?: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ url, data, ...config, method: "POST" });
	}
	put<T = unknown>(url: string, data: any = {}, config?: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ url, data, ...config, method: "PUT" });
	}
	delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ url, ...config, method: "DELETE" });
	}
	patch<T = unknown>(url: string, data: any = {}, config?: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ url, data, ...config, method: "PATCH" });
	}
	request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return axiosInstance.request<any, T>(config);
	}
}

export const apiClient = new APIClient();
