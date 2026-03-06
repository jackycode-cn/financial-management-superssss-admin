/* eslint-disable import/order */
import useLocale from "@/locales/use-locale";
import "@/utils/highlight";
import QuillTableBetter from "quill-table-better";
import "quill-table-better/dist/quill-table-better.css";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import { exportPdf } from "./exportPDF";
import { useHandlePlaceHolder } from "./handlePlaceHolder";
import { imageHandler, uploadAndInsertImage } from "./image-upload-handle";
import { StyledEditor } from "./styles";
import Toolbar from "./toolbar";
import { useQuillPasteImageBlock } from "./useQuillPasteImageBlock";

export interface EditorRef {
	setContent: (html: string) => void;
	getContent: () => string;
	getText: () => string;
}

interface Props extends ReactQuill.ReactQuillProps {
	sample?: boolean;
}

Quill.register(
	{
		"modules/table-better": QuillTableBetter,
	},
	true,
);

const Editor = forwardRef<EditorRef, Props>(
	({ id = "slash-quill", sample = false, placeholder = "請輸入內容", ...other }, ref) => {
		const quillRef = useRef<ReactQuill>(null);
		const { locale } = useLocale();

		useImperativeHandle(ref, () => ({
			setContent: (html: string) => {
				const quill = quillRef.current?.getEditor();
				if (!quill) return;
				// 使用 clipboard.convert 将 HTML 转为 Delta
				const delta = quill.clipboard.convert({ html });
				// 使用 updateContents 替代 setContents
				quill.updateContents(delta, Quill.sources.API);
			},
			getContent: () => {
				return quillRef.current?.getEditor().root.innerHTML || "";
			},
			getText: () => {
				return quillRef.current?.getEditor().root.textContent || "";
			},
		}));

		const modules: ReactQuill.QuillOptions["modules"] = useMemo(() => {
			return {
				toolbar: {
					container: `#${id}`,
					handlers: {
						pdf: () => {
							const htmlEle = quillRef.current?.getEditingArea();
							if (!htmlEle) return;
							exportPdf(htmlEle).then((pdf) => pdf.save());
						},
						image: () => {
							if (quillRef.current) {
								imageHandler(quillRef.current.getEditor());
							}
						},
					},
				},
				table: false,
				"table-better": {
					language: locale === "zh_HK" ? "zh_TW" : locale,
					menus: ["column", "row", "merge", "table", "cell", "wrap", "copy", "delete"],
					toolbarTable: true,
				},
				history: {
					delay: 500,
					maxStack: 100,
					userOnly: true,
				},
				syntax: true,
				clipboard: {
					matchVisual: true,
				},
				keyboard: {
					bindings: QuillTableBetter.keyboardBindings,
				},
			};
		}, [id, locale]);

		useEffect(() => {
			const toolbarElement = document.getElementById(id);
			if (toolbarElement) {
				const handleToolbarClick = () => {
					quillRef.current?.focus();
				};
				toolbarElement.addEventListener("click", handleToolbarClick);
				return () => {
					toolbarElement.removeEventListener("click", handleToolbarClick);
				};
			}
		}, [id]);

		useQuillPasteImageBlock(quillRef, async (files, quill) => {
			for (const file of files) {
				await uploadAndInsertImage(quill, file, 2);
			}
		});

		useHandlePlaceHolder(quillRef, placeholder);

		return (
			<StyledEditor>
				<Toolbar id={id} isSimple={sample} />
				<ReactQuill ref={quillRef} modules={modules} {...other} />
			</StyledEditor>
		);
	},
);

Editor.displayName = "Editor";
export default Editor;
