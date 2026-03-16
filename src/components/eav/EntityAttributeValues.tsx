import type { AttributeDef, CreateEntityAttributeValueDto, UpdateEntityAttributeValueDto } from "#/api";
import {
	reqEavcreateentityattributevalue,
	reqEavfindbyentity,
	reqEavfindbyentitytypeid,
	reqEavremoveentityattributevalue,
	reqEavupdateentityattributevalue,
} from "@/api/services/EAV";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Popconfirm, Select, message } from "antd";
import { DeleteIcon, SaveIcon } from "lucide-react";
import { type FC, useEffect, useState } from "react";

interface EntityAttributeValuesProps {
	/**
	 * 实体类型ID
	 */
	entityTypeId?: string;
	/**
	 * 實體類型的Code碼
	 */
	entityTypeCode?: string;
	/**
	 * 实体ID（可选，若未提供则通过onEntityCreated回调获取）
	 */
	entityId?: string | null;
	/**
	 * 实体创建完成后的回调函数，用于获取实体ID
	 */
	onEntityCreated?: (entityId: string) => void;
	/**
	 * 组件标题
	 */
	title?: string;
	/**
	 * 是否禁用编辑
	 */
	disabled?: boolean;
}

const EntityAttributeValues: FC<EntityAttributeValuesProps> = ({
	entityTypeId,
	entityId: externalEntityId,
	onEntityCreated,
	title = "属性值管理",
	disabled = false,
	entityTypeCode = "advertisement",
}) => {
	const [form] = Form.useForm();
	const [entityId, setEntityId] = useState<string | null>(externalEntityId || null);
	const [attributeValues, setAttributeValues] = useState<Map<string, string>>(new Map());
	const queryClient = useQueryClient();

	// 查询属性定义列表
	const {
		data: attributeDefs,
		isLoading: attributeDefsLoading,
		refetch: refetchAttributeDefs,
	} = useQuery({
		queryKey: ["attributeDefs", entityTypeCode || entityTypeId],
		queryFn: () => {
			const keyword = entityTypeCode || entityTypeId;
			if (!keyword) {
				return Promise.resolve([]);
			}
			const type = entityTypeCode ? "entityTypeCode" : "entityTypeId";
			return reqEavfindbyentitytypeid(keyword, type);
		},
		enabled: !!entityTypeCode || !!entityTypeId,
	});

	// 查询实体属性值
	const {
		data: entityValues,
		isLoading: entityValuesLoading,
		refetch: refetchEntityValues,
	} = useQuery({
		queryKey: ["entityAttributeValues", entityTypeCode || entityTypeId, entityId],
		queryFn: () => {
			if (!entityId) {
				return Promise.resolve([]);
			}
			// 使用实体类型ID或代码查询属性值
			const entityTypeIdentifier = entityTypeCode || entityTypeId;
			return reqEavfindbyentity({
				entityTypeId: entityTypeIdentifier,
				entityId,
			});
		},
		enabled: (!!entityTypeCode || !!entityTypeId) && !!entityId,
	});

	// 当实体值加载完成时，更新表单值
	useEffect(() => {
		if (entityValues && entityValues.length > 0) {
			const valuesMap = new Map<string, string>();
			// biome-ignore lint/complexity/noForEach: <explanation>
			entityValues.forEach((value) => {
				if (value.attrDefId) {
					valuesMap.set(value.attrDefId, value.attrValue || "");
				}
			});
			setAttributeValues(valuesMap);
			form.setFieldsValue(Object.fromEntries(valuesMap.entries()));
		}
	}, [entityValues, form]);

	// 当外部实体ID变化时，更新内部状态
	useEffect(() => {
		if (externalEntityId !== entityId) {
			setEntityId(externalEntityId || null);
		}
	}, [externalEntityId, entityId]);

	// 创建属性值
	const createMutation = useMutation({
		mutationFn: (data: CreateEntityAttributeValueDto) => reqEavcreateentityattributevalue(data),
		onSuccess: () => {
			message.success("属性值创建成功");
			refetchEntityValues();
		},
		onError: (error: any) => {
			message.error(`创建失败: ${error.message}`);
		},
	});

	// 更新属性值
	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateEntityAttributeValueDto }) =>
			reqEavupdateentityattributevalue(id, data),
		onSuccess: () => {
			message.success("属性值更新成功");
			refetchEntityValues();
		},
		onError: (error: any) => {
			message.error(`更新失败: ${error.message}`);
		},
	});

	// 删除属性值
	const deleteMutation = useMutation({
		mutationFn: (id: string) => reqEavremoveentityattributevalue(id),
		onSuccess: () => {
			message.success("属性值删除成功");
			refetchEntityValues();
		},
		onError: (error: any) => {
			message.error(`删除失败: ${error.message}`);
		},
	});

	// 处理表单提交
	const handleSubmit = () => {
		if (!entityId) {
			message.error("请先创建实体");
			return;
		}

		form.validateFields().then(async (values) => {
			try {
				// 使用实体类型ID或代码
				const entityTypeIdentifier = entityTypeCode || entityTypeId;
				if (!entityTypeIdentifier) {
					message.error("请提供实体类型");
					return;
				}

				// 遍历所有属性值，进行创建或更新
				for (const [attrDefId, attrValue] of Object.entries(values)) {
					const existingValue = entityValues?.find((value) => value.attrDefId === attrDefId);

					if (existingValue) {
						// 更新现有值
						await updateMutation.mutateAsync({
							id: existingValue.id,
							data: {
								attrValue: attrValue as string,
							},
						});
					} else {
						// 创建新值
						await createMutation.mutateAsync({
							entityTypeId: entityTypeIdentifier,
							entityId,
							attrDefId,
							attrValue: attrValue as string,
						});
					}
				}

				message.success("属性值保存成功");
			} catch (error) {
				message.error("保存失败");
			}
		});
	};

	// 处理删除属性值
	const handleDelete = (id: string) => {
		deleteMutation.mutate(id);
	};

	// 处理实体创建完成回调
	const handleEntityCreated = (newEntityId: string) => {
		setEntityId(newEntityId);
		onEntityCreated?.(newEntityId);
	};

	// 渲染属性输入组件
	const renderAttributeInput = (attributeDef: AttributeDef) => {
		const { id, attrName, attrType, placeholder, validationRules } = attributeDef;

		// 根据属性类型渲染不同的输入组件
		switch (attrType?.type) {
			case "select":
				return (
					<Form.Item
						key={id}
						name={id}
						label={attrName}
						rules={
							validationRules
								? Object.entries(validationRules).map(([key, value]) => ({
										[key]: value,
										message: `请输入有效的${attrName}`,
									}))
								: []
						}
					>
						<Select
							placeholder={placeholder || `请选择${attrName}`}
							disabled={disabled}
							options={attrType?.options || []}
						/>
					</Form.Item>
				);
			case "textarea":
				return (
					<Form.Item
						key={id}
						name={id}
						label={attrName}
						rules={
							validationRules
								? Object.entries(validationRules).map(([key, value]) => ({
										[key]: value,
										message: `请输入有效的${attrName}`,
									}))
								: []
						}
					>
						<Input.TextArea placeholder={placeholder || `请输入${attrName}`} disabled={disabled} rows={4} />
					</Form.Item>
				);
			default:
				return (
					<Form.Item
						key={id}
						name={id}
						label={attrName}
						rules={
							validationRules
								? Object.entries(validationRules).map(([key, value]) => ({
										[key]: value,
										message: `请输入有效的${attrName}`,
									}))
								: []
						}
					>
						<Input placeholder={placeholder || `请输入${attrName}`} disabled={disabled} />
					</Form.Item>
				);
		}
	};

	return (
		<div className="p-4 border rounded-lg">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-lg font-semibold">{title}</h3>
				{!disabled && entityId && (
					<Button
						type="primary"
						icon={<SaveIcon />}
						onClick={handleSubmit}
						loading={createMutation.isPending || updateMutation.isPending}
					>
						保存属性值
					</Button>
				)}
			</div>

			{!entityId && (
				<div className="p-4 bg-gray-50 rounded-lg mb-4">
					<p className="text-gray-600">实体尚未创建，属性值将在实体创建后通过回调函数绑定。</p>
				</div>
			)}

			<Form form={form} layout="vertical">
				{attributeDefsLoading ? (
					<div className="text-center py-4">加载属性定义中...</div>
				) : attributeDefs?.length === 0 ? (
					<div className="text-center py-4 text-gray-500">该实体类型暂无属性定义</div>
				) : attributeDefs ? (
					attributeDefs.map(renderAttributeInput)
				) : (
					[]
				)}
			</Form>

			{entityId && entityValues && entityValues.length > 0 && (
				<div className="mt-6">
					<h4 className="text-sm font-medium mb-2">现有属性值</h4>
					<div className="space-y-2">
						{entityValues.map((value) => (
							<div key={value.id} className="flex justify-between items-center p-2 border rounded">
								<div>
									<div className="font-medium">{value.attributeDef?.attrName || "未知属性"}</div>
									<div className="text-sm text-gray-600">{value.attrValue || "空值"}</div>
								</div>
								{!disabled && (
									<Popconfirm
										title="确定要删除吗？"
										onConfirm={() => handleDelete(value.id)}
										okText="确定"
										cancelText="取消"
									>
										<Button danger icon={<DeleteIcon />} size="small" />
									</Popconfirm>
								)}
							</div>
						))}
					</div>
				</div>
			)}

			{/* 暴露实体创建完成回调给父组件 */}
			{typeof onEntityCreated === "function" && (
				<input
					type="hidden"
					data-entity-created-callback="true"
					onChange={(e) => handleEntityCreated(e.target.value)}
				/>
			)}
		</div>
	);
};

export default EntityAttributeValues;
