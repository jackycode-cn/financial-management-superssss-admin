import type { CreateEntityAttributeValueDto, EntityAttributeValue, UpdateEntityAttributeValueDto } from "#/api";
import {
	reqEavcreateentityattributevalue,
	reqEavfindallentitytypes,
	reqEavfindbyentity,
	reqEavfindbyentitytypeid,
	reqEavfindoneentityattributevalue,
	reqEavremovebyentity,
	reqEavremoveentityattributevalue,
	reqEavupdateentityattributevalue,
} from "@/api/services/EAV";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteIcon, EditIcon, LucideDelete, PlusIcon } from "lucide-react";
import { type FC, useEffect, useState } from "react";

const EntityAttributeValuePage: FC = () => {
	const [form] = Form.useForm();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [selectedEntityType, setSelectedEntityType] = useState<string>("");
	const [selectedEntityId, setSelectedEntityId] = useState<string>("");
	const [attributeDefs, setAttributeDefs] = useState<any[]>([]);
	const queryClient = useQueryClient();

	// 查詢實體類型列表（用於下拉選擇）
	const { data: entityTypes, isLoading: entityTypesLoading } = useQuery({
		queryKey: ["entityTypesForSelect"],
		queryFn: () => reqEavfindallentitytypes({ page: 1, pageSize: 100 }),
	});

	// 查詢屬性定義列表（根據選擇的實體類型）
	useEffect(() => {
		if (selectedEntityType) {
			reqEavfindbyentitytypeid(selectedEntityType)
				.then((data) => setAttributeDefs(data))
				.catch((error) => {
					message.error("獲取屬性定義失敗");
				});
		} else {
			setAttributeDefs([]);
		}
	}, [selectedEntityType]);

	// 查詢實體屬性值列表
	const {
		data: entityAttributeValues,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["entityAttributeValues", selectedEntityType, selectedEntityId],
		queryFn: () => {
			if (selectedEntityType && selectedEntityId) {
				return reqEavfindbyentity({ entityTypeId: selectedEntityType, entityId: selectedEntityId });
			}
			return Promise.resolve([]);
		},
		enabled: !!selectedEntityType && !!selectedEntityId,
	});

	// 創建實體屬性值
	const createMutation = useMutation({
		mutationFn: (data: CreateEntityAttributeValueDto) => reqEavcreateentityattributevalue(data),
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

	// 更新實體屬性值
	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateEntityAttributeValueDto }) =>
			reqEavupdateentityattributevalue(id, data),
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

	// 刪除實體屬性值
	const deleteMutation = useMutation({
		mutationFn: (id: string) => reqEavremoveentityattributevalue(id),
		onSuccess: () => {
			message.success("刪除成功");
			refetch();
		},
		onError: (error: any) => {
			message.error(`刪除失敗: ${error.message}`);
		},
	});

	// 刪除實體的所有屬性值
	const deleteAllMutation = useMutation({
		mutationFn: () => reqEavremovebyentity(selectedEntityType, selectedEntityId),
		onSuccess: () => {
			message.success("刪除所有屬性值成功");
			refetch();
		},
		onError: (error: any) => {
			message.error(`刪除失敗: ${error.message}`);
		},
	});

	// 打開新增模態框
	const handleAdd = () => {
		if (!selectedEntityType || !selectedEntityId) {
			message.warning("請先選擇實體類型和實體ID");
			return;
		}
		setEditingId(null);
		form.resetFields();
		form.setFieldsValue({ entityTypeId: selectedEntityType, entityId: selectedEntityId });
		setIsModalOpen(true);
	};

	// 打開編輯模態框
	const handleEdit = async (id: string) => {
		try {
			const entityAttributeValue = await reqEavfindoneentityattributevalue(id);
			form.setFieldsValue(entityAttributeValue);
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

	// 處理刪除所有
	const handleDeleteAll = () => {
		if (!selectedEntityType || !selectedEntityId) {
			message.warning("請先選擇實體類型和實體ID");
			return;
		}
		deleteAllMutation.mutate();
	};

	const columns: ColumnsType<EntityAttributeValue> = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "屬性定義",
			dataIndex: "attrDefId",
			key: "attrDefId",
			render: (attrDefId: string) => {
				const attributeDef = attributeDefs.find((item) => item.id === attrDefId);
				return attributeDef?.attrName || attrDefId;
			},
		},
		{
			title: "屬性值(普通值)",
			dataIndex: "attrValue",
			key: "attrValue",
			render: (attrValue: any) => {
				if (typeof attrValue === "object") {
					return JSON.stringify(attrValue);
				}
				return attrValue;
			},
		},
		{
			title: "屬性值（JSON格式）",
			dataIndex: "attrValueJson",
			key: "attrValueJson",
		},
		{
			title: "操作",
			key: "action",
			render: (_: any, record: EntityAttributeValue) => (
				<Space>
					<Button type="primary" icon={<EditIcon />} size="small" onClick={() => handleEdit(record.id)}>
						編輯
					</Button>
					<Popconfirm title="確定要刪除嗎？" onConfirm={() => handleDelete(record.id)} okText="確定" cancelText="取消">
						<Button danger icon={<DeleteIcon />} size="small">
							刪除
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-bold">實體屬性值管理</h2>
				<div className="flex gap-2">
					<Select
						placeholder="選擇實體類型"
						loading={entityTypesLoading}
						value={selectedEntityType}
						onChange={setSelectedEntityType}
						style={{ width: 200 }}
						options={
							entityTypes?.items.map((item) => ({
								value: item.id,
								label: item.typeName,
							})) || []
						}
					/>
					<Input
						placeholder="輸入實體ID"
						value={selectedEntityId}
						onChange={(e) => setSelectedEntityId(e.target.value)}
						style={{ width: 200 }}
					/>
					<Button type="primary" icon={<PlusIcon />} onClick={handleAdd}>
						新增屬性值
					</Button>
					<Popconfirm title="確定要刪除所有屬性值嗎？" onConfirm={handleDeleteAll} okText="確定" cancelText="取消">
						<Button danger icon={<LucideDelete />}>
							刪除所有
						</Button>
					</Popconfirm>
				</div>
			</div>

			<Table
				columns={columns}
				dataSource={entityAttributeValues || []}
				loading={isLoading}
				rowKey="id"
				pagination={false}
				locale={{ emptyText: "請選擇實體類型和實體ID查看屬性值" }}
			/>

			<Modal
				title={editingId ? "編輯實體屬性值" : "新增實體屬性值"}
				open={isModalOpen}
				onOk={handleSubmit}
				onCancel={() => {
					setIsModalOpen(false);
					form.resetFields();
					setEditingId(null);
				}}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="entityTypeId" label="實體類型" rules={[{ required: true, message: "請選擇實體類型" }]}>
						<Select
							placeholder="請選擇實體類型"
							loading={entityTypesLoading}
							options={
								entityTypes?.items.map((item) => ({
									value: item.id,
									label: item.typeName,
								})) || []
							}
						/>
					</Form.Item>
					<Form.Item name="entityId" label="實體ID" rules={[{ required: true, message: "請輸入實體ID" }]}>
						<Input placeholder="請輸入實體ID" />
					</Form.Item>
					<Form.Item name="attrDefId" label="屬性定義" rules={[{ required: true, message: "請選擇屬性定義" }]}>
						<Select
							placeholder="請選擇屬性定義"
							options={attributeDefs.map((item) => ({
								value: item.id,
								label: item.attrName,
							}))}
						/>
					</Form.Item>
					<Form.Item name="attrValue" label="屬性值" rules={[{ required: true, message: "請輸入屬性值" }]}>
						<Input.TextArea placeholder="請輸入屬性值" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default EntityAttributeValuePage;
