import { reqRolecreate, reqRoleremove, reqRoleupdate } from "@/api/services/RoleManagement";
import { Icon } from "@/components/icon";

import { useLoadRoleData } from "@/hooks/admin/role";
import type { RoleOneEntity } from "@/types/api/output";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
import Table, { type ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// import { ROLE_LIST } from "@/_mock/assets";
import AssignPermissionModal from "./assign-permission-modal";
import type { RoleModalProps } from "./role-modal";
import RoleModal from "./role-modal";

const DEFAULT_ROLE_VALUE: RoleOneEntity = {
	id: 0,
	name: "",
	code: "",
	parentId: null,
	intro: "",
	created: "",
	edited: "",
	deleted: false,
};

export default function RolePage() {
	const { treeData, loadData } = useLoadRoleData({ pageSize: 1000 });

	const [roleModalProps, setRoleModalProps] = useState<RoleModalProps>({
		formValue: { ...DEFAULT_ROLE_VALUE },

		title: "新增",
		show: false,
		onOk: () => {
			setRoleModalProps((prev) => ({ ...prev, show: false }));
		},
		onCancel: () => {
			setRoleModalProps((prev) => ({ ...prev, show: false }));
		},
		roles: [],
	});

	const [assignPermissionModalProps, setAssignPermissionModalProps] = useState({
		role: null as RoleOneEntity | null,
		show: false,
		onOk: () => {
			setAssignPermissionModalProps((prev) => ({ ...prev, show: false }));
		},
		onCancel: () => {
			setAssignPermissionModalProps((prev) => ({ ...prev, show: false }));
		},
	});
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		loadData();
	}, []);

	const onCreate = () => {
		setRoleModalProps((prev) => ({
			...prev,
			show: true,
			title: "新增角色",
			formValue: {
				...prev.formValue,
				...DEFAULT_ROLE_VALUE,
			},
			roles: treeData,
		}));
	};

	const onEdit = (formValue: RoleOneEntity) => {
		setRoleModalProps((prev) => ({
			...prev,
			show: true,
			title: "編輯角色",
			formValue,
			roles: treeData,
		}));
	};

	const onDelete = async (id: number) => {
		try {
			await reqRoleremove(id.toString());
			toast.success("刪除角色成功");
			loadData();
		} catch (error) {
			toast.error("刪除角色失敗");
		}
	};
	const onAssignPermission = (record: RoleOneEntity) => {
		setAssignPermissionModalProps((prev) => ({
			...prev,
			show: true,
			role: record,
		}));
	};

	const handleSave = async (values: any) => {
		try {
			if (values.id === 0) {
				await reqRolecreate({
					name: values.name,
					code: values.code,
					intro: values.intro,
					parentId: values.parentId,
				});
				toast.success("創建角色成功");
			} else {
				await reqRoleupdate(values.id.toString(), {
					name: values.name,
					code: values.code,
					intro: values.intro,
					parentId: values.parentId,
					deleted: values.deleted,
				});
				toast.success("更新角色成功");
			}
			setRoleModalProps((prev) => ({ ...prev, show: false }));
			loadData();
		} catch (error) {
			toast.error("保存角色失敗");
		}
	};

	const columns: ColumnsType<RoleOneEntity> = [
		{
			title: "角色名稱",
			dataIndex: "name",
			width: 300,
		},
		{
			title: "角色代碼",
			dataIndex: "code",
		},
		{
			title: "角色描述",
			dataIndex: "intro",
		},
		{
			title: "狀態",
			dataIndex: "deleted",
			align: "center",
			width: 120,
			render: (deleted) => <Badge variant={deleted ? "error" : "success"}>{deleted ? "停用" : "啟用"}</Badge>,
		},
		{
			title: "操作",
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-center text-gray">
					<Button variant="ghost" size="icon" onClick={() => onEdit(record)}>
						<Icon icon="solar:pen-bold-duotone" size={18} />
					</Button>
					<Button variant="ghost" size="icon" onClick={() => onDelete(record.id)}>
						<Icon icon="mingcute:delete-2-fill" size={18} className="text-error!" />
					</Button>
					{/* 分配角色權限 */}
					<Button variant="ghost" size="icon" onClick={() => onAssignPermission(record)}>
						<Icon icon="mingcute:user-3-fill" size={18} />
					</Button>
				</div>
			),
		},
	];

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>角色管理</div>
					<Button onClick={onCreate}>新增</Button>
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
			<RoleModal {...roleModalProps} onOk={handleSave} />
			<AssignPermissionModal {...assignPermissionModalProps} />
		</Card>
	);
}
