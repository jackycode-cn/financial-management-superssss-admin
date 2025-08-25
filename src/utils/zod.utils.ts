import { z } from "zod";

/**
 * 可选 URL 验证规则
 * - 空字符串或 undefined 视为合法
 * - 非空字符串必须是合法 URL
 */
export const optionalUrl = (isRequired = false) =>
	z
		.string()
		.refine(
			(val) => {
				if (!val || val.trim() === "") return true;
				try {
					new URL(val);
					return true;
				} catch {
					return false;
				}
			},
			{ message: "请输入有效的URL" },
		)
		.refine(
			(val) => {
				if (isRequired) {
					return val !== "";
				}
				return true;
			},
			{ message: "URL是必填项" },
		);
