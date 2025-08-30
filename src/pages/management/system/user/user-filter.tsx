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
			<Form.Item label="账号状态" name="deleted">
				<Select allowClear>
					<Select.Option value={""}>全部</Select.Option>
					<Select.Option value={0}>正常</Select.Option>
					<Select.Option value={1}>已删除</Select.Option>
				</Select>
			</Form.Item>

			<Form.Item label="禁用状态" name="disabled">
				<Select allowClear>
					<Select.Option value={""}>全部</Select.Option>
					<Select.Option value={1}>已禁用</Select.Option>
					<Select.Option value={0}>正常</Select.Option>
				</Select>
			</Form.Item>

			<Form.Item label="账号" name="account">
				<Input placeholder="输入账号" />
			</Form.Item>

			<Form.Item label="用户名" name="name">
				<Input placeholder="输入用户名" />
			</Form.Item>

			<Form.Item label="邮箱" name="email">
				<Input placeholder="输入邮箱" />
			</Form.Item>

			<Form.Item label="手机号" name="mobile">
				<Input placeholder="输入手机号" />
			</Form.Item>

			<Form.Item
				label="创建时间"
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
					搜索
				</Button>
				<Button onClick={handleReset}>重置</Button>
			</Form.Item>
		</Form>
	);
};

export default UserFilterForm;
