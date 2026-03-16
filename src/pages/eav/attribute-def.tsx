import type { AttributeDef, CreateAttributeDefDto, UpdateAttributeDefDto } from "#/api";
import {
	reqEavcreateattributedef,
	reqEavfindallattributedefs,
	reqEavfindallentitytypes,
	reqEavfindoneattributedef,
	reqEavremoveattributedef,
	reqEavupdateattributedef,
} from "@/api/services/EAV";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Popconfirm, Select, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteIcon, EditIcon, PlusIcon, SearchIcon } from "lucide-react";
import { type FC, useState } from "react";
import { AttrTypeEnum } from "./enum";

const AttributeDefPage: FC = () => {
	const [form] = Form.useForm();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [searchText, setSearchText] = useState("");
	const queryClient = useQueryClient();

	// 查詢屬性定義列表
	const {
		data: attributeDefs,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["attributeDefs"],
		queryFn: () => reqEavfindallattributedefs({ page: 1, pageSize: 10 }),
	});

	// 查詢實體類型列表（用於下拉選擇）
	const { data: entityTypes, isLoading: entityTypesLoading } = useQuery({
		queryKey: ["entityTypesForSelect"],
		queryFn: () => reqEavfindallentitytypes({ page: 1, pageSize: 100 }),
	});

	// 創建屬性定義
	const createMutation = useMutation({
		mutationFn: (data: CreateAttributeDefDto) => reqEavcreateattributedef(data),
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

	// 更新屬性定義
	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateAttributeDefDto }) => reqEavupdateattributedef(id, data),
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

	// 刪除屬性定義
	const deleteMutation = useMutation({
		mutationFn: (id: string) => reqEavremoveattributedef(id),
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
			const attributeDef = await reqEavfindoneattributedef(id);
			form.setFieldsValue(attributeDef);
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

	const columns: ColumnsType<AttributeDef> = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "名稱",
			dataIndex: "attrName",
			key: "attrName",
		},
		{
			title: "標識符",
			dataIndex: "attrCode",
			key: "attrCode",
		},
		{
			title: "實體類型",
			dataIndex: "entityTypeId",
			key: "entityTypeId",
			render: (entityTypeId: string) => {
				const entityType = entityTypes?.items.find((item) => item.id === entityTypeId);
				return entityType?.typeName || entityTypeId;
			},
		},
		{
			title: "數據類型",
			dataIndex: "attrType",
			key: "attrType",
		},
		{
			title: "操作",
			key: "action",
			render: (_: any, record: AttributeDef) => (
				<div>
					<Button
						type="primary"
						icon={<EditIcon />}
						size="small"
						onClick={() => handleEdit(record.id)}
						style={{ marginRight: 8 }}
					>
						編輯
					</Button>
					<Popconfirm title="確定要刪除嗎？" onConfirm={() => handleDelete(record.id)} okText="確定" cancelText="取消">
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
				<h2 className="text-xl font-bold">屬性定義管理</h2>
				<div className="flex gap-2">
					<Input
						placeholder="搜索屬性定義"
						prefix={<SearchIcon />}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						style={{ width: 200 }}
					/>
					<Button type="primary" icon={<PlusIcon />} onClick={handleAdd}>
						新增屬性定義
					</Button>
				</div>
			</div>

			<Table
				columns={columns}
				dataSource={attributeDefs?.items || []}
				loading={isLoading}
				rowKey="id"
				pagination={{
					total: attributeDefs?.pagination.total || 0,
					pageSize: 10,
					onChange: (page) => {
						// 可以在这里处理分页逻辑
					},
				}}
			/>

			<Modal
				title={editingId ? "編輯屬性定義" : "新增屬性定義"}
				open={isModalOpen}
				onOk={handleSubmit}
				onCancel={() => {
					setIsModalOpen(false);
					form.resetFields();
					setEditingId(null);
				}}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="attrName" label="名稱" rules={[{ required: true, message: "請輸入名稱" }]}>
						<Input placeholder="請輸入屬性名稱" />
					</Form.Item>
					<Form.Item name="attrCode" label="標識符" rules={[{ required: true, message: "請輸入標識符" }]}>
						<Input placeholder="請輸入屬性標識符" />
					</Form.Item>
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
					<Form.Item name="attrType" label="數據類型" rules={[{ required: true, message: "請選擇數據類型" }]}>
						<Select
							placeholder="請選擇數據類型"
							options={[
								{ value: AttrTypeEnum.Text, label: "字符串" },
								{ value: AttrTypeEnum.Number, label: "數字" },
								{ value: AttrTypeEnum.Button, label: "按鈕" },
								{ value: AttrTypeEnum.Date, label: "日期" },
								{ value: AttrTypeEnum.Color, label: "顏色" },
								{ value: AttrTypeEnum.Switch, label: "切換" },
								{ value: AttrTypeEnum.Select, label: "選擇" },
								{ value: AttrTypeEnum.Link, label: "鏈接" },
								{ value: AttrTypeEnum.Textarea, label: "文本區域" },
								{ value: AttrTypeEnum.Image, label: "圖像" },
								{ value: AttrTypeEnum.Tag, label: "標籤" },
								{ value: AttrTypeEnum.Price, label: "價格" },
								{ value: AttrTypeEnum.Rating, label: "評分" },
							]}
						/>
					</Form.Item>
					<Form.Item name="description" label="描述">
						<Input.TextArea placeholder="請輸入屬性描述" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default AttributeDefPage;
