import { reqFileuploadfile } from "@/api/services/Fileupload";
import type { UploadProps } from "antd";
import { toast } from "sonner";

export const customRequest: UploadProps["customRequest"] = ({ file, onSuccess, onError }) => {
	reqFileuploadfile(file as File | Blob)
		.then((data) => {
			if (data?.accessUrl) {
				if (onSuccess) {
					onSuccess(data.accessUrl);
				}
			} else {
				throw new Error("上傳失敗");
			}
		})
		.catch((err) => {
			toast.error(err.message || "上傳失敗");
		});
};
