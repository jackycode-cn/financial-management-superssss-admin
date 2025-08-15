import { useLoginStateContext } from "@/pages/sys/login/providers/login-provider";
import { useUserActions } from "@/store/userStore";
import { replace } from "ramda";

export function useLogout() {
	const { clearUserInfoAndToken } = useUserActions();
	const { backToLogin } = useLoginStateContext();
	const logout = () => {
		try {
			clearUserInfoAndToken();
			backToLogin();
		} catch (error) {
			console.log(error);
		} finally {
			replace("/auth/login");
		}
	};
	return {
		logout,
	};
}
