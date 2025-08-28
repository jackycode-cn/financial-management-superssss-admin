import { reqPermissioncreate, reqPermissionupdate } from "@/api/services";
import { Icon } from "@/components/icon";
import { useUserPermissionData } from "@/hooks/admin/permission";
import type { CreatePermissionDto, PermissionOneEntity } from "@/types/api/output";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { assertFieldsExist } from "@/utils/assertFieldsExist";
import Table, { type ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PermissionModal, { type PermissionModalProps } from "./permission-modal";

const defaultPermissionValue: PermissionModalProps["formValue"] = {
	name: "",
	code: "",
	id: 0,
	intro: "",
	deleted: false,
	isSystem: false,
	category: "menu",
	parentId: 0,
};
export default function PermissionPage() {
	const { treeData, loadData } = useUserPermissionData({ pageSize: 2000 });
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		loadData();
	}, []);

	const [permissionModalProps, setPermissionModalProps] = useState<PermissionModalProps>({
		formValue: { ...defaultPermissionValue },
		title: "新增權限",
		show: false,
		onOk: () => {
			setPermissionModalProps((prev) => ({ ...prev, show: false }));
		},
		onCancel: () => {
			setPermissionModalProps((prev) => ({ ...prev, show: false }));
		},
	});
	const columns: ColumnsType<PermissionOneEntity> = [
		{
			title: "權限名",
			dataIndex: "name",
			width: 300,
		},
		{
			title: "權限碼",
			dataIndex: "code",
		},
		{
			title: "介紹",
			dataIndex: "intro",
		},
		{
			title: "分類",
			dataIndex: "category",
			width: 60,
			render: (_, record) => <Badge variant="info">{record.category}</Badge>,
		},
		{
			title: "URL",

			dataIndex: "url",
		},
		{
			title: "權限狀態",
			dataIndex: "deleted",
			align: "center",
			width: 120,
			render: (deleted) => <Badge variant={deleted ? "error" : "success"}>{deleted ? "禁用" : "可用"}</Badge>,
		},
		{
			title: "Action",
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-end text-gray">
					<Button variant="ghost" size="icon" onClick={() => onCreate(record.id.toString())}>
						<Icon icon="gridicons:add-outline" size={18} />
					</Button>
					<Button variant="ghost" size="icon" onClick={() => onEdit(record)}>
						<Icon icon="solar:pen-bold-duotone" size={18} />
					</Button>
					<Button variant="ghost" size="icon">
						<Icon icon="mingcute:delete-2-fill" size={18} className="text-error!" />
					</Button>
				</div>
			),
		},
	];

	const onCreate = (parentId?: number | string) => {
		setPermissionModalProps((prev) => ({
			...prev,
			show: true,
			title: "新增權限",

			formValue: { ...defaultPermissionValue, parentId: Number(parentId) || undefined },

			onOk: async (value) => {
				assertFieldsExist(value, ["category", "code", "name", "intro"]);
				const createData: CreatePermissionDto = {
					category: value.category,
					code: value.code,
					name: value.name,
					intro: value.intro,
					parentId: value.parentId,
					url: value.url,
					isSystem: value.isSystem,
				};
				await reqPermissioncreate(createData);
				toast.success("新增權限成功");
				loadData();
			},
		}));
	};

	const onEdit = (record: PermissionOneEntity) => {
		const { editor, ...rest } = record;
		setPermissionModalProps((prev) => ({
			...prev,
			show: true,
			isNeedLoadData: false,
			threeData: treeData,
			title: "編輯權限",
			formValue: { ...rest },
			onOk: async (values) => {
				assertFieldsExist(values, ["category", "code", "name", "intro", "id"]);
				await reqPermissionupdate(String(values.id), {
					category: values.category,
					code: values.code,
					name: values.name,
					intro: values.intro,
					parentId: values.parentId,
					url: values.url,
					isSystem: values.isSystem,
					deleted: values.deleted,
				});
				toast.success("編輯權限成功");
				loadData();
				// 關閉彈窗
				setPermissionModalProps((prev) => ({ ...prev, show: false }));
			},
		}));
	};
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>權限列表</div>
					<Button onClick={() => onCreate()}>新增</Button>
				</div>
			</CardHeader>
			<CardContent>
				<Table
					rowKey="id"
					size="small"
					scroll={{ x: "max-content" }}
					pagination={false}
					columns={columns}
					dataSource={treeData}
				/>
			</CardContent>
			<PermissionModal {...permissionModalProps} threeData={treeData} />
		</Card>
	);
}
