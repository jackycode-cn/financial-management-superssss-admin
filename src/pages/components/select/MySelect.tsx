import type { TreeSelectProps } from "antd";
import { TreeSelect } from "antd";
import { useCallback, useEffect, useState } from "react";

export interface PermissionSelectProps<T = any> {
	defaultValue?: number | string;
	loadData?: () => Promise<T[]>;
	treeData?: T[];
	fieldNames?: TreeSelectProps["fieldNames"];
	onChange?: (value: number | string) => void;
	placeholder?: string;
	showSearch?: boolean;
	treeSelectProps?: Omit<TreeSelectProps, "value" | "onChange" | "treeData" | "fieldNames">;
}

export function MyTreeSelect<T extends { children?: T[] }>({
	defaultValue,
	loadData,
	treeData: staticTreeData = [],
	fieldNames = { label: "name", value: "id", children: "children" },
	onChange,
	placeholder = "请选择",
	showSearch = false,
	treeSelectProps,
}: PermissionSelectProps<T>) {
	const [treeData, setTreeData] = useState<T[]>([]);
	const [value, setValue] = useState<number | string | undefined>(defaultValue);

	// 保证每个节点都有 children
	const normalizeTree = useCallback((data: T[]): T[] => {
		return data.map((item) => ({
			...item,
			children: item.children ? normalizeTree(item.children) : [],
		}));
	}, []);

	// 静态树数据
	useEffect(() => {
		setTreeData(normalizeTree(staticTreeData));
	}, [staticTreeData, normalizeTree]);

	// 异步加载树数据
	useEffect(() => {
		if (loadData) {
			loadData()
				.then((res) => setTreeData(normalizeTree(res)))
				.catch(console.error);
		}
	}, [loadData, normalizeTree]);

	// 默认值同步
	useEffect(() => {
		setValue(defaultValue);
	}, [defaultValue]);

	const handleChange = (val: number | string) => {
		setValue(val);
		onChange?.(val);
	};

	return (
		<TreeSelect
			{...treeSelectProps}
			value={value}
			treeData={treeData}
			fieldNames={fieldNames}
			placeholder={placeholder}
			allowClear
			onChange={handleChange}
			showSearch={showSearch}
			getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
		/>
	);
}
