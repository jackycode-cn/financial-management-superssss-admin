import type { AdPositionResponseDto } from "#/api";
import { Space, Tag, Typography } from "antd";
import type { ColumnType } from "antd/es/table";
import { LucideDelete, LucideEdit } from "lucide-react";

const { Text } = Typography;

interface TableColumnsProps {
	handleEdit: (record: AdPositionResponseDto) => void;
	handleDelete: (id?: string) => void;
}

export const getAdPositionTableColumns = ({
	handleEdit,
	handleDelete,
}: TableColumnsProps): ColumnType<AdPositionResponseDto>[] => [
	{
		title: "ID",
		dataIndex: "id",
		key: "id",
		width: 120,
		ellipsis: true,
	},
	{
		title: "名稱",
		dataIndex: "name",
		key: "name",
		render: (text: string) => (
			<Text strong ellipsis={{ tooltip: text }}>
				{text}
			</Text>
		),
	},
	{
		title: "編碼",
		dataIndex: "code",
		key: "code",
		render: (code: string) => <Tag color="blue">{code}</Tag>,
	},
	{
		title: "描述",
		dataIndex: "description",
		key: "description",
		render: (desc: string | undefined) => desc || "-",
	},
	{
		title: "尺寸",
		key: "size",
		render: (_: any, record: AdPositionResponseDto) => (
			<span>
				{record.width || 0}px × {record.height || 0}px
			</span>
		),
	},
	{
		title: "類型",
		dataIndex: "type",
		key: "type",
		render: (type: string) => {
			const typeMap: Record<string, string> = {
				BANNER: "橫幅",
				POPUP: "彈窗",
				SIDEBAR: "側邊欄",
				FEED: "信息流",
				SPLASH: "啟動頁",
				INTERSTITIAL: "插屏",
			};

			const typeColor: Record<string, string> = {
				BANNER: "blue",
				POPUP: "gold",
				SIDEBAR: "green",
				FEED: "volcano",
				SPLASH: "purple",
				INTERSTITIAL: "magenta",
			};

			return <Tag color={typeColor[type] || "default"}>{typeMap[type] || type}</Tag>;
		},
	},
	{
		title: "最大廣告數",
		dataIndex: "maxAds",
		key: "maxAds",
		render: (max: number) => max || 0,
	},
	{
		title: "狀態",
		dataIndex: "status",
		key: "status",
		render: (status: boolean) => <Tag color={status ? "green" : "red"}>{status ? "啟用" : "禁用"}</Tag>,
	},
	{
		title: "創建時間",
		dataIndex: "createdAt",
		key: "createdAt",
		render: (date: string) => (date ? new Date(date).toLocaleString() : "-"),
	},
	{
		title: "操作",
		key: "actions",
		fixed: "right" as const,
		width: 140,
		render: (_: any, record: AdPositionResponseDto) => (
			<Space>
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
