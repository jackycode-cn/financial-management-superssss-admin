import { t } from "@/locales/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/ui/select";
import type { FC } from "react";

interface StatusFilterSelectProps {
	label: string;
	value: boolean | undefined;
	onChange: (value: boolean | undefined) => void;
	trueLabel?: string; // 显示 true 时的文案
	falseLabel?: string; // 显示 false 时的文案
}

/**
 * 通用三态下拉筛选组件
 * - undefined = 全部
 * - true = 是
 * - false = 否
 */
const StatusFilterSelect: FC<StatusFilterSelectProps> = ({
	label,
	value,
	onChange,
	trueLabel = "true",
	falseLabel = "false",
}) => {
	return (
		<Select
			value={value === undefined ? "2" : value ? "1" : "0"}
			onValueChange={(val) => onChange(val === "2" ? undefined : val === "1")}
		>
			<SelectTrigger size="default">{value === undefined ? label : value ? trueLabel : falseLabel}</SelectTrigger>
			<SelectContent>
				<SelectItem value="2">{t("common.all")}</SelectItem>
				<SelectItem value="0">{falseLabel}</SelectItem>
				<SelectItem value="1">{trueLabel}</SelectItem>
			</SelectContent>
		</Select>
	);
};

export default StatusFilterSelect;
