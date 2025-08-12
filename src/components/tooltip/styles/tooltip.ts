import type { CSSProperties } from "react";

interface TooltipStyles {
	container: CSSProperties;
	content: CSSProperties;
	arrow: CSSProperties;
	top: CSSProperties;
	bottom: CSSProperties;
	left: CSSProperties;
	right: CSSProperties;
	topArrow: CSSProperties;
	bottomArrow: CSSProperties;
	leftArrow: CSSProperties;
	rightArrow: CSSProperties;
}

export const tooltipStyles: TooltipStyles = {
	// 容器样式
	container: {
		position: "relative",
		display: "inline-block",
	},

	// 提示内容样式
	content: {
		position: "absolute",
		padding: "4px 8px",
		backgroundColor: "#333",
		color: "white",
		fontSize: "12px",
		borderRadius: "4px",
		whiteSpace: "nowrap",
		opacity: 0,
		visibility: "hidden",
		transition: "opacity 0.2s, visibility 0.2s, transform 0.2s",
		pointerEvents: "none",
		zIndex: 1000,
		transform: "translateY(5px)",
	},

	// 箭头基础样式
	arrow: {
		position: "absolute",
		width: "6px",
		height: "6px",
		backgroundColor: "#333",
		transform: "rotate(45deg)",
	},

	// 顶部定位
	top: {
		bottom: "100%",
		left: "50%",
		transform: "translateX(-50%) translateY(5px)",
		marginBottom: "5px",
	},

	// 底部定位
	bottom: {
		top: "100%",
		left: "50%",
		transform: "translateX(-50%) translateY(-5px)",
		marginTop: "5px",
	},

	// 左侧定位
	left: {
		top: "50%",
		right: "100%",
		transform: "translateY(-50%) translateX(5px)",
		marginRight: "5px",
	},

	// 右侧定位
	right: {
		top: "50%",
		left: "100%",
		transform: "translateY(-50%) translateX(-5px)",
		marginLeft: "5px",
	},

	// 顶部箭头
	topArrow: {
		top: "100%",
		left: "50%",
		transform: "translateX(-50%) rotate(45deg)",
	},

	// 底部箭头
	bottomArrow: {
		bottom: "100%",
		left: "50%",
		transform: "translateX(-50%) rotate(45deg)",
	},

	// 左侧箭头
	leftArrow: {
		right: "100%",
		top: "50%",
		transform: "translateY(-50%) rotate(45deg)",
	},

	// 右侧箭头
	rightArrow: {
		left: "100%",
		top: "50%",
		transform: "translateY(-50%) rotate(45deg)",
	},
};

// 悬停状态样式 - 会动态应用到组件中
export const hoverStyles: CSSProperties = {
	opacity: 1,
	visibility: "visible",
	transform: "translateY(0)",
};
