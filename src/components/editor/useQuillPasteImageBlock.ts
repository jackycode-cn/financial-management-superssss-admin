import { type RefObject, useEffect } from "react";
import type ReactQuill from "react-quill-new";

/**
 * 监听并阻止 Quill 粘贴图片的默认行为（插入 base64），改为执行自定义回调
 * @param quillRef ReactQuill 的 ref
 * @param onPasteImage 处理粘贴图片的回调
 */
export function useQuillPasteImageBlock(
	quillRef: RefObject<ReactQuill | null>,
	onPasteImage: (file: FileList, quill: any) => void,
) {
	useEffect(() => {
		if (!quillRef?.current) return;

		const quill = quillRef.current.getEditor();
		const root = quill.root;

		const handlePasteCapture = (e: ClipboardEvent) => {
			if (!e.clipboardData) return;

			const items = e.clipboardData.files;
			if (items.length > 0) {
				e.preventDefault();
				e.stopImmediatePropagation();
				onPasteImage(items, quill);
			}
		};
		root.addEventListener("paste", handlePasteCapture, true);

		return () => {
			root.removeEventListener("paste", handlePasteCapture, true);
		};
	}, [quillRef, onPasteImage]);
}
