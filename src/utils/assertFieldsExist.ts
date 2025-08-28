/**
 * 类型辅助：将指定字段设为 required & non-null
 */
export type RequiredFields<T, K extends keyof T> = T & {
	[P in K]-?: NonNullable<T[P]>;
};

/**
 * 校验目标对象中指定字段存在并且不为 null/undefined
 * 并返回类型已提升的对象
 */
export function assertFieldsExist<T extends object, K extends keyof T>(
	obj: T,
	keys: K[],
): asserts obj is RequiredFields<T, K> {
	for (const key of keys) {
		if (!Object.prototype.hasOwnProperty.call(obj, key)) {
			throw new Error(`字段 ${String(key)} 是必填项`);
		}

		const value = obj[key];
		if (value === null || value === undefined) {
			throw new Error(`字段 ${String(key)} 不能为空`);
		}
	}
}
