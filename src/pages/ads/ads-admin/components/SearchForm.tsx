import type { Reqadvertisementfindallquery } from "#/api";
import { Button, Form, Input, Select, Space } from "antd";

interface SearchFormProps {
	form: any;
	onSearch: (values: Partial<Reqadvertisementfindallquery>) => void;
	onReset: () => void;
}

const SearchForm = ({ form, onSearch, onReset }: SearchFormProps) => {
	return (
		<Form form={form} layout="inline" onFinish={onSearch}>
			<Form.Item name="keyword" label="關鍵詞">
				<Input placeholder="請輸入廣告標題或描述" />
			</Form.Item>
			<Form.Item name="status" label="狀態">
				<Select placeholder="請選擇狀態" allowClear style={{ width: 150 }}>
					<Select.Option value="ENABLED">啟用</Select.Option>
					<Select.Option value="DISABLED">禁用</Select.Option>
					<Select.Option value="DRAFT">草稿</Select.Option>
					<Select.Option value="EXPIRED">過期</Select.Option>
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
