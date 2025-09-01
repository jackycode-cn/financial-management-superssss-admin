import { Button, DatePicker, Form, Input, Select } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import type React from "react";
import { useEffect } from "react";
import "./user-filter.css";
const { RangePicker } = DatePicker;

export interface UserFilterParams {
	deleted?: number;
	disabled?: number;
	account?: string;
	name?: string;
	email?: string;
	mobile?: string;
	createTimeRange?: [Dayjs, Dayjs];
}

interface UserFilterFormProps {
	value?: UserFilterParams;
	onChange?: (value: UserFilterParams) => void;
	onSearch?: (value: UserFilterParams) => void;
	onReset?: (value: UserFilterParams) => void;
}

const initialValues: UserFilterParams = {
	deleted: undefined,
	disabled: undefined,
	account: "",
	name: "",
	email: "",
	mobile: "",
	createTimeRange: undefined,
};

const UserFilterForm: React.FC<UserFilterFormProps> = ({ value, onChange, onSearch, onReset }) => {
	const [form] = Form.useForm<UserFilterParams>();

	useEffect(() => {
		form.setFieldsValue(value || initialValues);
	}, [value, form]);

	const handleValuesChange = (_: any, allValues: UserFilterParams) => {
		onChange?.(allValues);
	};

	const handleSearch = () => {
		const values = form.getFieldsValue();
		onSearch?.(values);
	};
	const handleReset = () => {
		form.setFieldsValue(initialValues);
		onChange?.(initialValues);
		onReset?.(initialValues);
	};

	return (
		<Form
			layout="inline"
			form={form}
			initialValues={value}
			onValuesChange={handleValuesChange}
			style={{
				display: "flex",
				flexWrap: "wrap",
				gap: 8,
			}}
		>
			<Form.Item label="帳號狀態" name="deleted" className="w-[200px]">
				<Select allowClear className="w-full">
					<Select.Option value={""}>全部</Select.Option>
					<Select.Option value={0}>正常</Select.Option>
					<Select.Option value={1}>已刪除</Select.Option>
				</Select>
			</Form.Item>

			<Form.Item label="停用狀態" name="disabled" className="w-[200px]">
				<Select allowClear className="w-full">
					<Select.Option value={""}>全部</Select.Option>
					<Select.Option value={1}>已停用</Select.Option>
					<Select.Option value={0}>正常</Select.Option>
				</Select>
			</Form.Item>

			<Form.Item label="帳號" name="account">
				<Input placeholder="輸入帳號" />
			</Form.Item>

			<Form.Item label="使用者名稱" name="name">
				<Input placeholder="輸入使用者名稱" />
			</Form.Item>

			<Form.Item label="信箱" name="email">
				<Input placeholder="輸入信箱" />
			</Form.Item>

			<Form.Item label="手機號碼" name="mobile">
				<Input placeholder="輸入手機號碼" />
			</Form.Item>

			<Form.Item
				label="建立時間"
				name="createTimeRange"
				style={{
					minWidth: 200,
					flex: "3 1 200px",
				}}
			>
				<RangePicker
					disabledDate={(current) => current && current > dayjs().endOf("day")}
					style={{
						width: "100%",
						maxWidth: 350,
					}}
					size="middle"
					popupClassName="ant-picker-popup-mobile"
				/>
			</Form.Item>

			<Form.Item style={{ flex: "1 1 100%", display: "flex", gap: 8, flexWrap: "wrap" }}>
				<Button type="primary" onClick={handleSearch}>
					搜尋
				</Button>
				<Button onClick={handleReset}>重置</Button>
			</Form.Item>
		</Form>
	);
};

export default UserFilterForm;
