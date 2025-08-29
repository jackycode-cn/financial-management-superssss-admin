import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Textarea } from "@/ui/textarea";
import { memo, useEffect } from "react";
import { useForm } from "react-hook-form";

import type { UserRolesReturn } from "@/hooks/admin/role";
import { MyTreeSelect } from "@/pages/components/select/MySelect";
import type { CreatePartialUnionFromArray, CreateRoleDto, RoleOneEntity, UpdateRoleDto } from "@/types";

type FormValueType = CreatePartialUnionFromArray<[CreateRoleDto, UpdateRoleDto, RoleOneEntity]>;

export type RoleModalProps = {
	formValue: FormValueType;
	title: string;
	show: boolean;
	onOk: (values: FormValueType) => void;
	onCancel: VoidFunction;
	roles?: UserRolesReturn["treeData"];
	isNeedLoadData?: boolean;
};

export function RoleModal({ title, show, formValue, onOk, onCancel, roles = [] }: RoleModalProps) {
	const form = useForm<FormValueType>({
		defaultValues: formValue,
	});

	useEffect(() => {
		form.reset(formValue);
	}, [formValue, form]);

	const handleSubmit = async (values: FormValueType) => {
		onOk(values);
	};

	return (
		<Dialog open={show} onOpenChange={(open) => !open && onCancel()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="text-right">角色名稱:</FormLabel>
										<div className="col-span-3">
											<FormControl>
												<Input {...field} />
											</FormControl>
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="code"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="text-right">角色代碼:</FormLabel>
										<div className="col-span-3">
											<FormControl>
												<Input {...field} />
											</FormControl>
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="parentId"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-2 w-full">
										<FormLabel>父級ID:</FormLabel>
										<FormControl>
											<MyTreeSelect
												treeData={roles}
												fieldNames={{
													label: "name",
													children: "children",
													value: "id",
												}}
												onChange={(value) => field.onChange(value)}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="intro"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="text-right">角色描述:</FormLabel>
										<div className="col-span-3">
											<FormControl>
												<Textarea {...field} />
											</FormControl>
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="deleted"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="text-right">狀態:</FormLabel>

										<div className="col-span-3">
											<FormControl>
												<RadioGroup
													onValueChange={(value) => field.onChange(value === "true")}
													defaultValue={String(field.value)}
												>
													<div className="flex items-center space-x-2">
														<RadioGroupItem value="false" id="r1" />
														<Label htmlFor="r1">啟用</Label>
													</div>
													<div className="flex items-center space-x-2">
														<RadioGroupItem value="true" id="r2" />
														<Label htmlFor="r2">停用</Label>
													</div>
												</RadioGroup>
											</FormControl>
										</div>
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={onCancel}>
								取消
							</Button>
							<Button type="submit" variant="default">
								保存
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default memo(RoleModal);
