import { UploadThumbnail } from "@/components/upload/upload-thumbnail";
import { GLOBAL_CONFIG } from "@/global-config";
import { useUserToken } from "@/store/userStore";
import { Radio } from "antd";
import { useState } from "react";

interface Props {
	value?: string;
	onChange?: (val: string) => void;
	disabled?: boolean;
	defaultMode?: "url" | "upload";
}

export function UploadThumbnailWithMode({ value, onChange, disabled, defaultMode = "url" }: Props) {
	const [mode, setMode] = useState<"url" | "upload">(defaultMode);
	const [thumbnail, setThumbnail] = useState(value);
	const accessToken = useUserToken().accessToken;
	const handleModeChange = (e: any) => {
		setMode(e.target.value);
		if (e.target.value === "url") {
			setThumbnail("");
			onChange?.("");
		}
	};
	const handleSuccessUpload = (url: string) => {
		setThumbnail(url);
		onChange?.(url);
	};
	return (
		<div className="flex flex-col gap-2 w-full">
			<Radio.Group onChange={handleModeChange} value={mode} disabled={disabled}>
				<Radio value="url">輸入URL</Radio>
				<Radio value="upload">上傳文件</Radio>
			</Radio.Group>

			{mode === "url" && (
				<input
					type="text"
					value={thumbnail}
					onChange={(e) => {
						setThumbnail(e.target.value);
						onChange?.(e.target.value);
					}}
					placeholder="請輸入圖片URL"
					disabled={disabled}
					className="border rounded px-2 py-1 w-3/4"
				/>
			)}

			{mode === "upload" && (
				<UploadThumbnail
					action={GLOBAL_CONFIG.uploadFileUrl}
					headers={{
						Authorization: `Bearer ${accessToken}`,
					}}
					defaultUrl={value}
					name="file"
					className="w-full"
					onSuccess={handleSuccessUpload}
				/>
			)}
		</div>
	);
}
