import type { AdPositionResponseDto, Advertisement } from "#/api";
import { Image, Space, Tag, Typography } from "antd";
import type { ColumnType } from "antd/es/table";
import { LucideDelete, LucideEdit, LucideEye } from "lucide-react";

const { Text } = Typography;

interface TableColumnsProps {
	handleView: (record: Advertisement) => void;
	handleEdit: (record: Advertisement) => void;
	handleDelete: (id?: string) => void;
}

export const getTableColumns = ({
	handleView,
	handleEdit,
	handleDelete,
}: TableColumnsProps): ColumnType<Advertisement>[] => [
	{
		title: "ID",
		dataIndex: "id",
		key: "id",
		width: 120,
		ellipsis: true,
	},
	{
		title: "廣告標題",
		dataIndex: "title",
		key: "title",
		render: (text: string) => (
			<Text strong ellipsis={{ tooltip: text }}>
				{text}
			</Text>
		),
	},
	{
		title: "封面圖片",
		dataIndex: "coverImage",
		key: "coverImage",
		width: 100,
		render: (image: string) =>
			image ? (
				<Image
					src={image}
					width={60}
					height={40}
					style={{ objectFit: "cover", borderRadius: 4 }}
					fallback="/images/default-image.png"
				/>
			) : (
				<div className="bg-gray-100 border-2 border-dashed rounded-xl w-12 h-10 flex items-center justify-center">
					<span className="text-xs text-gray-400">無圖</span>
				</div>
			),
	},
	{
		title: "簡短描述",
		dataIndex: "shortDesc",
		key: "shortDesc",
		ellipsis: true,
		render: (text: string) => (
			<Text ellipsis={{ tooltip: text }} style={{ maxWidth: 200 }}>
				{text}
			</Text>
		),
	},
	/**
	 * 廣告位信息
	 */
	{
		title: "廣告位",
		dataIndex: "adPosition",
		key: "adPosition",
		ellipsis: true,
		render: (adPosition: AdPositionResponseDto | null) => {
			const width = adPosition?.width;
			const height = adPosition?.height;
			const size = `${width}px x ${height}px`;
			const text = `	${adPosition?.name || "-"} [${size}]`;
			return (
				<Text ellipsis={{ tooltip: text }} style={{ maxWidth: 120 }}>
					{text}
				</Text>
			);
		},
	},
	{
		title: "優先級",
		dataIndex: "priority",
		key: "priority",
		sorter: (a: Advertisement, b: Advertisement) => (a.priority || 0) - (b.priority || 0),
		render: (priority: number) => <Tag color={priority && priority > 5 ? "geekblue" : "default"}>{priority || 0}</Tag>,
	},
	{
		title: "狀態",
		dataIndex: "status",
		key: "status",
		render: (status: any) => {
			let color = "default";
			let text = "未知";

			if (status === "ENABLED") {
				color = "green";
				text = "啟用";
			} else if (status === "DISABLED") {
				color = "red";
				text = "禁用";
			} else if (status === "DRAFT") {
				color = "orange";
				text = "草稿";
			} else if (status === "EXPIRED") {
				color = "gray";
				text = "過期";
			}

			return <Tag color={color}>{text}</Tag>;
		},
	},
	{
		title: "時間範圍",
		key: "timeRange",
		render: (_: any, record: Advertisement) => (
			<div>
				<div>{record.startTime ? new Date(record.startTime).toLocaleDateString() : "-"}</div>
				<div className="text-gray-400 text-xs">
					{record.endTime ? new Date(record.endTime).toLocaleDateString() : "-"}
				</div>
			</div>
		),
	},
	{
		title: "統計",
		key: "stats",
		render: (_: any, record: Advertisement) => (
			<Space size="small">
				<Tag color="blue">點擊: {record.clickCount || 0}</Tag>
				<Tag color="cyan">瀏覽: {record.viewCount || 0}</Tag>
				<Tag color="purple">點擊率: {(record.clickRate || 0).toFixed(2)}%</Tag>
			</Space>
		),
	},
	{
		title: "操作",
		key: "actions",
		fixed: "right" as const,
		width: 160,
		render: (_: any, record: Advertisement) => (
			<Space>
				<button type="button" className="text-blue-600 hover:text-blue-800 p-1" onClick={() => handleView(record)}>
					<LucideEye size={16} />
				</button>
				<button type="button" className="text-blue-600 hover:text-blue-800 p-1" onClick={() => handleEdit(record)}>
					<LucideEdit size={16} />
				</button>
				<button type="button" className="text-red-600 hover:text-red-800 p-1" onClick={() => handleDelete(record.id)}>
					<LucideDelete size={16} />
				</button>
			</Space>
		),
	},
];
