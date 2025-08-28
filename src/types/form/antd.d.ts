import type { Rule } from "antd/es/form";

/**
 * 创建一个联合类型的 Partial 类型
 * @example
 * type MyPartial = CreatePartialUnion<CreateDto, UpdateDto>;
 */
export type CreatePartialUnion<T extends object, U extends object> = Partial<T | U>;

/**
 * 创建多个类型的 Partial 联合类型
 * @example
 * type MyPartial = CreatePartialUnionFromArray<[CreateDto, UpdateDto, PatchDto]>;
 */
export type CreatePartialUnionFromArray<T extends any[]> = Partial<
	T extends [infer First, ...infer Rest] ? First & CreatePartialUnionFromArray<Rest> : unknown
>;

/** 表单规则 */
export type FormRule<T> = Partial<Record<keyof T, Rule | Rule[]>>;
