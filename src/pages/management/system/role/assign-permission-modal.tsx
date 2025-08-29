import { reqRoleassignpermission, reqRolegetpermissions } from "@/api/services/RoleManagement";
import { type UserPermissionReturn, useUserPermissionData } from "@/hooks/admin/permission";
import type { PermissionOneEntity, RoleOneEntity } from "@/types";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Tree } from "antd";
import type { DataNode } from "antd/es/tree";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface AssignPermissionModalProps {
	role: RoleOneEntity | null;
	show: boolean;
	onOk: () => void;
	onCancel: () => void;
}

export default function AssignPermissionModal({ role, show, onOk, onCancel }: AssignPermissionModalProps) {
	const { treeData: permissionTreeData, loadData: loadPermissionData } = useUserPermissionData({ pageSize: 2000 });
	const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
	const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		loadPermissionData();
	}, []);

	const loadRolePermissions = useCallback(async (roleId: number) => {
		try {
			const permissions = await reqRolegetpermissions(roleId.toString());
			const permissionIds = permissions.map((p: PermissionOneEntity) => p.id);
			setCheckedKeys(permissionIds);
		} catch (error) {
			toast.error("獲取角色權限失敗");
		}
	}, []);

	useEffect(() => {
		if (role) {
			loadRolePermissions(role.id);
		}
	}, [role, loadRolePermissions]);

	const handleCheck = (checkedKeysValue: any) => {
		if (Array.isArray(checkedKeysValue)) {
			setCheckedKeys(checkedKeysValue);
		} else {
			setCheckedKeys(checkedKeysValue.checked);
		}
	};

	const handleExpand = (expandedKeysValue: any) => {
		setExpandedKeys(expandedKeysValue);
	};

	const handleSave = async () => {
		if (!role) return;

		try {
			await reqRoleassignpermission({
				roleId: role.id,
				permissionId: checkedKeys as number[],
			});
			toast.success("分配權限成功");
			onOk();
		} catch (error) {
			toast.error("分配權限失敗");
		}
	};

	const convertToTreeData = (permissions: UserPermissionReturn["treeData"]): DataNode[] => {
		return permissions.map((permission) => ({
			key: permission.id,
			title: permission.name || "",
			children: permission.children ? convertToTreeData(permission.children) : [],
		}));
	};

	return (
		<Dialog open={show} onOpenChange={(open) => !open && onCancel()}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>分配權限 - {role?.name}</DialogTitle>
				</DialogHeader>
				<div className="py-4">
					<Tree
						checkable
						checkedKeys={checkedKeys}
						expandedKeys={expandedKeys}
						onCheck={handleCheck}
						onExpand={handleExpand}
						treeData={convertToTreeData(permissionTreeData)}
						className="border rounded p-2"
					/>
				</div>
				<DialogFooter>
					<Button type="button" variant="outline" onClick={onCancel}>
						取消
					</Button>
					<Button type="button" variant="default" onClick={handleSave}>
						保存
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
