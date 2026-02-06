import { UploadThumbnailWithMode } from "@/pages/articles/create-edit-article/UploadThumbnailWithMode";
import { Button, DatePicker, Form, Input, Select, Space } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import SelectAdsPositions from "../../ads.position/components/select-ads-positions";

interface AdvertisementFormProps {
	form: any;
	editingRecord?: any;
	onSubmit: (values: any) => void;
	onCancel: () => void;
	isEditing?: boolean;
}

const { RangePicker } = DatePicker;

const AdvertisementForm = ({ form, editingRecord, onSubmit, onCancel, isEditing = false }: AdvertisementFormProps) => {
	const handleTimeChange: RangePickerProps["onChange"] = (dates) => {
		if (dates && dates.length === 2) {
			form.setFieldsValue({
				startTime: dayjs(dates[0]).toISOString(),
				endTime: dayjs(dates[1]).toISOString(),
			});
		}
	};

	// 當 editingRecord 改變時，設置默認日期值
	useEffect(() => {
		if (editingRecord) {
			form.setFieldsValue({
				startTime: editingRecord.startTime ? dayjs(editingRecord.startTime) : null,
				endTime: editingRecord.endTime ? dayjs(editingRecord.endTime) : null,
				shortDesc: editingRecord.shortDesc || undefined,
				title: editingRecord.title || undefined,
				coverImage: editingRecord.coverImage || undefined,
				redirectUrl: editingRecord.redirectUrl || undefined,
				priority: editingRecord.priority || undefined,
				status: editingRecord.status,
				adPositionId: editingRecord.adPositionId || undefined,
			});
		} else {
			form.setFieldsValue({
				startTime: null,
				endTime: null,
				priority: 0,
			});
		}
	}, [editingRecord, form]);

	return (
		<Form form={form} layout="vertical" onFinish={onSubmit}>
			<Form.Item name="title" label="廣告標題" rules={[{ required: true, message: "請輸入廣告標題" }]}>
				<Input placeholder="請輸入廣告標題" />
			</Form.Item>

			<Form.Item name="coverImage" label="封面圖片">
				<UploadThumbnailWithMode value={editingRecord?.coverImage} defaultMode="upload" />
			</Form.Item>

			<Form.Item name="shortDesc" label="簡短描述" rules={[{ required: true, message: "請輸入簡短描述" }]}>
				<Input.TextArea rows={3} placeholder="請輸入簡短描述" />
			</Form.Item>

			<Form.Item
				name="redirectUrl"
				label="跳轉連結"
				rules={[
					{ required: true, message: "請輸入跳轉連結" },
					{ type: "url", message: "請輸入有效的URL" },
				]}
			>
				<Input placeholder="請輸入跳轉連結，例如: https://example.com" />
			</Form.Item>

			<Form.Item name="adPositionId" label="廣告位置" rules={[{ required: true, message: "請選擇廣告位置" }]}>
				<SelectAdsPositions placeholder="請選擇廣告位置" />
			</Form.Item>

			<Form.Item name="priority" label="優先級" rules={[{ required: true, message: "請輸入優先級" }]}>
				<Input type="number" min={0} max={10} placeholder="請輸入優先級 (0-10)" />
			</Form.Item>

			<Form.Item name="status" label="狀態" rules={[{ required: true, message: "請選擇狀態" }]}>
				<Select placeholder="請選擇狀態">
					<Select.Option value="ENABLED">啟用</Select.Option>
					<Select.Option value="DISABLED">禁用</Select.Option>
					<Select.Option value="DRAFT">草稿</Select.Option>
					<Select.Option value="EXPIRED">過期</Select.Option>
				</Select>
			</Form.Item>

			<div className="ant-form-item my-4">
				<div className="ant-form-item-label">
					{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
					<label>時間範圍</label>
				</div>
				<div className="ant-form-item-control">
					<Form.Item name="startTime" noStyle>
						<Input type="hidden" />
					</Form.Item>
					<Form.Item name="endTime" noStyle>
						<Input type="hidden" />
					</Form.Item>
					<RangePicker
						showTime
						onChange={handleTimeChange}
						value={useMemo(
							() => [
								editingRecord?.startTime ? dayjs(editingRecord.startTime) : null,
								editingRecord?.endTime ? dayjs(editingRecord.endTime) : null,
							],
							[editingRecord],
						)}
					/>
				</div>
			</div>

			<Form.Item>
				<Space>
					<Button onClick={onCancel}>取消</Button>
					<Button type="primary" htmlType="submit">
						{isEditing ? "更新" : "創建"}
					</Button>
				</Space>
			</Form.Item>
		</Form>
	);
};

export default AdvertisementForm;
