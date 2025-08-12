import type React from "react";
import { useState } from "react";
import { hoverStyles, tooltipStyles } from "./styles";

// @ts-expect-error 预期的错误
export interface TooltipButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/** 按钮类型，对应编辑器的ql-*类名 */
	type: string;
	/** 悬浮提示文本 */
	dataTitle: string;
	/** 提示框位置，默认top */
	placement?: "top" | "bottom" | "left" | "right";
}

const TooltipButton: React.FC<TooltipButtonProps> = ({
	type,
	dataTitle,
	placement = "top",
	children,
	className = "",
	...restProps
}) => {
	const [isHovered, setIsHovered] = useState(false);

	// 根据位置获取对应的样式
	const getPositionStyles = () => {
		switch (placement) {
			case "bottom":
				return tooltipStyles.bottom;
			case "left":
				return tooltipStyles.left;
			case "right":
				return tooltipStyles.right;
			default:
				return tooltipStyles.top;
		}
	};

	// 根据位置获取对应的箭头样式
	const getArrowStyles = () => {
		switch (placement) {
			case "bottom":
				return tooltipStyles.bottomArrow;
			case "left":
				return tooltipStyles.leftArrow;
			case "right":
				return tooltipStyles.rightArrow;
			default:
				return tooltipStyles.topArrow;
		}
	};

	return (
		<button
			type="button"
			className={`${type} ${className}`}
			data-title={dataTitle}
			{...restProps}
			style={tooltipStyles.container}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{children}
			<span
				style={{ ...tooltipStyles.content, ...getPositionStyles(), ...(isHovered ? hoverStyles : {}) }}
				role="tooltip"
			>
				{dataTitle}
				<span style={{ ...tooltipStyles.arrow, ...getArrowStyles() }} />
			</span>
		</button>
	);
};

export default TooltipButton;
