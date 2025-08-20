import { reqArticlecategorycreate, reqArticlecategoryupdate } from "@/api/services/ArticleCategory";
import type { CategoryResponseDto, CreateArticleCategoryDto, UpdateArticleCategoryDto } from "@/types";
import type { Category } from "@/types/normal";
import { Form, Input, InputNumber, Modal, Select, message } from "antd";
import { useEffect } from "react";

interface CategoryFormProps {
	visible: boolean;
	initialValues?: CategoryResponseDto;
	onCancel: () => void;
	onSubmit: () => void;
	categoryOptions: Category[];
}

const CategoryForm = ({ visible, initialValues, onCancel, onSubmit, categoryOptions }: CategoryFormProps) => {
	const [form] = Form.useForm();
	const isEditing = !!initialValues;

	useEffect(() => {
		if (visible && isEditing && initialValues) {
			form.setFieldsValue({
				name: initialValues.name,
				parent_id: initialValues.parent_id || null,
				level: initialValues.level,
				slug: initialValues.slug || null,
			});
		} else if (visible) {
			form.resetFields();
		}
	}, [visible, isEditing, initialValues, form]);

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();

			if (isEditing && initialValues) {
				const updateData: UpdateArticleCategoryDto = {
					parent_id: values.parent_id || null,
					level: values.level,
					slug: values.slug || null,
					name: values.name,
				};
				await reqArticlecategoryupdate(initialValues.id.toString(), updateData);
				message.success("分類更新成功");
			} else {
				// 创建新分类
				const createData: CreateArticleCategoryDto = values;
				await reqArticlecategorycreate(createData);
				message.success("分類創建成功");
			}

			form.resetFields();
			onSubmit();
		} catch (error) {
			console.error("表單提交失敗:", error);
			message.error("操作失敗，請重試");
		}
	};

	return (
		<Modal
			title={isEditing ? "編輯分類" : "添加分類"}
			open={visible}
			onCancel={onCancel}
			onOk={handleSubmit}
			destroyOnClose
		>
			<Form form={form} layout="vertical" name="category_form" initialValues={{ level: 1 }}>
				<Form.Item name="name" label="分類名稱" rules={[{ required: true, message: "請輸入分類名稱" }]}>
					<Input placeholder="請輸入分類名稱" />
				</Form.Item>

				<Form.Item name="parent_id" label="父分類" tooltip="留空表示沒有父級分類">
					<Select options={categoryOptions} optionFilterProp="label" allowClear={true} />
				</Form.Item>

				<Form.Item name="level" label="分類層級" rules={[{ required: true, message: "請輸入分類層級" }]}>
					<InputNumber min={1} max={3} style={{ width: "100%" }} placeholder="請輸入分類層級" />
				</Form.Item>

				<Form.Item
					name="slug"
					label="分類路徑"
					rules={[
						{
							required: false,
						},
						{
							pattern: /^[a-z0-9-]+$/,
							message: "只能輸入英文、數字和連字符(-)",
						},
					]}
				>
					<Input placeholder="請輸入URL友好的分類路徑（建議）" />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default CategoryForm;
