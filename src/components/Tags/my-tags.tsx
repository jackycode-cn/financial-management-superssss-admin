import type { InputRef } from "antd";
import { Input, Tag, theme } from "antd";
import { PlusSquareIcon } from "lucide-react";
import { TweenOneGroup } from "rc-tween-one";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export interface TagProps {
	tags?: string[];
	onChange?: (tags: string[]) => void;
	maxTags?: number;
}

const TAG_COLORS = ["yellow", "green", "blue"];

const MyTags: React.FC<TagProps> = ({ tags: externalTags = [], onChange, maxTags = 3 }) => {
	const { token } = theme.useToken();
	const [inputVisible, setInputVisible] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const inputRef = useRef<InputRef>(null);

	useEffect(() => {
		if (inputVisible) inputRef.current?.focus();
	}, [inputVisible]);

	const handleClose = useCallback(
		(removedTag: string) => {
			onChange?.(externalTags.filter((tag) => tag !== removedTag));
		},
		[externalTags, onChange],
	);

	const showInput = useCallback(() => {
		if (externalTags.length >= maxTags) {
			toast.error(`最多只能添加 ${maxTags} 個標籤`);
			return;
		}
		setInputVisible(true);
	}, [externalTags.length, maxTags]);

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	}, []);

	const handleInputConfirm = useCallback(() => {
		const value = inputValue.trim();
		if (value && !externalTags.includes(value)) {
			onChange?.([...externalTags, value]);
		}
		setInputVisible(false);
		setInputValue("");
	}, [inputValue, externalTags, onChange]);

	const tagChild = useMemo(
		() =>
			externalTags.map((tag, index) => {
				const color = TAG_COLORS[index % TAG_COLORS.length];
				return (
					<Tag
						key={tag}
						closable
						color={color}
						onClose={(e) => {
							e.preventDefault();
							handleClose(tag);
						}}
					>
						{tag}
					</Tag>
				);
			}),
		[externalTags, handleClose],
	);

	const tagPlusStyle: React.CSSProperties = {
		background: token.colorBgContainer,
		borderStyle: "dashed",
		cursor: "pointer",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	};

	return (
		<div className="flex align-center">
			<TweenOneGroup
				appear={false}
				enter={{ scale: 0.8, opacity: 0, type: "from", duration: 100 }}
				leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
				onEnd={(e) => {
					if (e.type === "appear" || e.type === "enter") {
						(e.target as any).style = "display: inline-block";
					}
				}}
			>
				{tagChild}
			</TweenOneGroup>

			{inputVisible ? (
				<Input
					ref={inputRef}
					size="small"
					style={{ width: 120, height: 28 }}
					value={inputValue}
					onChange={handleInputChange}
					onBlur={handleInputConfirm}
					onPressEnter={handleInputConfirm}
					placeholder="輸入標籤"
				/>
			) : (
				<Tag onClick={showInput} style={tagPlusStyle} icon={<PlusSquareIcon size={14} color="blue" />}>
					新標籤
				</Tag>
			)}
		</div>
	);
};

export default MyTags;
