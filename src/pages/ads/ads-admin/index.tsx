import {
	reqAdvertisementcreate,
	reqAdvertisementfindall,
	reqAdvertisementremove,
	reqAdvertisementupdate,
} from "@/api/services/advertise";
import { Button, Card, Form, Modal, Space, Table, Typography, message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";

import type {
	Advertisement,
	CreateAdvertisementDto,
	Reqadvertisementfindallquery,
	UpdateAdvertisementDto,
} from "#/api";
import { assertFieldsExist } from "@/utils/assertFieldsExist";
import { LucidePlus } from "lucide-react";
import { toast } from "sonner";
import AdvertisementForm from "./components/FormComponent";
import SearchForm from "./components/SearchForm";
import { getTableColumns } from "./components/TableColumns";

const { Title } = Typography;

function initFormValues() {
	return {
		startTime: undefined,
		endTime: undefined,
		shortDesc: undefined,
		title: undefined,
		coverImage: undefined,
		redirectUrl: undefined,
		priority: undefined,
		status: undefined,
		adPositionId: undefined,
	};
}
const AdvertisementManagement = () => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<Advertisement[]>([]);
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 10,
		total: 0,
	});
	const [form] = Form.useForm<Partial<UpdateAdvertisementDto>>();
	const [modalVisible, setModalVisible] = useState(false);
	const [editingRecord, setEditingRecord] = useState<Advertisement | null>(null);
	const [searchForm] = Form.useForm();

	// 加載數據
	const loadData = useCallback(async (params: Partial<Reqadvertisementfindallquery>) => {
		const { page = 1, pageSize = 10 } = params;
		setLoading(true);
		try {
			const response = await reqAdvertisementfindall({ page, pageSize, ...params });
			setData(response.items || []);
			setPagination((prev) => ({ ...prev, current: page, pageSize, total: response.pagination?.total || 0 }));
		} catch (error) {
			message.error("獲取廣告列表失敗");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadData({
			page: pagination.current,
			pageSize: pagination.pageSize,
		});
	}, [loadData, pagination.current, pagination.pageSize]);

	// 表格列配置
	const columns = getTableColumns({
		handleView: (record: Advertisement) => {
			setEditingRecord(record);
			setModalVisible(true);
		},
		handleEdit: (record: Advertisement) => {
			setEditingRecord(record);
			setModalVisible(true);
		},
		handleDelete: (id?: string) => {
			if (!id) {
				message.error("廣告不存在");
				return;
			}
			// 在這裡調用處理刪除函數
			handleDelete(id);
		},
	});

	// 處理刪除
	const handleDelete = async (id?: string) => {
		try {
			if (!id) {
				message.error("廣告不存在");
				return;
			}
			await reqAdvertisementremove(id);
			message.success("刪除成功");
			loadData({
				page: pagination.current,
				pageSize: pagination.pageSize,
			});
		} catch (error) {
			console.error("Failed to delete advertisement:", error);
			message.error("刪除失敗");
		}
	};

	const handleSubmit = async (values: Partial<UpdateAdvertisementDto>) => {
		try {
			// 轉換數值類型
			const processedValues = {
				...values,
				priority: values.priority ? Number(values.priority) : 0,
			};

			if (editingRecord) {
				if (!editingRecord) {
					toast.error("廣告不存在");
					return;
				}
				// 更新广告
				const updateParams: UpdateAdvertisementDto = processedValues as UpdateAdvertisementDto;
				await reqAdvertisementupdate(editingRecord.id, updateParams);
				toast.success("更新成功");
			} else {
				assertFieldsExist(processedValues, ["title", "shortDesc", "redirectUrl", "adPositionId", "priority", "status"]);
				const createParams: CreateAdvertisementDto = processedValues as CreateAdvertisementDto;
				await reqAdvertisementcreate(createParams);
				toast.success("創建成功");
			}
			pagination.current = 1;
			loadData({
				page: pagination.current,
				pageSize: pagination.pageSize,
			});
			setModalVisible(false);
			form.resetFields();
		} catch (error) {
			console.error("Failed to update advertisement:", error);
			toast.error("操作失败");
		}
	};

	useEffect(() => {
		if (modalVisible && editingRecord) {
			form.setFieldsValue({
				startTime: editingRecord.startTime ? new Date(editingRecord.startTime) : undefined,
				endTime: editingRecord.endTime ? new Date(editingRecord.endTime) : undefined,
				shortDesc: editingRecord.shortDesc || undefined,
				title: editingRecord.title || undefined,
				coverImage: editingRecord.coverImage || undefined,
				redirectUrl: editingRecord.redirectUrl || undefined,
				priority: editingRecord.priority || undefined,
				status: editingRecord.status,
				adPositionId: editingRecord.adPositionId || undefined,
			});
		} else if (modalVisible && !editingRecord) {
			// 新建时清空表单
			form.resetFields();
			form.setFieldsValue(initFormValues());
		}
	}, [modalVisible, editingRecord, form]);

	const isEditing = useMemo(() => !!editingRecord, [editingRecord]);
	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			<Card
				title={
					<Title level={4} className="mb-0">
						廣告管理
					</Title>
				}
				extra={
					<Space>
						<Button
							type="primary"
							icon={<LucidePlus />}
							onClick={() => {
								setEditingRecord(null);
								setTimeout(() => {
									form.resetFields();
									form.setFieldsValue(initFormValues());
									setModalVisible(true);
								}, 0);
							}}
						>
							添加廣告
						</Button>
					</Space>
				}
			>
				{/* 搜索區域 */}
				<Card className="mb-4">
					<SearchForm
						form={searchForm}
						onSearch={(values: Partial<Reqadvertisementfindallquery>) => {
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
						onChange: (page: number, pageSize: number) => {
							setPagination({ ...pagination, current: page, pageSize });
						},
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total: number) => `共 ${total} 條`,
					}}
					scroll={{ x: 1400 }}
				/>

				{/* 編輯/添加模態框 */}
				<Modal
					title={editingRecord ? "編輯廣告" : "添加廣告"}
					open={modalVisible}
					onCancel={() => {
						setModalVisible(false);
						setEditingRecord(null);
						form.resetFields();
					}}
					footer={null}
					width={800}
				>
					<AdvertisementForm
						form={form}
						editingRecord={editingRecord}
						onSubmit={handleSubmit}
						onCancel={() => {
							setModalVisible(false);
							setEditingRecord(null);
							form.resetFields();
						}}
						isEditing={isEditing}
					/>
				</Modal>
			</Card>
		</div>
	);
};

export default AdvertisementManagement;
