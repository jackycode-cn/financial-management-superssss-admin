import type { RefObject } from "react";
import { useEffect } from "react";
import type ReactQuill from "react-quill-new";

export function useHandlePlaceHolder(quillRef: RefObject<ReactQuill | null>, placeholder: string) {
	useEffect(() => {
		const editor = quillRef.current?.getEditor();
		if (!editor) return;

		// 初始化 placeholder
		editor.root.dataset.placeholder = placeholder;

		const handleCompositionStart = () => {
			// 中文拼音输入阶段清空 placeholder
			editor.root.dataset.placeholder = "";
		};

		const handleCompositionEnd = () => {
			// 拼音输入结束，恢复 placeholder（如果内容为空）
			if (!editor.getText().trim()) {
				editor.root.dataset.placeholder = placeholder;
			}
		};

		editor.root.addEventListener("compositionstart", handleCompositionStart);
		editor.root.addEventListener("compositionend", handleCompositionEnd);

		return () => {
			editor.root.removeEventListener("compositionstart", handleCompositionStart);
			editor.root.removeEventListener("compositionend", handleCompositionEnd);
		};
	}, [quillRef, placeholder]);
}
