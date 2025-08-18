import { Popconfirm, Tag, type PopconfirmProps } from "antd";
import type { FC } from "react";

interface StatusSwitchTagProps {
	status: boolean;
	onStatusChange: (newStatus: boolean) => void;
	confirmTitle?: string;
	trueText?: string;
	falseText?: string;
	trueColor?: string;
	falseColor?: string;
	popconfirmProps?: Omit<PopconfirmProps, "title" | "onConfirm">;
}

const StatusSwitchTag: FC<StatusSwitchTagProps> = ({
	status,
	onStatusChange,
	confirmTitle,
	trueText,
	falseText,
	trueColor = "green",
	falseColor = "orange",
	popconfirmProps = {},
}) => {
	return (
		<Popconfirm title={confirmTitle} onConfirm={() => onStatusChange(!status)} {...popconfirmProps}>
			<Tag color={status ? trueColor : falseColor}>{status ? trueText : falseText}</Tag>
		</Popconfirm>
	);
};

export default StatusSwitchTag;
