import { reqUserupdateOwnprofile } from "@/api/services";
import { UploadThumbnail } from "@/components/upload/upload-thumbnail";
import { GLOBAL_CONFIG } from "@/global-config";
import { useRequestUserInfo, useUserInfo, useUserToken } from "@/store/userStore";
import type { UpdateUserDto } from "@/types";
import { Button } from "@/ui/button";
import { Card, CardContent, CardFooter } from "@/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form";
import { Input } from "@/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const updateUserSchema = z.object({
	userName: z.string().min(2, "用戶名至少為2個字符").optional(),

	email: z.string().email("郵箱格式不正確").optional().nullable(),
	mobile: z
		.string()
		.transform((val) => val?.trim()) // 去掉前后空格
		.refine((val) => !val || /^\+?[1-9]\d{1,14}$/.test(val), "手機號需要為國際手機號標準格式，+區號開頭")
		.optional()
		.nullable(),
	address: z.string().min(3, "地址至少為3個字符").optional().nullable(),
});
type PickUpdateUserDto = {
	[K in keyof Pick<UpdateUserDto, "userName" | "email" | "mobile" | "address">]-?: NonNullable<
		Pick<UpdateUserDto, K>[K]
	>;
};
export default function GeneralTab() {
	const { avatar, username, email, mobile, address, account, role } = useUserInfo();
	const requestUserInfo = useRequestUserInfo();
	const { accessToken } = useUserToken();
	const form = useForm<PickUpdateUserDto>({
		resolver: zodResolver(updateUserSchema) as Resolver<PickUpdateUserDto>,

		defaultValues: {
			userName: username,
			email: email,
			mobile: mobile,
			address: address,
		},
	});

	/** 通用更新用户信息函数 */
	const updateUserProfile = async (data: Partial<UpdateUserDto & { headImgUrl?: string }>, isAvator = false) => {
		try {
			await reqUserupdateOwnprofile(data);
			toast.success(isAvator ? "用戶頭像更新成功" : "用戶信息更新成功!");
			await requestUserInfo(); // 刷新用户信息
		} catch (err: any) {
			console.error(err);
			toast.error(err?.message || "更新失败");
			throw err;
		}
	};

	/** 表单提交 */
	const handleClick = form.handleSubmit((values) => {
		updateUserProfile(values);
	});

	/** 上传头像成功回调 */
	const handleSuccess = (url: string) => {
		updateUserProfile({ headImgUrl: url }, true);
	};

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
			<div className="col-span-1">
				<Card className="flex-col items-center justify-center px-6! pb-10! pt-20!">
					<div className="text-2xl font-bold">
						{account}-（{role?.name}）
					</div>
					<UploadThumbnail
						action={GLOBAL_CONFIG.uploadFileUrl}
						headers={{
							Authorization: `Bearer ${accessToken}`,
						}}
						defaultUrl={avatar}
						name="file"
						onSuccess={handleSuccess}
					/>
				</Card>
			</div>

			<div className="col-span-1">
				<Card>
					<CardContent>
						<Form {...form}>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<FormField
									control={form.control}
									name="userName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>用户名</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage /> {/* 错误信息 */}
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>邮箱</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="mobile"
									render={({ field }) => (
										<FormItem>
											<FormLabel>手机号</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="address"
									render={({ field }) => (
										<FormItem>
											<FormLabel>地址</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</Form>
					</CardContent>
					<CardFooter className="flex justify-end">
						<Button onClick={handleClick}>保存资料</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
