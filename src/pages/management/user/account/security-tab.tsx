import { reqUserupdatepassword } from "@/api/services";
import { useUserInfo } from "@/store/userStore";
import type { UpdatePasswordDto } from "@/types";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form";
import { Input } from "@/ui/input";
import { printError } from "@/utils/printError";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function SecurityTab() {
	const initialValue: UpdatePasswordDto = {
		oldPassword: "",
		password: "",
		confirmPassword: "",
		account: useUserInfo().account || "",
	};
	const form = useForm<UpdatePasswordDto>({
		defaultValues: initialValue,
	});

	const handleSubmit = (values: UpdatePasswordDto) => {
		reqUserupdatepassword(values)
			.then(() => {
				toast.success("密碼變更成功！");
				form.reset();
			})
			.catch((err) => {
				printError(err, "密碼變更失敗");
			});
	};

	return (
		<Card>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="oldPassword"
							rules={{ required: "原密碼是必須的" }}
							render={({ field }) => (
								<FormItem>
									<FormLabel>原密碼</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							rules={{ required: "新密碼是必須的" }}
							render={({ field }) => (
								<FormItem>
									<FormLabel>新密碼</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="confirmPassword"
							rules={{
								required: "請輸入確認密碼",
								validate: (value) => value === form.getValues("password") || "密碼不匹配",
							}}
							render={({ field }) => (
								<FormItem>
									<FormLabel>確認密碼</FormLabel>
									<FormControl>
										<Input type="password" {...field} minLength={10} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex w-full justify-end">
							<Button type="submit">保存密碼變更</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
