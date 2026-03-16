import { Button, Card, Form, Input, Modal, Space, Table, Typography, message } from "antd";
import { LucideEdit, LucidePlus, LucideTrash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// 模拟API服务（实际项目中替换为真实API）
import { reqEavfindallentitytypes } from "@/api/services/EAV";

import type { EntityType } from "#/api";

import EntityAttributeValues from "@/components/eav/EntityAttributeValues";

const { Title } = Typography;

interface EntityFormValues {
	name: string;
	description: string;
}

const EntityAttributeBindingPage = () => {
	const [loading, setLoading] = useState(false);
	const [entityTypes, setEntityTypes] = useState<EntityType[]>([]);
	const [selectedEntityType, setSelectedEntityType] = useState<string | null>(null);
	const [entities, setEntities] = useState<Array<{ id: string; name: string; entityTypeId: string }>>([]);
	const [selectedEntity, setSelectedEntity] = useState<{ id: string; name: string; entityTypeId: string } | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingEntity, setEditingEntity] = useState<{ id: string; name: string; entityTypeId: string } | null>(null);
	const [form] = Form.useForm<EntityFormValues>();

	// 加载实体类型列表
	const loadEntityTypes = useCallback(async () => {
		setLoading(true);
		try {
			const response = await reqEavfindallentitytypes({ page: 1, pageSize: 100 });
			setEntityTypes(response.items || []);
		} catch (error) {
			message.error("获取实体类型列表失败");
		} finally {
			setLoading(false);
		}
	}, []);

	// 模拟加载实体列表（实际项目中替换为真实API）
	const loadEntities = useCallback(() => {
		// 模拟数据
		const mockEntities = [
			{ id: "entity-1", name: "实体1", entityTypeId: selectedEntityType || "" },
			{ id: "entity-2", name: "实体2", entityTypeId: selectedEntityType || "" },
			{ id: "entity-3", name: "实体3", entityTypeId: selectedEntityType || "" },
		];
		setEntities(mockEntities);
	}, [selectedEntityType]);

	useEffect(() => {
		loadEntityTypes();
	}, [loadEntityTypes]);

	useEffect(() => {
		if (selectedEntityType) {
			loadEntities();
		} else {
			setEntities([]);
			setSelectedEntity(null);
		}
	}, [selectedEntityType, loadEntities]);

	// 处理实体类型选择
	const handleEntityTypeChange = (value: string) => {
		setSelectedEntityType(value);
	};

	// 处理实体选择
	const handleEntitySelect = (entity: { id: string; name: string; entityTypeId: string }) => {
		setSelectedEntity(entity);
	};

	// 处理实体创建/更新
	const handleSubmit = async (values: EntityFormValues) => {
		try {
			if (!selectedEntityType) {
				message.error("请先选择实体类型");
				return;
			}

			if (editingEntity) {
				// 模拟更新实体
				const updatedEntities = entities.map((entity) =>
					entity.id === editingEntity.id ? { ...entity, name: values.name, description: values.description } : entity,
				);
				setEntities(updatedEntities);
				toast.success("更新成功");
			} else {
				// 模拟创建实体
				const newEntity = {
					id: `entity-${Date.now()}`,
					name: values.name,
					entityTypeId: selectedEntityType,
				};
				setEntities([...entities, newEntity]);
				toast.success("创建成功");
			}

			setModalVisible(false);
			form.resetFields();
			setEditingEntity(null);
		} catch (error) {
			console.error("Failed to save entity:", error);
			toast.error("操作失败");
		}
	};

	// 处理实体删除
	const handleDeleteEntity = (id: string) => {
		const updatedEntities = entities.filter((entity) => entity.id !== id);
		setEntities(updatedEntities);
		if (selectedEntity?.id === id) {
			setSelectedEntity(null);
		}
		message.success("删除成功");
	};

	// 打开创建实体模态框
	const handleAddEntity = () => {
		if (!selectedEntityType) {
			message.error("请先选择实体类型");
			return;
		}
		setEditingEntity(null);
		form.resetFields();
		setModalVisible(true);
	};

	// 打开编辑实体模态框
	const handleEditEntity = (entity: { id: string; name: string; entityTypeId: string }) => {
		setEditingEntity(entity);
		form.setFieldsValue({ name: entity.name, description: "" });
		setModalVisible(true);
	};

	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			<Card
				title={
					<Title level={4} className="mb-0">
						实体属性值绑定管理
					</Title>
				}
			>
				{/* 实体类型选择 */}
				<Card className="mb-4">
					<div className="flex items-center gap-4">
						<div className="w-40">
							<p className="block text-sm font-medium mb-1">选择实体类型</p>
							<select
								className="w-full p-2 border rounded"
								value={selectedEntityType || ""}
								onChange={(e) => handleEntityTypeChange(e.target.value)}
								disabled={loading}
							>
								<option value="">请选择实体类型</option>
								{entityTypes.map((type) => (
									<option key={type.id} value={type.id || ""}>
										{type.typeName}
									</option>
								))}
							</select>
						</div>
						{selectedEntityType && (
							<Button type="primary" icon={<LucidePlus />} onClick={handleAddEntity}>
								添加实体
							</Button>
						)}
					</div>
				</Card>

				{/* 实体列表 */}
				{selectedEntityType && (
					<Card className="mb-4">
						<Title level={5} className="mb-4">
							实体列表
						</Title>
						<Table
							dataSource={entities}
							rowKey="id"
							columns={[
								{
									title: "实体名称",
									dataIndex: "name",
									key: "name",
								},
								{
									title: "操作",
									key: "action",
									render: (_: any, record: { id: string; name: string; entityTypeId: string }) => (
										<Space size="middle">
											<Button
												type="primary"
												icon={<LucideEdit />}
												size="small"
												onClick={() => handleEditEntity(record)}
											>
												编辑
											</Button>
											<Button danger icon={<LucideTrash2 />} size="small" onClick={() => handleDeleteEntity(record.id)}>
												删除
											</Button>
											<Button type="link" onClick={() => handleEntitySelect(record)}>
												管理属性值
											</Button>
										</Space>
									),
								},
							]}
							pagination={{ pageSize: 10 }}
						/>
					</Card>
				)}

				{/* 属性值管理 */}
				{selectedEntity && (
					<Card className="mb-4">
						<Title level={5} className="mb-4">
							属性值管理 - {selectedEntity.name}
						</Title>
						<EntityAttributeValues
							entityTypeId={selectedEntity.entityTypeId}
							entityId={selectedEntity.id}
							title={`${selectedEntity.name}的属性值`}
						/>
					</Card>
				)}

				{/* 编辑/添加实体模态框 */}
				<Modal
					title={editingEntity ? "编辑实体" : "添加实体"}
					open={modalVisible}
					onCancel={() => {
						setModalVisible(false);
						setEditingEntity(null);
						form.resetFields();
					}}
					footer={null}
					width={600}
				>
					<Form form={form} layout="vertical" onFinish={handleSubmit}>
						<Form.Item name="name" label="实体名称" rules={[{ required: true, message: "请输入实体名称" }]}>
							<Input placeholder="请输入实体名称" />
						</Form.Item>

						<Form.Item name="description" label="实体描述">
							<Input.TextArea rows={3} placeholder="请输入实体描述" />
						</Form.Item>

						<Form.Item>
							<Space>
								<Button
									onClick={() => {
										setModalVisible(false);
										setEditingEntity(null);
										form.resetFields();
									}}
								>
									取消
								</Button>
								<Button type="primary" htmlType="submit">
									{editingEntity ? "更新" : "创建"}
								</Button>
							</Space>
						</Form.Item>
					</Form>
				</Modal>
			</Card>
		</div>
	);
};

export default EntityAttributeBindingPage;
