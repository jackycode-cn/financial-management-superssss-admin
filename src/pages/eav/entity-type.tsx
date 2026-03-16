import type { CreateEntityTypeDto, EntityType, UpdateEntityTypeDto } from "#/api";
import {
	reqEavcreateentitytype,
	reqEavfindallentitytypes,
	reqEavfindoneentitytype,
	reqEavremoveentitytype,
	reqEavupdateentitytype,
} from "@/api/services/EAV";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Popconfirm, Select, Table, message } from "antd";
import { DeleteIcon, EditIcon, PlusIcon, SearchIcon } from "lucide-react";
import { type FC, useState } from "react";

const EntityTypePage: FC = () => {
	const [form] = Form.useForm();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [searchText, setSearchText] = useState("");
	const queryClient = useQueryClient();

	// 查詢實體類型列表
	const {
		data: entityTypes,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["entityTypes"],
		queryFn: () => reqEavfindallentitytypes({ page: 1, pageSize: 10 }),
	});

	// 創建實體類型
	const createMutation = useMutation({
		mutationFn: (data: CreateEntityTypeDto) => reqEavcreateentitytype(data),
		onSuccess: () => {
			message.success("創建成功");
			setIsModalOpen(false);
			form.resetFields();
			refetch();
		},
		onError: (error: any) => {
			message.error(`創建失敗: ${error.message}`);
		},
	});

	// 更新實體類型
	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateEntityTypeDto }) => reqEavupdateentitytype(id, data),
		onSuccess: () => {
			message.success("更新成功");
			setIsModalOpen(false);
			form.resetFields();
			setEditingId(null);
			refetch();
		},
		onError: (error: any) => {
			message.error(`更新失敗: ${error.message}`);
		},
	});

	// 刪除實體類型
	const deleteMutation = useMutation({
		mutationFn: (id: string) => reqEavremoveentitytype(id),
		onSuccess: () => {
			message.success("刪除成功");
			refetch();
		},
		onError: (error: any) => {
			message.error(`刪除失敗: ${error.message}`);
		},
	});

	// 打開新增模態框
	const handleAdd = () => {
		setEditingId(null);
		form.resetFields();
		setIsModalOpen(true);
	};

	// 打開編輯模態框
	const handleEdit = async (id: string) => {
		try {
			const entityType = await reqEavfindoneentitytype(id);
			form.setFieldsValue(entityType);
			setEditingId(id);
			setIsModalOpen(true);
		} catch (error) {
			message.error("獲取數據失敗");
		}
	};

	// 處理表單提交
	const handleSubmit = () => {
		form.validateFields().then((values) => {
			if (editingId) {
				updateMutation.mutate({ id: editingId, data: values });
			} else {
				createMutation.mutate(values);
			}
		});
	};

	// 處理刪除
	const handleDelete = (id: string) => {
		deleteMutation.mutate(id);
	};

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "名稱",
			dataIndex: "typeName",
			key: "typeName",
		},
		{
			title: "代碼",
			dataIndex: "typeCode",
			key: "typeCode",
		},
		{
			title: "描述",
			dataIndex: "description",
			key: "description",
		},
		{
			title: "狀態",
			dataIndex: "status",
			key: "status",
			render: (status: number) => (status === 1 ? "啟用" : "禁用"),
		},
		{
			title: "創建時間",
			dataIndex: "createdAt",
			key: "createdAt",
		},
		{
			title: "操作",
			key: "action",
			render: (_: any, record: EntityType) => (
				<div>
					<Button
						type="primary"
						icon={<EditIcon />}
						size="small"
						onClick={() => handleEdit(record.id || "")}
						style={{ marginRight: 8 }}
					>
						編輯
					</Button>
					<Popconfirm
						title="確定要刪除嗎？"
						onConfirm={() => handleDelete(record.id || "")}
						okText="確定"
						cancelText="取消"
					>
						<Button danger icon={<DeleteIcon />} size="small">
							刪除
						</Button>
					</Popconfirm>
				</div>
			),
		},
	];

	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-bold">實體類型管理</h2>
				<div className="flex gap-2">
					<Input
						placeholder="搜索實體類型"
						prefix={<SearchIcon />}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						style={{ width: 200 }}
					/>
					<Button type="primary" icon={<PlusIcon />} onClick={handleAdd}>
						新增實體類型
					</Button>
				</div>
			</div>

			<Table
				columns={columns}
				dataSource={entityTypes?.items || []}
				loading={isLoading}
				rowKey="id"
				pagination={{
					total: entityTypes?.pagination.total || 0,
					pageSize: 10,
					onChange: (page) => {
						// 可以在这里处理分页逻辑
					},
				}}
			/>

			<Modal
				title={editingId ? "編輯實體類型" : "新增實體類型"}
				open={isModalOpen}
				onOk={handleSubmit}
				onCancel={() => {
					setIsModalOpen(false);
					form.resetFields();
					setEditingId(null);
				}}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="typeName" label="名稱" rules={[{ required: true, message: "請輸入名稱" }]}>
						<Input placeholder="請輸入實體類型名稱" />
					</Form.Item>
					<Form.Item name="typeCode" label="代碼" rules={[{ required: true, message: "請輸入代碼" }]}>
						<Input placeholder="請輸入實體類型代碼" />
					</Form.Item>
					<Form.Item name="description" label="描述">
						<Input.TextArea placeholder="請輸入實體類型描述" />
					</Form.Item>
					<Form.Item name="status" label="狀態" initialValue={1}>
						<Select
							options={[
								{ value: 1, label: "啟用" },
								{ value: 0, label: "禁用" },
							]}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default EntityTypePage;
