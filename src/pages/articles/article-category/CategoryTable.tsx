import type { CategoryResponseDto } from "@/types";
import type { Category } from "@/types/normal";
import { Button, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { formatDate } from "date-fns";
import { DeleteIcon, EditIcon } from "lucide-react";

interface CategoryTableProps {
	dataSource: CategoryResponseDto[];
	loading: boolean;
	onEdit: (record: CategoryResponseDto) => void;
	onDelete: (id: number) => void;
	categoryOptions: Category[];
	isMobile?: boolean;
}

const CategoryTable = ({ dataSource, loading, onEdit, onDelete, categoryOptions, isMobile }: CategoryTableProps) => {
	const columns: ColumnsType<CategoryResponseDto> = [
		{
			title: "分類名稱",
			dataIndex: "name",
			key: "name",
			ellipsis: true,
		},
		{
			title: "父級分類ID",
			dataIndex: "parent_id",
			key: "parent_id",
			align: "center",
			render: (parentId: number | null) => {
				if (!parentId) return "-";
				return categoryOptions.find((item) => item.value === parentId)?.label || "-";
			},
		},
		{
			title: "層級",
			dataIndex: "level",
			key: "level",
			render: (level: number) => <Tag color={level === 1 ? "green" : level === 2 ? "blue" : "orange"}>{level}級</Tag>,
		},
		{
			title: "路徑",
			dataIndex: "slug",
			key: "slug",
			ellipsis: true,
			render: (slug: string | null) => slug || "-",
		},
		{
			title: "創建時間",
			dataIndex: "created_at",
			key: "created_at",
			sorter: true,
			render: (createdAt: string) => (createdAt ? formatDate(new Date(createdAt), "yyyy-MM-dd HH:mm:ss") : "-"),
		},
		{
			title: "更新時間",
			dataIndex: "updated_at",
			key: "updated_at",
			sorter: true,
			render: (updatedAt: string) => (updatedAt ? formatDate(new Date(updatedAt), "yyyy-MM-dd HH:mm:ss") : "-"),
		},
		{
			title: "操作",
			key: "action",
			fixed: isMobile ? undefined : "right",
			render: (_: any, record: CategoryResponseDto) => (
				<Space size={isMobile ? 0 : "small"} direction={isMobile ? "vertical" : "horizontal"}>
					<Button type="primary" size="small" icon={<EditIcon size={16} />} onClick={() => onEdit(record)}>
						編輯
					</Button>
					<Button danger size="small" icon={<DeleteIcon size={16} />} onClick={() => onDelete(record.id)}>
						刪除
					</Button>
				</Space>
			),
		},
	];

	return (
		<Table
			columns={columns}
			dataSource={dataSource.map((item) => ({ ...item, key: item.id }))}
			loading={loading}
			pagination={{ pageSize: 10 }}
			scroll={{ x: "max-content" }}
			rowKey="id"
			size={isMobile ? "small" : "middle"}
		/>
	);
};

export default CategoryTable;
