import type { CreatePartialUnionFromArray, CreatePermissionDto, UpdatePermissionDto } from "@/types";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/ui/toggle-group";
import { memo, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { FormErrorMessage } from "@/components/form-error-message";
import { type UserPermissionReturn, useUserPermissionData } from "@/hooks/admin/permission";
import { MyTreeSelect } from "@/pages/components/select/MySelect";
import type { PermissionOneEntity } from "@/types/api/output";

type FormValueType = CreatePartialUnionFromArray<
	[
		CreatePermissionDto,
		UpdatePermissionDto,
		{
			id?: number;
		},
	]
> &
	PermissionOneEntity;

export type PermissionModalProps = {
	formValue: FormValueType;
	title: string;
	show: boolean;
	onOk: (values: FormValueType) => void;
	onCancel: VoidFunction;
	threeData?: UserPermissionReturn["treeData"];
	isNeedLoadData?: boolean;
};

export function PermissionModal({
	title,
	show,
	formValue,
	onOk,
	onCancel,
	threeData,
	isNeedLoadData = false,
}: PermissionModalProps) {
	const form = useForm<FormValueType>({
		defaultValues: {
			...formValue,
			parentId: 1,
		},
	});
	const [permissions, setPermissions] = useState<UserPermissionReturn["treeData"]>([]);

	const { loadData, treeData: permissionTreeData } = useUserPermissionData();
	useEffect(() => {
		if (isNeedLoadData && !threeData) {
			loadData()
				.then(() => {
					setPermissions([...permissionTreeData]);
				})
				.catch(console.error);
		}
		if (threeData) {
			setPermissions([...threeData]);
		}
	}, [isNeedLoadData, threeData, loadData, permissionTreeData]);
	const getParentNameById = useCallback(
		(parentId: string, data: UserPermissionReturn["treeData"] | undefined = permissions) => {
			let name = "";
			if (!data || !parentId) return name;
			for (let i = 0; i < data.length; i += 1) {
				if (data[i].id === Number(parentId)) {
					name = data[i].name || "";
				} else if (data[i].children) {
					name = getParentNameById(parentId, data[i].children);
				}
				if (name) {
					break;
				}
			}
			return name;
		},
		[permissions],
	);
	useEffect(() => {
		form.reset(formValue);
	}, [formValue, form]);

	const onSubmit = (values: FormValueType) => {
		onOk(values);
	};

	return (
		<Dialog open={show} onOpenChange={(open) => !open && onCancel()}>
			<DialogContent aria-describedby="dialog-content">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="category"
							rules={{ required: "請選擇權限類型" }}
							render={({ field }) => (
								<FormItem>
									<FormLabel>權限類型</FormLabel>
									<FormControl>
										<ToggleGroup
											type="single"
											variant="outline"
											className="w-auto"
											value={field.value || "menu"}
											onValueChange={(value) => {
												field.onChange(value);
											}}
										>
											<ToggleGroupItem value="menu">MENU</ToggleGroupItem>
											<ToggleGroupItem value="button">BUTTON</ToggleGroupItem>
											<ToggleGroupItem value="api">API</ToggleGroupItem>
										</ToggleGroup>
									</FormControl>
									<FormErrorMessage error={form.formState.errors.category} />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="name"
							rules={{ required: "請輸入權限名稱" }}
							render={({ field }) => (
								<FormItem>
									<FormLabel>權限名稱</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormErrorMessage error={form.formState.errors.name} />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="intro"
							rules={{ required: "請輸入權限介紹" }}
							render={({ field }) => (
								<FormItem>
									<FormLabel>權限介紹</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormErrorMessage error={form.formState.errors.intro} />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="parentId"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>父權限</FormLabel>
										<FormControl>
											<MyTreeSelect
												fieldNames={{
													label: "name",
													value: "id",
													children: "children",
												}}
												defaultValue={formValue.parentId || undefined}
												treeData={permissions}
												onChange={(value) => field.onChange(value)}
												placeholder="請選擇父权限"
												treeSelectProps={{
													size: "middle",
													allowClear: true,
													treeDataSimpleMode: true,
												}}
											/>
										</FormControl>
										<FormErrorMessage error={form.formState.errors.parentId} />
									</FormItem>
								);
							}}
						/>

						<FormField
							control={form.control}
							name="url"
							render={({ field }) => (
								<FormItem>
									<FormLabel>URL</FormLabel>
									<FormControl>
										<Input {...field} value={field.value || ""} />
									</FormControl>
									<FormErrorMessage error={form.formState.errors.url} />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="code"
							rules={{ required: "請輸入權限碼" }}
							render={({ field }) => (
								<FormItem>
									<FormLabel>權限碼</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormErrorMessage error={form.formState.errors.code} />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="deleted"
							render={({ field }) => (
								<FormItem>
									<FormLabel>是否刪除</FormLabel>

									<FormControl>
										<ToggleGroup
											type="single"
											variant="outline"
											value={field.value ? "true" : "false"}
											onValueChange={(value) => {
												field.onChange(value === "true");
											}}
										>
											<ToggleGroupItem value="false">未刪除</ToggleGroupItem>
											<ToggleGroupItem value="true">已刪除</ToggleGroupItem>
										</ToggleGroup>
									</FormControl>
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button type="button" variant="outline" onClick={onCancel}>
								取消
							</Button>
							<Button type="submit" variant="default">
								確認
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
export default memo(PermissionModal);
