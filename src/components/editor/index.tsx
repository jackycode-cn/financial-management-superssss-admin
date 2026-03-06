/* eslint-disable import/order */
import "@/utils/highlight";
import ReactQuill, { Quill } from "react-quill-new";

import useLocale from "@/locales/use-locale";
import QuillTableBetter from "quill-table-better";
import "quill-table-better/dist/quill-table-better.css";
import { useEffect, useMemo, useRef } from "react";
import { exportPdf } from "./exportPDF";
import { useHandlePlaceHolder } from "./handlePlaceHolder";
import { imageHandler, uploadAndInsertImage } from "./image-upload-handle";
import { StyledEditor } from "./styles";
import Toolbar from "./toolbar";
import { useQuillPasteImageBlock } from "./useQuillPasteImageBlock";

interface Props extends ReactQuill.ReactQuillProps {
	sample?: boolean;
}

Quill.register(
	{
		"modules/table-better": QuillTableBetter,
	},
	true,
);

export default function Editor({ id = "slash-quill", sample = false, placeholder = "請輸入內容", ...other }: Props) {
	const quillRef = useRef<ReactQuill>(null);
	const { locale } = useLocale();
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
					table: () => {
						if (quillRef.current) {
							const editor = quillRef.current.getEditor();
							if (!editor.getModule("table-better")) return;
							const table: QuillTableBetter = editor.getModule("table-better") as QuillTableBetter;
							table.insertTable(3, 3);
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
}
