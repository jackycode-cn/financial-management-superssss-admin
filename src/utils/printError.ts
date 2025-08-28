import { toast } from "sonner";

/** 打印或者弹窗提醒错误信息 */
export function printError(err: any, defaultMsg = "操作失敗") {
	if (err instanceof Error) {
		toast.error(err.message);
		console.error(err);
	} else {
		toast.error(defaultMsg);
		console.error(err);
	}
}

export function printErrorAndThrow(err: any, defaultMsg = "操作失敗") {
	printError(err, defaultMsg);
	throw err;
}
