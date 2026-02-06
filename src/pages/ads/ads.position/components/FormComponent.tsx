import type { AdPosition } from "#/api";
import { Button, Form, Input, Select, Space } from "antd";

interface AdPositionFormProps {
	form: any;
	editingRecord?: AdPosition | null;
	onSubmit: (values: any) => void;
	onCancel: () => void;
	isEditing?: boolean;
}

const AdPositionForm = ({ form, onSubmit, onCancel, isEditing = false }: AdPositionFormProps) => {
	return (
		<Form form={form} layout="vertical" onFinish={onSubmit}>
			<Form.Item name="name" label="名稱" rules={[{ required: true, message: "請輸入廣告位置名稱" }]}>
				<Input placeholder="請輸入廣告位置名稱，如：首頁輪播圖" />
			</Form.Item>

			<Form.Item
				name="code"
				label="編碼"
				rules={[
					{ required: true, message: "請輸入廣告位置編碼" },
					{ pattern: /^[a-zA-Z0-9_-]+$/, message: "編碼只能包含字母、數字、下劃線和連字符" },
				]}
			>
				<Input placeholder="請輸入廣告位置編碼，如：home_carousel" />
			</Form.Item>

			<Form.Item name="description" label="描述">
				<Input.TextArea rows={3} placeholder="請輸入廣告位置描述" />
			</Form.Item>

			<div className="grid grid-cols-2 gap-4">
				<Form.Item name="width" label="寬度 (px)" rules={[{ required: true, message: "請輸入寬度" }]}>
					<Input type="number" min={0} placeholder="請輸入寬度" />
				</Form.Item>

				<Form.Item name="height" label="高度 (px)" rules={[{ required: true, message: "請輸入高度" }]}>
					<Input type="number" min={0} placeholder="請輸入高度" />
				</Form.Item>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<Form.Item name="type" label="類型" rules={[{ required: true, message: "請選擇類型" }]}>
					<Select placeholder="請選擇廣告位置類型">
						<Select.Option value="BANNER">橫幅</Select.Option>
						<Select.Option value="POPUP">彈窗</Select.Option>
						<Select.Option value="SIDEBAR">側邊欄</Select.Option>
						<Select.Option value="FEED">信息流</Select.Option>
						<Select.Option value="SPLASH">啟動頁</Select.Option>
						<Select.Option value="INTERSTITIAL">插屏</Select.Option>
					</Select>
				</Form.Item>

				<Form.Item name="maxAds" label="最大廣告數" rules={[{ required: true, message: "請輸入最大廣告數" }]}>
					<Input type="number" min={1} placeholder="請輸入最大廣告數" />
				</Form.Item>
			</div>

			<Form.Item name="status" label="狀態" rules={[{ required: true, message: "请选择状态" }]}>
				<Select placeholder="請選擇狀態">
					<Select.Option value={true}>啟用</Select.Option>
					<Select.Option value={false}>禁用</Select.Option>
				</Select>
			</Form.Item>

			<Form.Item>
				<Space>
					<Button type="primary" htmlType="submit">
						{isEditing ? "更新" : "創建"}
					</Button>
					<Button onClick={onCancel}>取消</Button>
				</Space>
			</Form.Item>
		</Form>
	);
};

export default AdPositionForm;
