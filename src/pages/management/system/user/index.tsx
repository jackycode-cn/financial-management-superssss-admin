import type { CreateUserWithAccountDto, RoleListEntity, UpdateUserDto } from "#/api";
import { reqRolefindall } from "@/api/services/RoleManagement";
import { reqUsercreateuser, reqUserremove, reqUserupdate } from "@/api/services/UserManagement";
import { Icon } from "@/components/icon";
import { type FilterParamsType, useUserList } from "@/hooks/admin/user";
import { usePathname, useRouter } from "@/routes/hooks";
import type { UserEntity, UserRoleInfoEntity } from "@/types";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { Popconfirm, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import UserFilterForm, { type UserFilterParams } from "./user-filter";
import UserModal from "./user-modal";

export default function UserPage() {
	const { push } = useRouter();
	const pathname = usePathname();
	const { users, pagination, loading, changePagination, loadUsers } = useUserList(10);

	const [modalVisible, setModalVisible] = useState(false);
	const [editingUser, setEditingUser] = useState<UserEntity | null>(null);
	const [roles, setRoles] = useState<UserRoleInfoEntity[]>([]);
	useEffect(() => {
		const fetchRoles = async () => {
			try {
				const roleResponse: RoleListEntity = await reqRolefindall({ page: 1, pageSize: 100 });
				setRoles(roleResponse.items);
			} catch (error) {
				console.error("獲取角色列表失敗:", error);
				message.error("獲取角色列表失敗");
			}
		};

		fetchRoles();
	}, []);

	const handleCreateUser = () => {
		setEditingUser(null);
		setModalVisible(true);
	};

	const handleEditUser = (user: UserEntity) => {
		setEditingUser(user);
		setModalVisible(true);
	};

	const handleModalOk = async (values: CreateUserWithAccountDto | UpdateUserDto) => {
		try {
			if (editingUser) {
				await reqUserupdate(editingUser.id.toString(), values as UpdateUserDto);
				toast.success("用戶更新成功");
			} else {
				await reqUsercreateuser(values as CreateUserWithAccountDto);
				toast.success("用戶創建成功");
			}
			setModalVisible(false);

			changePagination({
				...pagination,
				current: editingUser ? pagination.current : 1,
			});
		} catch (error) {
			console.error("操作失敗:", error);
			toast.error("操作失敗");
		}
	};

	const handleModalCancel = () => {
		setModalVisible(false);
	};

	const handleDeleteUser = async (user: UserEntity) => {
		try {
			await reqUserremove(
				{
					isSoft: true,
				},
				user.id.toString(),
			);
			changePagination({
				...pagination,

				total: (pagination.total || 1) - 1,
			});
			toast.success("用戶刪除成功");
		} catch (error) {
			console.error("刪除失敗:", error);
			toast.error("刪除失敗");
		}
	};

	const columns: ColumnsType<UserEntity> = [
		{
			title: "賬號",
			dataIndex: "account",
			width: 300,
		},
		{
			title: "用戶名",
			dataIndex: "userName",
			width: 300,
			render: (_, record) => {
				return (
					<div className="flex">
						<img alt="" src={record.headImgUrl} className="h-10 w-10 rounded-full" />
						<div className="ml-2 flex flex-col">
							<span className="text-sm">{record.userName}</span>
							<span className="text-xs text-text-secondary">{record.email}</span>
						</div>
					</div>
				);
			},
		},
		{
			title: "用戶角色",
			dataIndex: "role",
			align: "center",
			width: 120,
			render: (role: UserRoleInfoEntity) => <Badge variant="info">{role?.name}</Badge>,
		},
		{
			title: "用戶狀態",
			dataIndex: "disabled",
			align: "center",
			width: 120,
			render: (disabled) => <Badge variant={disabled ? "error" : "success"}>{disabled ? "停用" : "啟用"}</Badge>,
		},
		{
			title: "刪除狀態",
			dataIndex: "deleted",
			align: "center",
			width: 120,
			render: (deleted) => <Badge variant={deleted ? "error" : "success"}>{deleted ? "已刪除" : "正常"}</Badge>,
		},
		{
			title: "操作",
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-center text-gray-500">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => {
							push(`${pathname}/${record.id}`);
						}}
					>
						<Icon icon="mdi:card-account-details" size={18} />
					</Button>
					<Button variant="ghost" size="icon" onClick={() => handleEditUser(record)}>
						<Icon icon="solar:pen-bold-duotone" size={18} />
					</Button>
					<Popconfirm title="確認刪除嗎？" onConfirm={() => handleDeleteUser(record)}>
						<Button variant="ghost" size="icon">
							<Icon icon="mingcute:delete-2-fill" size={18} className="text-error!" />
						</Button>
					</Popconfirm>
				</div>
			),
		},
	];

	const handleSearchOrzReset = useCallback(
		(values: UserFilterParams) => {
			loadUsers(values as FilterParamsType);
		},
		[loadUsers],
	);
	return (
		<>
			<Card>
				<CardHeader>
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 mb-4">
						<div className="text-lg font-semibold">用户列表</div>

						<div className="flex-1 md:mx-4">
							<UserFilterForm onSearch={handleSearchOrzReset} onReset={handleSearchOrzReset} />
						</div>

						{/* 新增按钮 */}
						<div className="flex justify-end md:justify-start">
							<Button onClick={handleCreateUser}>新增用户</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<Table
						rowKey="id"
						size="small"
						scroll={{ x: "max-content" }}
						loading={loading}
						pagination={pagination}
						onChange={changePagination}
						columns={columns}
						dataSource={users}
					/>
				</CardContent>
			</Card>

			<UserModal
				visible={modalVisible}
				onCancel={handleModalCancel}
				onOk={handleModalOk}
				roles={roles}
				initialValues={
					editingUser
						? {
								userName: editingUser.userName,
								password: "",
								roleId: editingUser.roleId,
								state: editingUser.state,
								headImgUrl: editingUser.headImgUrl,
								mobile: editingUser.mobile,
								email: editingUser.email,
								gender: editingUser.gender as "Unknown" | "male" | "female" | undefined,
								birthday: editingUser.birthday ? dayjs(editingUser.birthday) : undefined,
								address: editingUser.address,
								companyName: editingUser.companyName,
								disabled: editingUser.disabled,
							}
						: undefined
				}
			/>
		</>
	);
}
