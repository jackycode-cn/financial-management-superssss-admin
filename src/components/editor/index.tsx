/* eslint-disable import/order */
import "@/utils/highlight";
import ReactQuill from "react-quill-new";

import { useEffect, useMemo, useRef } from "react";
import { exportPdf } from "./exportPDF";
import { useHandlePlaceHolder } from "./handlePlaceHolder";
import { imageHandler, uploadAndInsertImage } from "./image-upload-handle";
import { StyledEditor } from "./styles";
import Toolbar, { formats } from "./toolbar";
import { useQuillPasteImageBlock } from "./useQuillPasteImageBlock";

// TODO: repace react-quill with tiptap
interface Props extends ReactQuill.ReactQuillProps {
	sample?: boolean;
}
export default function Editor({ id = "slash-quill", sample = false, placeholder = "請輸入內容", ...other }: Props) {
	const quillRef = useRef<ReactQuill>(null);
	const modules: ReactQuill.QuillOptions["modules"] = useMemo(() => {
		return {
			toolbar: {
				container: `#${id}`,
				handlers: {
					pdf: () => {
						const htmlEle = quillRef.current?.getEditingArea();
						if (!htmlEle) {
							return;
						}
						exportPdf(htmlEle).then((pdf) => {
							pdf.save();
						});
					},
					image: () => {
						if (quillRef.current) {
							imageHandler(quillRef.current.getEditor());
						}
					},
				},
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
		};
	}, [id]);

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
			<ReactQuill ref={quillRef} modules={modules} formats={formats} {...other} />
		</StyledEditor>
	);
}
