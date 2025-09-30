import type { CreateUserWithAccountDto, UpdateUserDto, UserRoleInfoEntity } from "#/api";
import { UploadThumbnailWithMode } from "@/pages/articles/create-edit-article/UploadThumbnailWithMode";
import { Checkbox, DatePicker, Form, Input, Modal, Select, Switch } from "antd";
import type dayjs from "dayjs";
import type { FC } from "react";
import { useEffect, useState } from "react";
interface UserModalProps {
	visible: boolean;
	onCancel: () => void;
	onOk: (values: CreateUserWithAccountDto | UpdateUserDto) => void;
	roles: UserRoleInfoEntity[];
	initialValues?: Omit<UpdateUserDto, "birthday"> & {
		birthday?: dayjs.Dayjs;
	};
}

const UserModal: FC<UserModalProps> = ({ visible, onCancel, onOk, roles, initialValues }) => {
	const [form] = Form.useForm();
	const [updatePassword, setUpdatePassword] = useState(false);

	useEffect(() => {
		if (visible) {
			if (initialValues) {
				form.setFieldsValue({
					...initialValues,
				});
				setUpdatePassword(false);
			} else {
				form.resetFields();
				setUpdatePassword(true);
			}
		}
	}, [visible, initialValues, form]);

	const handleOk = () => {
		form
			.validateFields()
			.then((values) => {
				if (values.gender && !["Unknown", "male", "female"].includes(values.gender)) {
					values.gender = "Unknown";
				}

				if (values.birthday) {
					values.birthday = values.birthday.format("YYYY-MM-DD");
				}

				// 如果是編輯用戶且不更新密碼，刪除password字段
				if (initialValues && !updatePassword) {
					// biome-ignore lint/performance/noDelete: <explanation>
					delete values.password;
				}
				onOk(values);
			})
			.catch((info) => {
				console.log("Validate Failed:", info);
			});
	};

	return (
		<Modal
			title={initialValues ? "編輯用戶" : "創建用戶"}
			open={visible}
			onCancel={onCancel}
			onOk={handleOk}
			width={600}
		>
			<Form form={form} layout="vertical" initialValues={initialValues}>
				<Form.Item name="userName" label="用戶名" rules={[{ required: true, message: "請輸入用戶名!" }]}>
					<Input placeholder="請輸入用戶名" autoComplete="off" />
				</Form.Item>

				{!initialValues && (
					<Form.Item name="account" label="賬號" rules={[{ required: true, message: "請輸入賬號!" }]}>
						<Input placeholder="請輸入賬號（郵箱或手機號）" />
					</Form.Item>
				)}

				{initialValues && (
					<Form.Item>
						<Checkbox checked={updatePassword} onChange={(e) => setUpdatePassword(e.target.checked)}>
							更新密碼
						</Checkbox>
					</Form.Item>
				)}

				{(updatePassword || !initialValues) && (
					<Form.Item
						name="password"
						label={initialValues ? "新密碼" : "密碼"}
						rules={
							initialValues
								? []
								: [
										{ required: true, message: "請輸入密碼!" },
										{
											validator(_rule, value) {
												if (value && value.length < 10) {
													return Promise.reject("密碼長度不能小於10位");
												}
												return Promise.resolve();
											},
										},
									]
						}
					>
						<Input.Password placeholder={initialValues ? "請輸入新密碼" : "請輸入密碼"} autoComplete="off" />
					</Form.Item>
				)}

				<Form.Item name="roleId" label="角色" rules={[{ required: true, message: "請選擇角色!" }]}>
					<Select placeholder="請選擇角色">
						{roles.map((role) => (
							<Select.Option key={role.id} value={role.id}>
								{role.name}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item name="disabled" label="是否禁用" valuePropName="checked">
					<Switch defaultChecked />
				</Form.Item>

				<Form.Item
					name="headImgUrl"
					label="頭像"
					getValueFromEvent={(e) => {
						console.log("UploadThumbnailWithMode value changed:", e);
						return e;
					}}
				>
					<UploadThumbnailWithMode value={initialValues?.headImgUrl} defaultMode="upload" />
				</Form.Item>

				<Form.Item
					name="mobile"
					label="手機號"
					rules={[
						{ required: false, message: "請輸入手機號!" },
						{
							validator(_rule, value) {
								if (value && !/^\+?[1-9]\d{1,14}$/.test(value)) {
									return Promise.reject("請輸入有效的國際手機號（格式：+國家代碼 號碼）");
								}
								return Promise.resolve();
							},
						},
					]}
				>
					<Input placeholder="請輸入手機號" />
				</Form.Item>

				<Form.Item
					name="email"
					label="郵箱"
					rules={[
						{ required: false, message: "請輸入郵箱!" },
						{
							validator(_rule, value) {
								if (value && !/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value)) {
									return Promise.reject("請輸入有效的郵箱地址");
								}
								return Promise.resolve();
							},
						},
					]}
				>
					<Input placeholder="請輸入郵箱" />
				</Form.Item>

				<Form.Item name="gender" label="性別">
					<Select placeholder="請選擇性別">
						<Select.Option value="Unknown">未知</Select.Option>
						<Select.Option value="male">男</Select.Option>
						<Select.Option value="female">女</Select.Option>
					</Select>
				</Form.Item>

				<Form.Item name="birthday" label="生日">
					<DatePicker style={{ width: "100%" }} placeholder="請選擇生日" format="YYYY-MM-DD" />
				</Form.Item>

				<Form.Item name="address" label="地址">
					<Input placeholder="請輸入地址" />
				</Form.Item>

				<Form.Item name="companyName" label="公司名稱">
					<Input placeholder="請輸入公司名稱" />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default UserModal;
