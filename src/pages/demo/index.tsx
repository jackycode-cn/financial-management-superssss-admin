import EntityAttributeValues from "@/components/eav/EntityAttributeValues";
import { Button, Form, Input, Modal, message } from "antd";
import { PlusIcon } from "lucide-react";
import { type FC, useState } from "react";

const EntityAttributeDemoPage: FC = () => {
	const [form] = Form.useForm();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [entityId, setEntityId] = useState<string | null>(null);
	const [entityName, setEntityName] = useState("");

	// 模拟实体类型ID（实际应用中可能从下拉选择或路由参数获取）
	const entityTypeId = "example-entity-type-id";

	// 处理实体创建
	const handleCreateEntity = () => {
		form.validateFields().then((values) => {
			// 模拟创建实体的API调用
			setTimeout(() => {
				// 模拟生成的实体ID
				const newEntityId = `entity-${Date.now()}`;
				setEntityId(newEntityId);
				setEntityName(values.name);
				message.success("实体创建成功");
				setIsModalOpen(false);
				form.resetFields();
			}, 500);
		});
	};

	// 处理实体创建完成后的回调
	const handleEntityCreated = (newEntityId: string) => {
		setEntityId(newEntityId);
		message.success(`属性值已绑定到实体 ${newEntityId}`);
	};

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold">EAV属性值管理示例</h2>
				<Button type="primary" icon={<PlusIcon />} onClick={() => setIsModalOpen(true)}>
					创建新实体
				</Button>
			</div>

			{entityId ? (
				<div className="space-y-6">
					<div className="p-4 bg-blue-50 rounded-lg">
						<h3 className="text-lg font-semibold mb-2">当前实体</h3>
						<p>实体名称: {entityName}</p>
						<p>实体ID: {entityId}</p>
						<p>实体类型ID: {entityTypeId}</p>
					</div>

					{/* 使用通用EAV属性值管理组件 */}
					<EntityAttributeValues entityTypeId={entityTypeId} entityId={entityId} title="实体属性值" />
				</div>
			) : (
				<div className="p-8 bg-gray-50 rounded-lg text-center">
					<p className="text-gray-600 mb-4">请先创建一个实体</p>
					<Button type="primary" icon={<PlusIcon />} onClick={() => setIsModalOpen(true)}>
						创建实体
					</Button>
				</div>
			)}

			{/* 创建实体的模态框 */}
			<Modal title="创建新实体" open={isModalOpen} onOk={handleCreateEntity} onCancel={() => setIsModalOpen(false)}>
				<Form form={form} layout="vertical">
					<Form.Item name="name" label="实体名称" rules={[{ required: true, message: "请输入实体名称" }]}>
						<Input placeholder="请输入实体名称" />
					</Form.Item>
					<Form.Item name="description" label="实体描述">
						<Input.TextArea placeholder="请输入实体描述" rows={4} />
					</Form.Item>
				</Form>
			</Modal>

			{/* 示例：在实体创建前使用组件（通过回调绑定） */}
			<div className="mt-12">
				<h3 className="text-xl font-semibold mb-4">示例：实体创建前的属性值管理</h3>
				<p className="mb-4 text-gray-600">此示例展示如何在实体创建前设置属性值，然后通过回调函数在实体创建后绑定。</p>

				<EntityAttributeValues
					entityId={null} // 未提供实体ID
					entityTypeCode="advertisement"
					title="预设置属性值"
				/>

				<div className="mt-4">
					<Button
						type="primary"
						onClick={() => {
							// 模拟实体创建，然后调用回调函数绑定属性值
							const newEntityId = `entity-${Date.now()}`;
							handleEntityCreated(newEntityId);
						}}
					>
						模拟创建实体并绑定属性值
					</Button>
				</div>
			</div>
		</div>
	);
};

export default EntityAttributeDemoPage;
