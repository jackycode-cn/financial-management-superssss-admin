import { Button, Typography, message } from "antd";
import { useState } from "react";

import { reqArticlecategoryremove } from "@/api/services/ArticleCategory";
import { useArticleCategories } from "@/hooks/use-article-categories";
import type { CategoryResponseDto } from "@/types";
import { PlusIcon } from "lucide-react";
import CategoryForm from "./CategoryForm";
import CategoryTable from "./CategoryTable";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const { Title } = Typography;

export interface ArticleCategoryProps {
	/** 示例：组件标题 */
	title?: string;
}

function ArticleCategory({ title }: ArticleCategoryProps) {
	const [loading, setLoading] = useState<boolean>(false);
	const [visible, setVisible] = useState<boolean>(false);
	const [editingCategory, setEditingCategory] = useState<CategoryResponseDto | null>(null);
	const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
	const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

	const [categoriesOption, _setCategoriesOption, fetchCategories, _pagination, categories, _setCategories] =
		useArticleCategories();

	const handleSubmit = async () => {
		setVisible(false);
		fetchCategories();
	};

	const handleDelete = async () => {
		if (!categoryToDelete) return;

		try {
			setLoading(true);
			await reqArticlecategoryremove(categoryToDelete.toString());
			message.success("分類刪除成功");
			fetchCategories();
		} catch (error) {
			message.error("分類刪除失敗");
			console.error("Error deleting category:", error);
		} finally {
			setLoading(false);
			setDeleteModalVisible(false);
			setCategoryToDelete(null);
		}
	};

	return (
		<div className="article-category-container">
			<div className="flex justify-between items-center">
				<Title level={3}>{title ?? "文章分類"}</Title>
				<Button
					icon={<PlusIcon />}
					type="primary"
					shape="round"
					size="large"
					onClick={() => {
						setEditingCategory(null);
						setVisible(true);
					}}
				>
					添加分類
				</Button>
			</div>

			{/* 分类列表表格 */}
			<CategoryTable
				dataSource={categories}
				loading={loading}
				onEdit={(record) => {
					setEditingCategory(record);
					setVisible(true);
				}}
				onDelete={(id) => {
					setCategoryToDelete(id);
					setDeleteModalVisible(true);
				}}
				categoryOptions={categoriesOption}
			/>

			{/* 添加/编辑分类表单 */}
			<CategoryForm
				visible={visible}
				initialValues={editingCategory || undefined}
				onCancel={() => setVisible(false)}
				onSubmit={handleSubmit}
				categoryOptions={categoriesOption}
			/>

			{/* 删除确认弹窗 */}
			<ConfirmDeleteModal
				visible={deleteModalVisible}
				onCancel={() => setDeleteModalVisible(false)}
				onConfirm={handleDelete}
			/>
		</div>
	);
}

export default ArticleCategory;
