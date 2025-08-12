/* eslint-disable import/order */
import "@/utils/highlight";

import ReactQuill from "react-quill-new";

import { useEffect, useRef } from "react";
import { StyledEditor } from "./styles";
import Toolbar, { formats } from "./toolbar";

// TODO: repace react-quill with tiptap
interface Props extends ReactQuill.ReactQuillProps {
	sample?: boolean;
}
export default function Editor({ id = "slash-quill", sample = false, ...other }: Props) {
	const quillRef = useRef<ReactQuill>(null);
	const modules: ReactQuill.QuillOptions["modules"] = {
		toolbar: {
			container: `#${id}`,
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
	return (
		<StyledEditor>
			<Toolbar id={id} isSimple={sample} />
			<ReactQuill ref={quillRef} modules={modules} formats={formats} {...other} />
		</StyledEditor>
	);
}
