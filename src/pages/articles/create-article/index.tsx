import Editor from "@/components/editor";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { htmlToText } from "@/utils/htmlToText";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

export interface CreateArticleProps {
	title?: string;
}

const CreateArticle: React.FC<CreateArticleProps> = ({ title }) => {
	const [quillFull, setQuillFull] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = () => {
		// 檢查純文本內容 去除html和樣式，查看其內容是否為空
		const textContent = htmlToText(quillFull);
		if (!textContent.trim()) {
			toast.error("請輸入文章的內容");
			return;
		}
		setSubmitting(true);

		setTimeout(() => {
			console.log("提交內容", quillFull);
			toast.success("提交成功");
			setSubmitting(false);
			setQuillFull("");
		}, 1000);
	};

	return (
		<Card>
			<div className="createArticle-container w-full  mx-auto p-4 relative">
				<h2 className="scroll-m-20 tracking-wide font-semibold text-2xl text-text-primary mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-blue-300">
						{title ?? "文章"}
					</span>
					<span className="text-gray-400 text-base ml-2">發佈</span>
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
						{submitting ? "提交中..." : "提交"}
					</Button>
				</div>
			</div>
		</Card>
	);
};

export default CreateArticle;
