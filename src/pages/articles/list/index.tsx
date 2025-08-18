import { useState } from "react";

export interface indexProps {
	/** 示例：组件标题 */
	title?: string;
}

function Index({ title }: indexProps) {
	const [count, setCount] = useState(0);

	return (
		<div className="index-container">
			<h2>{title ?? "文章列表"}</h2>
			<p>当前计数：{count}</p>
			<button type="button" onClick={() => setCount((prev) => prev + 1)}>
				+1
			</button>
		</div>
	);
}

export default Index;
