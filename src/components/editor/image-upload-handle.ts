import { reqFileuploadfile } from "@/api/services/Fileupload";
import type { Quill } from "react-quill-new";
import { toast } from "sonner";

/**
 * 上传图片并插入到 Quill 编辑器中
 * @param quill Quill 实例
 * @param file 图片文件
 * @param maxSizeMB 最大允许的图片大小（单位 MB，默认 2）
 */
export async function uploadAndInsertImage(quill: Quill, file: File, maxSizeMB = 2) {
	const size = file.size / 1024 / 1024;
	if (size > maxSizeMB) {
		toast.error(`圖片大小不能超過 ${maxSizeMB}MB!`, {
			position: "top-center",
		});
		throw new Error(`圖片大小不能超過 ${maxSizeMB}MB!`);
	}

	try {
		const { accessUrl, tempAccessUrl } = await reqFileuploadfile(file);
		const range = quill.getSelection(true);
		quill.insertEmbed(range.index, "image", tempAccessUrl || accessUrl);
		quill.setSelection(range.index + 1);
	} catch (err) {
		console.error("圖片上傳失敗", err);
		toast.error("圖片上傳失敗", {
			position: "top-center",
		});
		throw err;
	}
}

export function imageHandler(quill: Quill) {
	const input = document.createElement("input");
	input.setAttribute("type", "file");
	input.setAttribute("accept", "image/*");
	input.click();

	input.onchange = async () => {
		if (!input.files || input.files.length === 0) return;
		const file = input.files[0];
		if (!file) return;
		await uploadAndInsertImage(quill, file, 2);
	};
}
