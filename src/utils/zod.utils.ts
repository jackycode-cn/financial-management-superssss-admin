import { z } from "zod";

/**
 * 可选 URL 验证规则
 * - 空字符串或 undefined 视为合法
 * - 非空字符串必须是合法 URL
 */
export const optionalUrl = () =>
	z
		.string()
		.optional()
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
		);
