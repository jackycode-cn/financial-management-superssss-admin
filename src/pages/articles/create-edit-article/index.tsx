import { reqArticlecreate, reqArticlefindone, reqArticleupdate } from "@/api/services";
import Editor from "@/components/editor";
import { useArticleCategories } from "@/hooks/use-article-categories";
import { useParams } from "@/routes/hooks";
import type { CreateArticleDto } from "@/types";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { htmlToText } from "@/utils/htmlToText";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import CreateArticleModalMemo from "./create-article-modal";

export interface CreateArticleProps {
	title?: string;
}
const InitailFormValue: CreateArticleDto = {
	title: "",
	slug: "",
	description: "",
	content: "",
	category_id: undefined,
	seo_title: "",
	seo_description: "",
	seo_keywords: "",
	thumbnail: "",
	is_archive: false,
	is_top: false,
	is_featured: false,
	is_hot: false,
	is_published: false,
	is_external: false,
	external_url: "",
	external_author: "",
};
const CreateArticle: React.FC<CreateArticleProps> = ({ title }) => {
	const { articleId } = useParams();
	const navigate = useNavigate();
	const isEditMode = !!articleId;
	const [quillFull, setQuillFull] = useState("");
	const [showArticle, setShowArticle] = useState(false);
	const [formValue, setFormValue] = useState<CreateArticleDto>(InitailFormValue);
	const handleSubmit = () => {
		const textContent = htmlToText(quillFull);
		if (!textContent.trim()) {
			toast.error("請輸入文章的內容");
			return;
		}
		setFormValue((prev) => ({ ...prev, content: quillFull }));
		setShowArticle(true);
	};

	const handleCancel = () => {
		setShowArticle(false);
	};
	const handleSubmitCreateOrEdit = async (data: CreateArticleDto) => {
		if (isEditMode) {
			await reqArticleupdate(articleId, data);
			toast.success("文章編輯成功");
		} else {
			await reqArticlecreate(data);
			toast.success("文章創建成功");
		}
		setFormValue(InitailFormValue);
		setQuillFull("");
		setShowArticle(false);
	};

	/** 获取文章分类数据 */
	const categoryList = useArticleCategories()[0];

	useEffect(() => {
		if (isEditMode) {
			// 获取文章详情数据
			const fetchArticleDetail = async () => {
				try {
					const articleData = await reqArticlefindone(articleId);
					setFormValue({ ...articleData, content: articleData.content || "" });
					setQuillFull(articleData.content || "");
				} catch (error) {
					toast.error("文章加載失敗");
					navigate("/articles");
				}
			};
			fetchArticleDetail();
		} else {
			setFormValue(InitailFormValue);
			setQuillFull("");
		}
	}, [articleId, isEditMode, navigate]);

	return (
		<Card>
			<div className="createArticle-container w-full  mx-auto p-4 relative">
				<h2 className="scroll-m-20 tracking-wide font-semibold text-2xl text-text-primary mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-blue-300">
						{title ?? "文章"}
					</span>
					<span className="text-gray-400 text-base ml-2">{isEditMode ? "編輯" : "發佈"}</span>
				</h2>
				{/* 富文本编辑器 */}
				<Editor
					value={quillFull}
					onChange={setQuillFull}
					placeholder="請輸入內容"
					className="w-full max-h-[65vh] border border-gray-300 rounded"
				/>
				{/* 提交按钮 */}
				<div className="mt-4 flex justify-end">
					<Button variant="ghost" className="bg-success!" onClick={handleSubmit}>
						提交
					</Button>
				</div>
			</div>
			<CreateArticleModalMemo
				title={title}
				show={showArticle}
				type={isEditMode ? "edit" : "create"}
				categories={categoryList}
				formValue={formValue}
				onCancel={handleCancel}
				onSubmit={handleSubmitCreateOrEdit}
			/>
		</Card>
	);
};

export default CreateArticle;
