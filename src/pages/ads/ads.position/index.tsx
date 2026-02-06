import { Button, Card, Form, Modal, Space, Table, Typography, message } from "antd";
import { useCallback, useEffect, useState } from "react";

import {
	reqAdpositionscreate,
	reqAdpositionsfindall,
	reqAdpositionsremove,
	reqAdpositionsupdate,
} from "@/api/services/Advertisingspacemanagement";

import type {
	AdPosition,
	AdPositionResponseDto,
	CreateAdPositionDto,
	PaginationAdPositionResponseDto,
	Reqadpositionsfindallquery,
	UpdateAdPositionDto,
} from "#/api";
import { assertFieldsExist } from "@/utils/assertFieldsExist";
import { LucidePlus } from "lucide-react";

import AdPositionForm from "./components/FormComponent";
import SearchForm from "./components/SearchForm";
import { getAdPositionTableColumns } from "./components/TableColumns";

const { Title } = Typography;

const AdPositionManagement = () => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<AdPositionResponseDto[]>([]);
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 10,
		total: 0,
	});
	const [form] = Form.useForm();
	const [modalVisible, setModalVisible] = useState(false);
	const [editingRecord, setEditingRecord] = useState<AdPosition | null>(null);
	const [searchForm] = Form.useForm();

	// 加載數據
	const loadData = useCallback(
		async (params: Partial<Reqadpositionsfindallquery> = {}) => {
			setLoading(true);
			try {
				const queryParams: Partial<Reqadpositionsfindallquery> = {
					page: pagination.current,
					pageSize: pagination.pageSize,
					...params,
				};
				assertFieldsExist(queryParams, ["page", "pageSize"]);
				const response: PaginationAdPositionResponseDto = await reqAdpositionsfindall(queryParams);
				setData(response.items || []);
				setPagination((prev) => ({
					...prev,
					total: response.pagination?.total || 0,
				}));
			} catch (error) {
				console.error("Failed to fetch ad positions:", error);
				message.error("獲取廣告位置列表失敗");
			} finally {
				setLoading(false);
			}
		},
		[pagination.current, pagination.pageSize],
	);

	useEffect(() => {
		loadData({
			page: pagination.current,
			pageSize: pagination.pageSize,
		});
	}, [loadData, pagination.current, pagination.pageSize]);

	// 表格列配置
	const columns = getAdPositionTableColumns({
		handleEdit: (record: AdPositionResponseDto) => {
			setEditingRecord(record as AdPosition);
			setModalVisible(true);
			// 確保在模態框打開後設置表單值
			setTimeout(() => {
				form.setFieldsValue({
					...record,
				});
			}, 0);
		},
		handleDelete: (id?: string) => {
			if (!id) {
				message.error("廣告位置缺失");
				return;
			}
			handleDelete(id);
		},
	});

	// 處理刪除
	const handleDelete = async (id?: string) => {
		if (!id) {
			message.error("廣告位置缺失");
			return;
		}
		try {
			await reqAdpositionsremove(id);
			message.success("刪除成功");
			loadData();
		} catch (error) {
			console.error("Failed to delete ad position:", error);
			message.error("刪除失敗");
		}
	};

	// 處理提交
	const handleSubmit = async (values: CreateAdPositionDto | UpdateAdPositionDto) => {
		try {
			// 轉換數值類型
			const processedValues = {
				...values,
				width: values.width ? Number(values.width) : 0,
				height: values.height ? Number(values.height) : 0,
				maxAds: values.maxAds ? Number(values.maxAds) : 1,
			};

			if (editingRecord) {
				if (!editingRecord.id) {
					message.error("廣告位置");
					return;
				}
				// 更新廣告位置
				await reqAdpositionsupdate(editingRecord.id, processedValues as UpdateAdPositionDto);
				message.success("更新成功");
			} else {
				// 創建廣告位置
				await reqAdpositionscreate(processedValues as CreateAdPositionDto);
				message.success("創建成功");
			}

			setModalVisible(false);
			setEditingRecord(null);
			form.resetFields();
			loadData();
		} catch (error) {
			console.error("Failed to save ad position:", error);
			message.error("保存失敗");
		}
	};

	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			<Card
				title={
					<Title level={4} className="mb-0">
						廣告位置管理
					</Title>
				}
				extra={
					<Space>
						<Button
							type="primary"
							icon={<LucidePlus />}
							onClick={() => {
								setEditingRecord(null);
								setModalVisible(true);
							}}
						>
							添加位置
						</Button>
					</Space>
				}
			>
				{/* 搜索區域 */}
				<Card className="mb-4">
					<SearchForm
						form={searchForm}
						onSearch={(values) => {
							loadData(values);
						}}
						onReset={() => {
							searchForm.resetFields();
							loadData({});
						}}
					/>
				</Card>

				{/* 數據表格 */}
				<Table
					columns={columns}
					dataSource={data}
					rowKey="id"
					loading={loading}
					pagination={{
						current: pagination.current,
						pageSize: pagination.pageSize,
						total: pagination.total,
						onChange: (page, pageSize) => {
							setPagination({ ...pagination, current: page, pageSize });
						},
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total) => `共 ${total} 條`,
					}}
					scroll={{ x: 1200 }}
				/>

				{/* 編輯/添加模態框 */}
				<Modal
					title={editingRecord ? "編輯廣告位置" : "添加廣告位置"}
					open={modalVisible}
					onCancel={() => {
						setModalVisible(false);
						setEditingRecord(null);
						form.resetFields();
					}}
					afterOpenChange={(open) => {
						if (open && editingRecord) {
							// 模態框打開後設置表單值
							form.setFieldsValue({
								...editingRecord,
							});
						}
					}}
					footer={null}
					width={600}
				>
					<AdPositionForm
						form={form}
						editingRecord={editingRecord}
						onSubmit={handleSubmit}
						onCancel={() => {
							setModalVisible(false);
							setEditingRecord(null);
							form.resetFields();
						}}
						isEditing={!!editingRecord}
					/>
				</Modal>
			</Card>
		</div>
	);
};

export default AdPositionManagement;
