import type { ArticleEntity, ArticlesEntities, Reqarticlefindallquery } from "#/api";
import { reqArticlefindall, reqArticleremove, reqArticleupdate } from "@/api/services";
import StatusSwitchTag from "@/components/Tags/status-tag";
import StatusFilterSelect from "@/components/select/StatusFilterSelect";
import { useRouter } from "@/routes/hooks";
import { Button } from "@/ui/button";
import { Input, Popconfirm, Space, Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { formatDate } from "date-fns";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type StatusMapFilterType = "is_archive" | "is_published" | "is_featured" | "is_hot" | "is_top";
type StatusMapFilter = {
	[K in StatusMapFilterType]?: boolean;
};

const ArticleList: React.FC = () => {
	const router = useRouter();
	const [articles, setArticles] = useState<ArticleEntity[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [pagination, setPagination] = useState<TablePaginationConfig>({
		current: 1,
		pageSize: 8,
		total: 0,
	});
	const [searchText, setSearchText] = useState("");
	const [statusMapFilter, setStatusMapFilter] = useState<StatusMapFilter>({
		is_archive: undefined,
		is_published: undefined,
		is_featured: undefined,
		is_hot: undefined,
		is_top: undefined,
	});

	const handleChangeStatusMapFilter = (name: StatusMapFilterType, value: boolean | undefined) => {
		setStatusMapFilter((prev) => ({ ...prev, [name]: value }));
	};

	const fetchArticles = useCallback(
		async (paramsInfo?: Partial<Reqarticlefindallquery>) => {
			setLoading(true);
			try {
				const params: Reqarticlefindallquery = {
					page: pagination.current || 1,
					pageSize: pagination.pageSize || 8,
					...statusMapFilter,
					...paramsInfo,
				};
				const response: ArticlesEntities = await reqArticlefindall(params);
				setArticles(response.items || []);
				setPagination((prev) => ({ ...prev, total: response.pagination?.total || 0 }));
				toast.success("文章清單載入成功", {
					position: "top-center",
				});
			} catch (error) {
				toast.error("文章清單載入失敗", {
					position: "top-center",
				});
				console.error("Failed to fetch articles:", error);
			} finally {
				setLoading(false);
			}
		},
		[pagination.current, pagination.pageSize, statusMapFilter],
	);

	useEffect(() => {
		fetchArticles();
	}, [fetchArticles]);

	const handleSearch = () => {
		setPagination((prev) => ({ ...prev, current: 1 }));
		fetchArticles(searchText !== "" ? { title: searchText } : {});
	};

	const handleDelete = async (record: ArticleEntity) => {
		try {
			if (!record.public_id) {
				toast.error("文章 ID 不存在");
				return;
			}
			await reqArticleremove(record.public_id);
			toast.success("文章刪除成功");
			fetchArticles();
		} catch (error) {
			toast.error("文章刪除失敗");
			console.error("Failed to delete article:", error);
		}
	};

	/** 切換狀態 */
	const handleChangeStatus = async (record: ArticleEntity, name: StatusMapFilterType, value: boolean) => {
		try {
			if (!record.public_id) {
				toast.error("文章 ID 不存在");
				return;
			}
			await reqArticleupdate(record.public_id, { [name]: value });
			toast.success("文章狀態更新成功");
			fetchArticles();
		} catch (error) {
			toast.error("文章狀態更新失敗");
			console.error("Failed to update article status:", error);
		}
	};

	const handleEdit = (record: ArticleEntity) => {
		router.push(`/articles/edit/${record.public_id}?title=${record.title}`);
	};

	const handleAdd = () => {
		router.push("/articles/create");
	};

	const columns: ColumnsType<ArticleEntity> = [
		{
			title: "標題",
			dataIndex: "title",
			key: "title",
			ellipsis: true,
		},
		{
			title: "發布狀態",
			dataIndex: "is_published",
			key: "status",
			render: (status: boolean, record: ArticleEntity) => (
				<StatusSwitchTag
					confirmTitle="是否切換發布狀態？"
					trueText="已發布"
					falseText="草稿"
					status={status}
					onStatusChange={(newStatus) => handleChangeStatus(record, "is_published", newStatus)}
				/>
			),
		},
		{
			title: "熱門狀態",
			dataIndex: "is_hot",
			key: "is_hot",
			render: (status: boolean, record: ArticleEntity) => (
				<StatusSwitchTag
					confirmTitle="是否切換熱門狀態？"
					trueText="熱門"
					falseText="普通"
					status={status}
					onStatusChange={(newStatus) => handleChangeStatus(record, "is_hot", newStatus)}
				/>
			),
		},
		{
			title: "置頂狀態",
			dataIndex: "is_top",
			key: "is_top",
			render: (status: boolean, record: ArticleEntity) => (
				<StatusSwitchTag
					confirmTitle="是否切換置頂狀態？"
					trueText="置頂"
					falseText="未置頂"
					status={status}
					onStatusChange={(newStatus) => handleChangeStatus(record, "is_top", newStatus)}
				/>
			),
		},
		{
			title: "特殊狀態",
			dataIndex: "is_featured",
			key: "is_featured",
			render: (status: boolean, record: ArticleEntity) => (
				<StatusSwitchTag
					confirmTitle="是否切換特殊狀態？"
					trueText="特殊"
					falseText="普通"
					status={status}
					onStatusChange={(newStatus) => handleChangeStatus(record, "is_featured", newStatus)}
				/>
			),
		},

		{
			title: "建立時間",
			dataIndex: "created_at",
			key: "createdAt",
			render: (createdAt: string) => formatDate(new Date(createdAt), "yyyy-MM-dd HH:mm:ss"),
		},
		{
			title: "更新時間",
			dataIndex: "updated_at",
			key: "updatedAt",
			align: "center",
			render: (updatedAt?: string) => (updatedAt ? formatDate(new Date(updatedAt), "yyyy-MM-dd HH:mm:ss") : "-"),
		},
		/** 發布時間 */
		{
			title: "發布時間",
			dataIndex: "published_at",
			key: "publishedAt",
			align: "center",
			render: (publishedAt?: string) => (publishedAt ? formatDate(new Date(publishedAt), "yyyy-MM-dd HH:mm:ss") : "-"),
		},
		{
			title: "分類",
			dataIndex: "category",
			key: "category",
			render: (_: string, record: ArticleEntity) => <Tag>{record.article_categories?.name || "-"}</Tag>,
		},
		{
			title: "操作",
			key: "action",
			width: 120,
			fixed: "right" as const,
			render: (_: any, record: ArticleEntity) => (
				<Space size="middle">
					<Button variant="link" onClick={() => handleEdit(record)} className="cursor-pointer">
						編輯
					</Button>
					<Popconfirm title="確認刪除嗎？" onConfirm={() => handleDelete(record)}>
						<Button variant="destructive" color="danger" className="cursor-pointer">
							刪除
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div className="article-list-container">
			<div className="article-list-header flex flex-col md:flex-row md:justify-between gap-2 mb-2">
				{/* 篩選項目 */}
				<Space wrap className="flex-1">
					<StatusFilterSelect
						label="發布狀態"
						value={statusMapFilter.is_published}
						trueLabel="已發布"
						falseLabel="草稿"
						onChange={(v) => handleChangeStatusMapFilter("is_published", v)}
					/>
					<StatusFilterSelect
						label="熱門狀態"
						value={statusMapFilter.is_hot}
						trueLabel="熱門"
						falseLabel="普通"
						onChange={(v) => handleChangeStatusMapFilter("is_hot", v)}
					/>
					<StatusFilterSelect
						label="置頂狀態"
						value={statusMapFilter.is_top}
						trueLabel="置頂"
						falseLabel="未置頂"
						onChange={(v) => handleChangeStatusMapFilter("is_top", v)}
					/>
					<StatusFilterSelect
						label="特殊狀態"
						value={statusMapFilter.is_featured}
						trueLabel="特殊"
						falseLabel="普通"
						onChange={(v) => handleChangeStatusMapFilter("is_featured", v)}
					/>
				</Space>
				<Space wrap className="flex-1 md:justify-end">
					<Input
						placeholder="輸入文章標題搜尋"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						style={{ width: "100%", maxWidth: 200 }}
						allowClear
						onPressEnter={handleSearch}
					/>
					<Button type="button" onClick={handleSearch}>
						搜尋
					</Button>
					<Button type="button" onClick={handleAdd}>
						新增文章
					</Button>
				</Space>
			</div>

			<Table
				columns={columns}
				scroll={{ x: "max-content" }}
				dataSource={articles.map((article) => ({ ...article, key: article.id }))}
				loading={loading}
				pagination={pagination}
				onChange={(_pagination: TablePaginationConfig) => setPagination(_pagination)}
				rowKey="public_id"
			/>
		</div>
	);
};

export default ArticleList;
