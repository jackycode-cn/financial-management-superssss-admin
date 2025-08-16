import type { CreateArticleDto } from "@/types/api/output.d.ts";

import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form";
import { Input } from "@/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Switch } from "@/ui/switch";
import { Textarea } from "@/ui/textarea";
import { optionalUrl } from "@/utils/zod.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const articleSchema = z.object({
	title: z.string().min(3, "标题至少3个字符").max(100, "标题最多100个字符"),
	slug: z
		.string()
		.min(3, "Slug至少3个字符")
		.max(50, "Slug最多50个字符")
		.regex(/^[a-z0-9-]+$/, "Slug只能包含小写字母、数字和连字符"),
	description: z.string().max(200, "描述最多200个字符").optional(),
	content: z.string().optional(),
	category_id: z.number().optional(),
	seo_title: z.string().max(60, "SEO标题最多60个字符").optional(),
	seo_description: z.string().max(160, "SEO描述最多160个字符").optional(),
	seo_keywords: z.string().max(100, "SEO关键词最多100个字符").optional(),
	is_archive: z.boolean().optional(),
	is_top: z.boolean().optional(),
	is_featured: z.boolean().optional(),
	is_hot: z.boolean().optional(),
	is_published: z.boolean().optional(),
	is_external: z.boolean().optional(),
	external_url: optionalUrl(),
	external_author: z.string().max(50, "作者名最多50个字符").optional(),
	thumbnail: optionalUrl(),
	toc: z
		.array(
			z.object({
				title: z.string(),
				anchor: z.string(),
				level: z.number().optional(),
			}),
		)
		.nullable()
		.optional(),
});

type FormValues = z.infer<typeof articleSchema>;

export interface CreateArticleModalProps {
	title?: string;
	show?: boolean;
	type?: "create" | "edit";
	formValue: CreateArticleDto;
	onSubmit: (data: CreateArticleDto) => Promise<void>;
	onCancel: () => void;
	categories: { value: number | string; label: string }[];
	description?: string;
}

function CreateArticleModal({
	title,
	show = false,
	type = "create",
	formValue,
	onSubmit,
	onCancel,
	description = "请填写文章的详细信息",
	categories,
}: CreateArticleModalProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [_error, setError] = useState<string | null>(null);

	const form = useForm<FormValues>({
		defaultValues: formValue as FormValues,
		resolver: zodResolver(articleSchema.strip()),
		mode: "onChange",
	});
	const handleSubmit = async (values: FormValues) => {
		setIsSubmitting(true);
		setError(null);
		try {
			await onSubmit(values as CreateArticleDto);
			onCancel();
		} catch (err) {
			setError(err instanceof Error ? err.message : "创建文章失败，请重试");
		} finally {
			setIsSubmitting(false);
		}
	};
	const { watch } = form;
	const isExternal = watch("is_external", false);

	useEffect(() => {
		form.reset(formValue);
	}, [formValue, form]);

	useEffect(() => {
		if (Object.keys(form.formState.errors).length > 0) {
			console.error("表单验证错误:", form.formState.errors);
		}
	}, [form.formState.errors]);

	return (
		<Dialog open={show} onOpenChange={onCancel}>
			<DialogContent className="sm:max-w-[600px] h-[80vh] ">
				<DialogHeader className="h-[60px]">
					<DialogTitle>{type === "create" ? title || "创建文章" : title || "编辑文章"}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3 h-[75vh] relative">
						<div className="overflow-y-auto h-5/6 custom-scrollbar ">
							{/* 标题和Slug */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									name="title"
									control={form.control}
									render={({ field, fieldState: { error } }) => (
										<FormItem>
											<FormLabel>
												文章标题 <span className="text-red-500">*</span>
											</FormLabel>
											<FormControl>
												<Input placeholder="请输入文章标题" {...field} disabled={isSubmitting} />
											</FormControl>
											{error && <FormMessage>{error.message}</FormMessage>}
										</FormItem>
									)}
								/>

								<FormField
									name="slug"
									control={form.control}
									render={({ field, fieldState: { error } }) => (
										<FormItem>
											<FormLabel>
												文章Slug <span className="text-red-500">*</span>
											</FormLabel>
											<FormControl>
												<Input placeholder="请输入URL友好的标识符" {...field} disabled={isSubmitting} />
											</FormControl>
											{error && <FormMessage>{error.message}</FormMessage>}
										</FormItem>
									)}
								/>
							</div>
							{/* 文章分类和描述 */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								<FormField
									name="category_id"
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel>文章分类</FormLabel>
											<Select
												disabled={isSubmitting}
												onValueChange={(value) => field.onChange(Number(value))}
												defaultValue={field.value?.toString()}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="请选择文章分类" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{categories.map((category) => (
														<SelectItem key={category.value} value={category.value.toString()}>
															{category.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormItem>
									)}
								/>

								<FormField
									name="description"
									control={form.control}
									render={({ field, fieldState: { error } }) => (
										<FormItem>
											<FormLabel>文章描述</FormLabel>
											<FormControl>
												<Textarea
													placeholder="请输入文章简短描述"
													className="min-h-[80px]"
													{...field}
													disabled={isSubmitting}
												/>
											</FormControl>
											{error && <FormMessage>{error.message}</FormMessage>}
										</FormItem>
									)}
								/>
							</div>
							<FormField
								name="is_external"
								control={form.control}
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel className="text-base">外部文章</FormLabel>
											<p className="text-sm text-muted-foreground">链接到外部文章而非内部内容</p>
										</div>
										<FormControl>
											<Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
										</FormControl>
									</FormItem>
								)}
							/>

							{isExternal && (
								<div className="space-y-4 border rounded-lg p-4">
									<FormField
										name="external_url"
										control={form.control}
										render={({ field, fieldState: { error } }) => (
											<FormItem>
												<FormLabel>
													外部文章链接 <span className="text-red-500">*</span>
												</FormLabel>
												<FormControl>
													<Input placeholder="https://example.com/article" {...field} disabled={isSubmitting} />
												</FormControl>
												{error && <FormMessage>{error.message}</FormMessage>}
											</FormItem>
										)}
									/>

									<FormField
										name="external_author"
										control={form.control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>外部文章作者</FormLabel>
												<FormControl>
													<Input placeholder="请输入外部文章作者" {...field} disabled={isSubmitting} />
												</FormControl>
											</FormItem>
										)}
									/>
								</div>
							)}

							{/* SEO设置 */}
							<div className="border rounded-lg p-4 space-y-4">
								<h3 className="text-lg font-medium">SEO设置</h3>

								<FormField
									name="seo_title"
									control={form.control}
									render={({ field, fieldState: { error } }) => (
										<FormItem>
											<FormLabel>SEO标题</FormLabel>
											<FormControl>
												<Input placeholder="搜索引擎显示的标题" {...field} disabled={isSubmitting} />
											</FormControl>
											{error && <FormMessage>{error.message}</FormMessage>}
											<p className="text-xs text-muted-foreground mt-1">建议不超过60个字符</p>
										</FormItem>
									)}
								/>

								<FormField
									name="seo_description"
									control={form.control}
									render={({ field, fieldState: { error } }) => (
										<FormItem>
											<FormLabel>SEO描述</FormLabel>
											<FormControl>
												<Textarea placeholder="搜索引擎显示的描述" {...field} disabled={isSubmitting} />
											</FormControl>
											{error && <FormMessage>{error.message}</FormMessage>}
											<p className="text-xs text-muted-foreground mt-1">建议不超过160个字符</p>
										</FormItem>
									)}
								/>

								<FormField
									name="seo_keywords"
									control={form.control}
									render={({ field, fieldState: { error } }) => (
										<FormItem>
											<FormLabel>SEO关键词</FormLabel>
											<FormControl>
												<Input placeholder="用逗号分隔关键词" {...field} disabled={isSubmitting} />
											</FormControl>
											{error && <FormMessage>{error.message}</FormMessage>}
										</FormItem>
									)}
								/>
							</div>
							<div className="grid mt-2 mb-2">
								<FormField
									name="thumbnail"
									control={form.control}
									render={({ field, fieldState: { error } }) => (
										<FormItem className="flex flex-col items-start justify-start mt-1">
											<FormLabel>文章缩略图</FormLabel>
											<FormControl>
												<Input placeholder="请输入缩略图URL或上传图片" {...field} disabled={isSubmitting} />
											</FormControl>
											{/* 错误提醒 */}
											{error && <FormMessage>{error.message}</FormMessage>}
										</FormItem>
									)}
								/>
							</div>
							{/* 缩略图 */}

							{/* 状态开关 */}
							<div className="grid grid-cols-2 gap-4">
								<FormField
									name="is_published"
									control={form.control}
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
											<div className="space-y-0.5">
												<FormLabel className="text-base">发布状态</FormLabel>
												<p className="text-sm text-muted-foreground">立即发布或保存为草稿</p>
											</div>
											<FormControl>
												<Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									name="is_top"
									control={form.control}
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
											<div className="space-y-0.5">
												<FormLabel className="text-base">首页置顶</FormLabel>
												<p className="text-sm text-muted-foreground ">在首页顶部显示</p>
											</div>
											<FormControl>
												<Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
											</FormControl>
										</FormItem>
									)}
								/>

								<FormField
									name="is_featured"
									control={form.control}
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
											<div className="space-y-0.5">
												<FormLabel className="text-base">首页特推</FormLabel>
												<p className="text-sm text-muted-foreground">在首页特色区域显示</p>
											</div>
											<FormControl>
												<Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
											</FormControl>
										</FormItem>
									)}
								/>

								<FormField
									name="is_hot"
									control={form.control}
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
											<div className="space-y-0.5">
												<FormLabel className="text-base">热门文章</FormLabel>
												<p className="text-sm text-muted-foreground">标记为热门内容</p>
											</div>
											<FormControl>
												<Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
											</FormControl>
										</FormItem>
									)}
								/>
								{/* 是否归档 */}
								<FormField
									name="is_archive"
									control={form.control}
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
											<div className="space-y-0.5">
												<FormLabel className="text-base">归档</FormLabel>
												<p className="text-sm text-muted-foreground">标记为归档内容</p>
											</div>
											<FormControl>
												<Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* 操作按钮 */}

						<DialogFooter className="flex justify-end gap-3 pt-2 border-t absolute bottom-[80px] right-2">
							<Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
								取消
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? (
									<span className="flex items-center">提交中...</span>
								) : form.watch("is_published") ? (
									"发布文章"
								) : (
									"保存草稿"
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
const CreateArticleModalMemo = memo(CreateArticleModal);
export default CreateArticleModalMemo;
