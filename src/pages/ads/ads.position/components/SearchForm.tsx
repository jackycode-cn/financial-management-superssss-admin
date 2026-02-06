import type { Reqadpositionsfindallquery } from "#/api";
import { Button, Form, Select, Space } from "antd";

interface SearchFormProps {
	form: any;
	onSearch: (values: Partial<Reqadpositionsfindallquery>) => void;
	onReset: () => void;
}

const SearchForm = ({ form, onSearch, onReset }: SearchFormProps) => {
	return (
		<Form form={form} layout="inline" onFinish={onSearch}>
			<Form.Item name="type" label="類型">
				<Select placeholder="請選擇類型" allowClear style={{ width: 150 }}>
					<Select.Option value="BANNER">橫幅</Select.Option>
					<Select.Option value="POPUP">彈窗</Select.Option>
					<Select.Option value="SIDEBAR">側邊欄</Select.Option>
					<Select.Option value="FEED">信息流</Select.Option>
					<Select.Option value="SPLASH">啟動頁</Select.Option>
					<Select.Option value="INTERSTITIAL">插屏</Select.Option>
				</Select>
			</Form.Item>
			<Form.Item name="status" label="狀態">
				<Select placeholder="請選擇狀態" allowClear style={{ width: 150 }}>
					<Select.Option value={true}>啟用</Select.Option>
					<Select.Option value={false}>禁用</Select.Option>
				</Select>
			</Form.Item>
			<Form.Item>
				<Space>
					<Button type="primary" htmlType="submit">
						搜索
					</Button>
					<Button onClick={onReset}>重置</Button>
				</Space>
			</Form.Item>
		</Form>
	);
};

export default SearchForm;
