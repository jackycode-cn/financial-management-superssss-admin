import type { CreateArticleDto, TagDto } from "@/types/api/output.d.ts";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form";
import { Input } from "@/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Switch } from "@/ui/switch";
import { Textarea } from "@/ui/textarea";
import { optionalUrl } from "@/utils/zod.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import MyTags from "../../../components/Tags/my-tags";

const articleSchema = z.object({
	title: z.string().min(3, "標題至少3個字符").max(100, "標題最多100個字符"),
	slug: z
		.string()
		.min(3, "Slug至少3個字符")
		.max(50, "Slug最多50個字符")
		.regex(/^[a-z0-9-]+$/, "Slug只能包含小寫英文字符、數字和短橫線"),
	description: z.string().max(200, "描述最多200個字符").optional(),
	content: z.string().optional(),
	category_id: z.number().optional(),
	seo_title: z.string().max(60, "SEO標題最多60個字符").optional(),
	seo_description: z.string().max(160, "SEO描述最多160個字符").optional(),
	seo_keywords: z.string().max(100, "SEO關鍵詞最多100個字符").optional(),
	is_archive: z.boolean().optional(),
	is_top: z.boolean().optional(),
	is_featured: z.boolean().optional(),
	is_hot: z.boolean().optional(),
	is_published: z.boolean().optional(),
	is_external: z.boolean().optional(),
	external_url: optionalUrl(),
	external_author: z.string().max(50, "外部作者最多50個字符").optional(),

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
	tags: z
		.array(
			z.object({
				name: z.string().max(20, "標籤最多20個字符"),
				slug: z
					.string()
					.min(3, "Slug至少3個字符")
					.max(50, "Slug最多50個字符")
					.regex(/^[a-z0-9-]+$/, "Slug只能包含小寫英文字符、數字和短橫線")

					.nullable()
					.optional(),
			}),
		)
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
	description = "articleModal.fields.descriptionPlaceholder",
	categories,
}: CreateArticleModalProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [_error, setError] = useState<string | null>(null);
	const { t } = useTranslation();
	const form = useForm<FormValues>({
		defaultValues: formValue as FormValues,
		resolver: zodResolver(articleSchema.strip()),
		mode: "onChange",
	});
	const handleSubmit = useCallback(
		async (values: FormValues) => {
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
		},
		[onSubmit, onCancel],
	);
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

	const changeTags = useCallback(
		(tags: string[]) => {
			form.setValue(
				"tags",
				tags.map((tag) => ({ name: tag })),
			);
		},
		[form],
	);
	return useMemo(
		() => (
			<Dialog open={show} onOpenChange={onCancel}>
				<DialogContent className="sm:max-w-[600px] h-[80vh] ">
					<DialogHeader className="h-[60px]">
						<DialogTitle>
							{type === "create" ? title || t("articleModal.createTitle") : title || t("articleModal.editTitle")}
						</DialogTitle>
						<DialogDescription>{t(description)}</DialogDescription>
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
													{t("articleModal.fields.title")} <span className="text-red-500">*</span>
												</FormLabel>
												<FormControl>
													<Input
														placeholder={t("articleModal.fields.titlePlaceholder")}
														{...field}
														disabled={isSubmitting}
													/>
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
													{t("articleModal.fields.slug")} <span className="text-red-500">*</span>
												</FormLabel>
												<FormControl>
													<Input
														placeholder={t("articleModal.fields.slugPlaceholder")}
														{...field}
														disabled={isSubmitting}
													/>
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
												<FormLabel>{t("articleModal.fields.category")}</FormLabel>
												<Select
													disabled={isSubmitting}
													onValueChange={(value) => field.onChange(Number(value))}
													defaultValue={field.value?.toString()}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder={t("articleModal.fields.categoryPlaceholder")} />
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
												<FormLabel>{t("articleModal.fields.description")}</FormLabel>
												<FormControl>
													<Textarea
														placeholder={t("articleModal.fields.descriptionPlaceholder")}
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
												<FormLabel className="text-base">{t("articleModal.fields.externalArticle")}</FormLabel>
												<p className="text-sm text-muted-foreground">{t("articleModal.fields.externalArticleDesc")}</p>
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
														{t("articleModal.fields.externalUrl")} <span className="text-red-500">*</span>
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
													<FormLabel>{t("articleModal.fields.externalAuthor")}</FormLabel>
													<FormControl>
														<Input
															placeholder={t("articleModal.fields.externalAuthorPlaceholder")}
															{...field}
															disabled={isSubmitting}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>
								)}

								{/* SEO设置 */}
								<div className="border rounded-lg p-4 space-y-4">
									<h3 className="text-lg font-medium">{t("articleModal.fields.seoTitle")}</h3>

									<FormField
										name="seo_title"
										control={form.control}
										render={({ field, fieldState: { error } }) => (
											<FormItem>
												<FormLabel>{t("articleModal.fields.seoTitle")}</FormLabel>
												<FormControl>
													<Input
														placeholder={t("articleModal.fields.seoTitlePlaceholder")}
														{...field}
														disabled={isSubmitting}
													/>
												</FormControl>
												{error && <FormMessage>{error.message}</FormMessage>}
												<p className="text-xs text-muted-foreground mt-1">{t("articleModal.validation.seoTitleMax")}</p>
											</FormItem>
										)}
									/>

									<FormField
										name="seo_description"
										control={form.control}
										render={({ field, fieldState: { error } }) => (
											<FormItem>
												<FormLabel>{t("articleModal.fields.seoDescription")}</FormLabel>
												<FormControl>
													<Textarea
														placeholder={t("articleModal.fields.seoDescriptionPlaceholder")}
														{...field}
														disabled={isSubmitting}
													/>
												</FormControl>
												{error && <FormMessage>{error.message}</FormMessage>}
												<p className="text-xs text-muted-foreground mt-1">
													{t("articleModal.validation.seoDescriptionMax")}
												</p>
											</FormItem>
										)}
									/>

									<FormField
										name="seo_keywords"
										control={form.control}
										render={({ field, fieldState: { error } }) => (
											<FormItem>
												<FormLabel>{t("articleModal.fields.seoKeywords")}</FormLabel>
												<FormControl>
													<Input
														placeholder={t("articleModal.fields.seoKeywordsPlaceholder")}
														{...field}
														disabled={isSubmitting}
													/>
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
												<FormLabel>{t("articleModal.fields.thumbnail")}</FormLabel>
												<FormControl>
													<Input
														placeholder={t("articleModal.fields.thumbnailPlaceholder")}
														{...field}
														disabled={isSubmitting}
													/>
												</FormControl>
												{/* 错误提醒 */}
												{error && <FormMessage>{error.message}</FormMessage>}
											</FormItem>
										)}
									/>
								</div>
								<div className="grid mt-2 mb-2">
									<FormField
										name="tags"
										render={({ field, fieldState: { error } }) => {
											const tags: string[] = field.value.map((tag: TagDto) => tag.name);
											return (
												<FormItem>
													<FormLabel>{t("articleModal.fields.tags")}</FormLabel>
													<FormControl>
														<MyTags tags={tags} onChange={changeTags} />
													</FormControl>
													{error && <FormMessage>{error.message}</FormMessage>}
												</FormItem>
											);
										}}
									/>
								</div>

								{/* 状态开关 */}
								<div className="grid grid-cols-2 gap-4">
									<FormField
										name="is_published"
										control={form.control}
										render={({ field }) => (
											<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
												<div className="space-y-0.5">
													<FormLabel className="text-base">{t("articleModal.fields.isPublished")}</FormLabel>
													<p className="text-sm text-muted-foreground">{t("articleModal.fields.isPublishedDesc")}</p>
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
													<FormLabel className="text-base">{t("articleModal.fields.isTop")}</FormLabel>
													<p className="text-sm text-muted-foreground ">{t("articleModal.fields.isTopDesc")}</p>
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
													<FormLabel className="text-base">{t("articleModal.fields.isFeatured")}</FormLabel>
													<p className="text-sm text-muted-foreground">{t("articleModal.fields.isFeaturedDesc")}</p>
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
													<FormLabel className="text-base">{t("articleModal.fields.isHot")}</FormLabel>
													<p className="text-sm text-muted-foreground">{t("articleModal.fields.isHotDesc")}</p>
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
													<FormLabel className="text-base">{t("articleModal.fields.isArchive")}</FormLabel>
													<p className="text-sm text-muted-foreground">{t("articleModal.fields.isArchiveDesc")}</p>
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
									{t("articleModal.buttons.cancel")}
								</Button>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? (
										<span className="flex items-center">{t("articleModal.buttons.submitting")}</span>
									) : form.watch("is_published") ? (
										t("articlePage.publishLabel")
									) : (
										t("articleModal.buttons.saveDraft")
									)}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		),
		[show, onCancel, form, t, categories, isSubmitting, title, type, description, handleSubmit, isExternal, changeTags],
	);
}
const CreateArticleModalMemo = memo(CreateArticleModal);
export default CreateArticleModalMemo;
