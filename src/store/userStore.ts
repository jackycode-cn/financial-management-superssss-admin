import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import type { SignInReq } from "@/api/services/userService";

import type { UserInfo, UserToken } from "#/entity";
import { StorageEnum } from "#/enum";
import { reqLogingetlogin, reqUsergetownprofile } from "@/api/services";
import type { UserInfoEntity } from "@/types";
import { toast } from "sonner";

type UserStore = {
	userInfo: Partial<UserInfo & UserInfoEntity>;
	userToken: UserToken;
	permissions: string[];
	buttonPermissions: string[];
	menuPermissions: string[];
	initialized: boolean;
	actions: {
		setUserInfo: (userInfo: UserInfo) => void;
		setUserToken: (token: UserToken) => void;
		clearUserInfoAndToken: () => void;
		setPermissions: (permissions: string[]) => void;
		setButtonPermissions: (buttonPermissions: string[]) => void;
		setMenuPermissions: (menuPermissions: string[]) => void;
		setInitialized: (initialized: boolean) => void;
	};
};

const useUserStore = create<UserStore>()(
	devtools(
		persist(
			(set) => ({
				userInfo: {},
				userToken: {},

				permissions: [],
				buttonPermissions: [],
				menuPermissions: [],
				initialized: false,
				actions: {
					setUserInfo: (userInfo) => {
						set({ userInfo });
					},
					setUserToken: (userToken) => {
						set({ userToken });
					},
					clearUserInfoAndToken() {
						set({ userInfo: {}, userToken: {} });
					},
					setPermissions: (permissions) => {
						set({ permissions });
					},
					setButtonPermissions: (buttonPermissions) => {
						set({ buttonPermissions });
					},
					setMenuPermissions: (menuPermissions) => {
						set({ menuPermissions });
					},
					setInitialized: (initialized) => {
						set({ initialized });
					},
				},
			}),
			{
				name: "userStore", // name of the item in the storage (must be unique)
				storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
				partialize: (state) => ({
					[StorageEnum.UserInfo]: state.userInfo,
					[StorageEnum.UserToken]: state.userToken,
				}),
			},
		),
	),
);

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const usePermissions = () => useUserStore((state) => state.permissions);
export const getUserPermissions = () => useUserStore.getState().permissions;
export const useUserPermissions = () => useUserStore((state) => state.userInfo.permissions || []);
export const useUserRoles = () => useUserStore((state) => state.userInfo.roles || []);
export const useUserActions = () => useUserStore((state) => state.actions);

export const useSignIn = () => {
	const { setUserToken, setUserInfo } = useUserActions();
	const signIn = async (data: SignInReq) => {
		try {
			const res = await reqLogingetlogin({
				account: data.username,
				password: data.password,
			});

			const { userInfo, accessToken, refreshToken } = res;
			setUserToken({ accessToken, refreshToken });
			setUserInfo({
				...userInfo,
				id: userInfo.userId,
				email: userInfo.account,
			});
		} catch (err) {
			toast.error(err.message, {
				position: "top-center",
			});
			throw err;
		}
	};

	return signIn;
};

/** 请求用户信息 */
export function useRequestUserInfo() {
	const { setUserInfo } = useUserActions();
	const requestUserInfo = async () => {
		try {
			const { userName, email, headImgUrl, userId, account, mobile, address, role } = await reqUsergetownprofile();
			setUserInfo({
				username: userName,
				email,
				avatar: headImgUrl,
				id: userId,
				account,
				address,
				mobile,
				role,
			});
		} catch (err) {
			toast.error(err.message, {
				position: "top-center",
			});
			// logout();
			throw err;
		}
	};
	return requestUserInfo;
}

export default useUserStore;
