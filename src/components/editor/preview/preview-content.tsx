import { memo } from "react";
import { StyledEditor } from "../styles";
import styles from "./ArticleContent.module.css";

function PreviewContent({ content, width }: { content: string; width?: number }) {
	if (!content?.trim()) return null;

	return (
		<StyledEditor
			style={{ width: width ? `${width}px` : "100%" }}
			className={`ql-container ${styles.articleContainer}`}
		>
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: 内容已由后台过滤，安全渲染 */}
			<div className="ql-editor" dangerouslySetInnerHTML={{ __html: content }} />
		</StyledEditor>
	);
}

export default memo(PreviewContent);
