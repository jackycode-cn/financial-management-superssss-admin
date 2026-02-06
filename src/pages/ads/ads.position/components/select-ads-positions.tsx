import { useAdPositions } from "@/hooks/admin/ads-positions";
import { Select, Spin } from "antd";
import type { SelectProps } from "antd/es/select";
import debounce from "lodash/debounce";
import { useEffect, useMemo, useRef, useState } from "react";

export interface SelectAdsPositionsProps extends Omit<SelectProps, "options" | "loading"> {
	placeholder?: string;
	onSelect?: (value: string) => void;
	value?: string;
	onChange?: (value: string) => void;
	disabled?: boolean;
	allowClear?: boolean;
	showSearch?: boolean;
	pageSize?: number;
}

function SelectAdsPositions({
	placeholder = "請選擇廣告位置",
	onSelect,
	value,
	onChange,
	disabled = false,
	allowClear = true,
	showSearch = true,
	pageSize = 20,
	...restProps
}: SelectAdsPositionsProps) {
	const { positions, loading, getPositions, hasMore, loadMore } = useAdPositions();
	const [searchValue, setSearchValue] = useState<string>("");
	const [isFetchingMore, setIsFetchingMore] = useState(false);
	const fetchIdRef = useRef(0);
	const initializedRef = useRef(false);

	// 初始化時加載廣告位置數據
	// biome-ignore lint/correctness/useExhaustiveDependencies: 初始的時候請求一次
	useEffect(() => {
		if (!initializedRef.current) {
			initializedRef.current = true;
			getPositions({ keyword: "", page: 1, pageSize });
		}
	}, []);

	// 搜索防抖處理 - 這裡創建一個新的防抖函數，防止在組件重渲染時重新創建
	const debouncedFetch = useMemo(() => {
		return debounce(async (value: string) => {
			fetchIdRef.current += 1;

			// 每次搜索都重置到第一页
			await getPositions({ keyword: value, page: 1, pageSize });
		}, 800); // 增加防抖延遲時間，減少請求頻率
	}, [getPositions, pageSize]);

	const handleSearch = (value: string) => {
		setSearchValue(value);
		// 只有當搜索值發生變化時才執行搜索
		if (value !== searchValue) {
			debouncedFetch(value);
		}
	};

	const handlePopupScroll = async (e: React.UIEvent<HTMLDivElement>) => {
		const { target } = e;
		if (target instanceof HTMLDivElement) {
			const { scrollTop, scrollHeight, clientHeight } = target;
			// 當滾動到底部時加載更多，添加額外的保護措施
			if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading && !isFetchingMore) {
				setIsFetchingMore(true);
				try {
					await loadMore();
				} finally {
					setIsFetchingMore(false);
				}
			}
		}
	};

	// 構建選項
	const options = positions.map((position) => ({
		value: position.id,
		label: position.name || position.id,
		description: position.description,
	}));

	// 自定義下拉選單渲染
	const dropdownRender: SelectProps["dropdownRender"] = (menu) => (
		<>
			{menu}
			{hasMore && (
				<div
					style={{
						textAlign: "center",
						padding: "8px",
						borderTop: "1px solid #f0f0f0",
					}}
				>
					{isFetchingMore ? <Spin size="small" /> : <span>滾動加載更多...</span>}
				</div>
			)}
		</>
	);

	return (
		<Select
			showSearch={showSearch}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			onSearch={handleSearch}
			onSelect={onSelect}
			onPopupScroll={handlePopupScroll}
			options={options}
			loading={loading}
			disabled={disabled}
			allowClear={allowClear}
			filterOption={false}
			dropdownRender={dropdownRender}
			{...restProps}
		/>
	);
}

export default SelectAdsPositions;
