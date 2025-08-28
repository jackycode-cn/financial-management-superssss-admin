import { chain } from "lodash";

export type TreeLike<T, ChildrenKey extends string> = T & { [K in ChildrenKey]: TreeLike<T, ChildrenKey>[] };

/**
 * 将扁平数组转换为树形结构
 * @param data 扁平数据数组
 * @param parentId 当前层级的父节点ID，默认为null（表示根节点）
 * @param idKey 节点ID的属性名，默认为'id'
 * @param parentIdKey 父节点ID的属性名，默认为'parent_id'
 * @param childrenKey 子节点数组的属性名，默认为'children'
 * @returns 树形结构数组
 */
export function convertListToTree<T, ChildrenKey extends string = "children">(
	data: T[],
	// biome-ignore lint/style/useDefaultParameterLast: <explanation>
	parentId: T[keyof T] | null = null,
	idKey: keyof T,
	parentIdKey: keyof T,
	childrenKey: ChildrenKey = "children" as ChildrenKey,
): TreeLike<T, ChildrenKey>[] {
	return chain(data)
		.filter((item) => item[parentIdKey] === parentId)
		.map((item) => ({
			...item,
			[childrenKey]: convertListToTree(data, item[idKey], idKey, parentIdKey, childrenKey),
		}))
		.value() as TreeLike<T, ChildrenKey>[];
}

// 使用示例：
// interface AdminPermission extends TreeNode<AdminPermission> {
//   // 其他属性
// }
// interface PageAdminPermisson extends AdminPermission {
//   // 其他属性
// }
// const treeData = convertListToTree<PageAdminPermisson>(flatData);
