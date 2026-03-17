import type { AttributeDef } from "#/api";
import { useEntityAttributeValues } from "@/hooks/useEntityAttributeValues";
import { Button, Form, Input, Popconfirm, Select, message } from "antd";
import { DeleteIcon, SaveIcon } from "lucide-react";
import { type FC, useEffect } from "react";
import { useTranslation } from "react-i18next";

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
	 * 实体ID
	 */
	entityId?: string | null;
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
	entityId,
	entityTypeCode = "advertisement",
	title = "屬性值管理",
	disabled = false,
}) => {
	const [form] = Form.useForm();
	const { t } = useTranslation();
	// 使用自定义Hook获取所有业务逻辑
	const {
		attributeDefs,
		attributeDefsLoading,
		entityValues,
		entityValuesLoading,
		refetchEntityValues,
		deleteValue,
		bulkUpdateValues,
		isDeleting,
		isBulkUpdating,
	} = useEntityAttributeValues({
		entityTypeId,
		entityId,
		entityTypeCode,
		disabled,
	});

	// 当实体值加载完成时，更新表单值
	useEffect(() => {
		if (entityValues && entityValues.length > 0) {
			const valuesMap: Record<string, string> = {};
			// biome-ignore lint/complexity/noForEach: <explanation>
			entityValues.forEach((value) => {
				if (value.attrDefId) {
					valuesMap[value.attrDefId] = value.attrValue || "";
				}
			});
			form.setFieldsValue(valuesMap);
		}
	}, [entityValues, form]);

	// 处理表单提交
	const handleSubmit = () => {
		if (!entityId) {
			message.error("請先創建實體");
			return;
		}

		form.validateFields().then((values) => {
			// 使用实体类型ID或代码
			const entityTypeIdentifier = entityTypeCode || entityTypeId;
			if (!entityTypeIdentifier) {
				message.error("請提供實體類型");
				return;
			}

			// 構建批量更新的數據
			const valuesToSave = Object.entries(values).map(([attrDefId, attrValue]) => ({
				attrDefId,
				attrValue: attrValue as string,
			}));

			// 调用批量更新接口
			bulkUpdateValues(entityTypeIdentifier, entityId, valuesToSave);
		});
	};

	// 处理删除属性值
	const handleDelete = (id: string) => {
		deleteValue(id);
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
										message: `請選擇有效的${attrName}`,
									}))
								: []
						}
					>
						<Select
							placeholder={placeholder || `請選擇${attrName}`}
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
										message: `請輸入有效的${attrName}`,
									}))
								: []
						}
					>
						<Input.TextArea placeholder={placeholder || `請輸入${attrName}`} disabled={disabled} rows={4} />
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
										message: `請輸入有效的${attrName}`,
									}))
								: []
						}
					>
						<Input placeholder={placeholder || `請輸入${attrName}`} disabled={disabled} />
					</Form.Item>
				);
		}
	};

	return (
		<div className="p-4 border rounded-lg">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-lg font-semibold">{title}</h3>
				{!disabled && entityId && (
					<Button type="primary" icon={<SaveIcon />} onClick={handleSubmit} loading={isBulkUpdating}>
						保存屬性值
					</Button>
				)}
			</div>

			{!entityId && (
				<div className="p-4 bg-gray-50 rounded-lg mb-4">
					<p className="text-gray-600">實體尚未創建，請先創建實體以管理屬性值。</p>
				</div>
			)}

			<Form form={form} layout="vertical">
				{attributeDefsLoading ? (
					<div className="text-center py-4">加載屬性定義中...</div>
				) : attributeDefs?.length === 0 ? (
					<div className="text-center py-4 text-gray-500">該實體類型暂无屬性定義</div>
				) : attributeDefs ? (
					attributeDefs.map(renderAttributeInput)
				) : (
					[]
				)}
			</Form>

			{entityId && entityValues && entityValues.length > 0 && (
				<div className="mt-6">
					<h4 className="text-sm font-medium mb-2">現有屬性</h4>
					<div className="space-y-2">
						{entityValues.map((value) => (
							<div key={value.id} className="flex justify-between items-center p-2 border rounded">
								<div>
									<div className="font-medium">{value.attributeDef?.attrName || "未知屬性"}</div>
									<div className="text-sm text-gray-600">{value.attrValue || "空值"}</div>
								</div>
								{!disabled && (
									<Popconfirm title={t("tip.delete")} onConfirm={() => handleDelete(value.id)}>
										<Button danger icon={<DeleteIcon />} size="small" />
									</Popconfirm>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default EntityAttributeValues;
