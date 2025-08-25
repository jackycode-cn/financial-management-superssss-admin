import { Icon } from "@/components/icon";
import { themeVars } from "@/theme/theme.css";
import type { CustomResponse, UploadImageFileEntity } from "@/types";
import { Text } from "@/ui/typography";
import { fBytes } from "@/utils/format-number";
import { Upload } from "antd";
import type { UploadChangeParam, UploadFile, UploadProps } from "antd/es/upload";
import { useState } from "react";
import { toast } from "sonner";
import { StyledUpload } from "./styles";
import { beforeAvatarUpload } from "./utils";

interface ThumbnailUploadProps extends UploadProps {
	defaultUrl?: string;
	helperText?: React.ReactNode;
	maxSize?: number;
	allowedTypes?: string[];
	onSuccess?: (url: string) => void;
}

export function UploadThumbnail({
	defaultUrl = "",
	helperText,
	maxSize = 2, // 默认 2MB
	allowedTypes = ["image/jpeg", "image/png", "image/gif"],
	onSuccess,
	...other
}: ThumbnailUploadProps) {
	const [imageUrl, setImageUrl] = useState<string>(defaultUrl);
	const [isHover, setIsHover] = useState(false);

	const handleHover = (hover: boolean) => setIsHover(hover);

	const handleChange: UploadProps["onChange"] = (
		info: UploadChangeParam<UploadFile<CustomResponse<UploadImageFileEntity>>>,
	) => {
		if (info.file.status === "uploading") return;
		if (info.file.status === "done") {
			const { data } = info.file.response as CustomResponse<UploadImageFileEntity>;
			if (data) {
				setImageUrl(data?.tempAccessUrl || data.accessUrl || "");
				onSuccess?.(data?.tempAccessUrl || data.accessUrl || "");
			}
		} else if (info.file.status === "error") {
			setImageUrl("");
			toast.error(info.file.error?.message || "上傳失敗");
		}
	};

	const renderPreview = imageUrl ? (
		<img src={imageUrl} alt="thumbnail" className="absolute rounded-md object-cover" />
	) : null;

	const renderPlaceholder = (
		<div
			style={{
				backgroundColor: !imageUrl || isHover ? themeVars.colors.background.neutral : "transparent",
			}}
			className="absolute z-10 flex h-full w-full flex-col items-center justify-center"
		>
			<Icon icon="solar:camera-add-bold" size={24} />
			<div className="mt-1 text-xs">上傳</div>
		</div>
	);

	const defaultHelperText = (
		<Text variant="caption" color="secondary">
			允許類型: {allowedTypes.join(", ")} <br /> 最大大小: {fBytes(maxSize * 1024 * 1024)}
		</Text>
	);

	return (
		<StyledUpload $thumbnail={true}>
			<Upload
				name="thumbnail"
				showUploadList={false}
				listType="picture-card"
				className="thumbnail-uploader flex items-center justify-center"
				beforeUpload={(file) => beforeAvatarUpload(file)}
				onChange={handleChange}
				{...other}
			>
				<div
					className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-md"
					onMouseEnter={() => handleHover(true)}
					onMouseLeave={() => handleHover(false)}
				>
					{renderPreview}
					{!imageUrl || isHover ? renderPlaceholder : null}
				</div>
			</Upload>
			<div className="text-center">{helperText || defaultHelperText}</div>
		</StyledUpload>
	);
}
