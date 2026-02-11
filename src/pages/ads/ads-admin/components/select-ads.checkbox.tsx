import { useAds } from "@/hooks/use-ads";
import { Checkbox, Input, Spin } from "antd";
import debounce from "lodash/debounce";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

const { Search } = Input;

interface SelectAdsProps {
	value?: string[];
	onChange?: (selectedIds: string[]) => void;
	disabled?: boolean;
	allowClear?: boolean;
}

function SelectAds({ value = [], onChange, disabled = false, allowClear = true }: SelectAdsProps) {
	const { ads, loading, getAds, hasMore, loadMore } = useAds();
	const [selectedAds, setSelectedAds] = useState<string[]>(value);
	const [searchValue, setSearchValue] = useState<string>("");
	const [isFetchingMore, setIsFetchingMore] = useState(false);
	const fetchIdRef = useRef(0);
	const initializedRef = useRef(false);
	const pageSize = 20;

	// 初始化時獲取廣告列表
	// biome-ignore lint/correctness/useExhaustiveDependencies: 初次加載
	useEffect(() => {
		if (!initializedRef.current) {
			initializedRef.current = true;
			getAds({ keyword: "", page: 1, pageSize });
		}
	}, []);

	useEffect(() => {
		setSelectedAds(value);
	}, [value]);

	// 搜索防抖處理
	const debouncedSearch = useMemo(() => {
		return debounce(async (keyword: string) => {
			fetchIdRef.current += 1;
			await getAds({ keyword, page: 1, pageSize });
		}, 800);
	}, [getAds]);

	const handleSearch = (value: string) => {
		setSearchValue(value);
		debouncedSearch(value);
	};

	const handlePopupScroll = async (e: React.UIEvent<HTMLDivElement>) => {
		const { target } = e;
		if (target instanceof HTMLDivElement) {
			const { scrollTop, scrollHeight, clientHeight } = target;
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

	const handleSelectChange = useCallback(
		(id: string, checked: boolean) => {
			let newSelected: string[];

			if (checked) {
				newSelected = [...selectedAds, id];
			} else {
				newSelected = selectedAds.filter((item) => item !== id);
			}

			setSelectedAds(newSelected);
			onChange?.(newSelected);
		},
		[onChange, selectedAds],
	);

	const handleSelectAll = useCallback(
		(checked: boolean) => {
			if (checked) {
				const allIds = ads.map((ad) => ad.id);
				setSelectedAds(allIds);
				onChange?.(allIds);
			} else {
				setSelectedAds([]);
				onChange?.([]);
			}
		},
		[onChange, ads],
	);

	const handleClear = useCallback(() => {
		setSelectedAds([]);
		onChange?.([]);
		setSearchValue("");
		getAds({ keyword: "", page: 1, pageSize });
	}, [onChange, getAds]);

	const isAllSelected = ads.length > 0 && ads.every((ad) => selectedAds.includes(ad.id));
	const isIndeterminate = !isAllSelected && ads.some((ad) => selectedAds.includes(ad.id));
	const selectedCount = selectedAds.length;

	return (
		<div className="select-ads" style={{ width: "100%" }}>
			<div className="select-ads-header" style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
					<Checkbox
						checked={isAllSelected}
						indeterminate={isIndeterminate}
						onChange={(e) => handleSelectAll(e.target.checked)}
						disabled={disabled || ads.length === 0}
					>
						全選 ({selectedCount}/{ads.length})
					</Checkbox>
					{allowClear && selectedCount > 0 && (
						<button onClick={handleClear} style={{ fontSize: "12px", color: "#1890ff" }} type="button">
							清除選擇
						</button>
					)}
				</div>
				<Search
					placeholder="搜索廣告標題..."
					allowClear
					value={searchValue}
					onChange={(e) => handleSearch(e.target.value)}
					disabled={disabled}
					style={{ width: "100%" }}
				/>
			</div>

			<Spin spinning={loading}>
				<div
					className="select-ads-list"
					style={{
						maxHeight: "400px",
						overflowY: "auto",
						padding: "8px",
					}}
					onScroll={handlePopupScroll}
				>
					{ads.length === 0 ? (
						<div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
							{searchValue ? "沒有找到相關廣告" : "暫無廣告數據"}
						</div>
					) : (
						ads.map((ad) => (
							<div
								key={ad.id}
								className="select-ads-item"
								style={{
									display: "flex",
									alignItems: "center",
									padding: "8px 0",
									borderBottom: "1px solid #f5f5f5",
									cursor: "pointer",
								}}
								onClick={() => !disabled && handleSelectChange(ad.id, !selectedAds.includes(ad.id))}
							>
								<Checkbox
									checked={selectedAds.includes(ad.id)}
									onChange={(e) => {
										e.stopPropagation(); // 防止事件冒泡，避免触发外层容器的点击事件
										handleSelectChange(ad.id, e.target.checked);
									}}
									disabled={disabled}
									style={{ pointerEvents: "none" }} // 禁用复选框本身的点击事件，让它仅作为显示用途
								/>
								<div
									style={{
										flex: 1,
										paddingLeft: "8px",
										display: "flex",
										flexDirection: "column",
									}}
									onClick={(e) => {
										e.stopPropagation(); // 防止事件冒泡两次
										!disabled && handleSelectChange(ad.id, !selectedAds.includes(ad.id));
									}}
								>
									<span style={{ fontWeight: "500" }}>{ad.title || `廣告 ${ad.id}`}</span>
									{ad.shortDesc && (
										<span style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>
											{ad.shortDesc.length > 50 ? `${ad.shortDesc.substring(0, 50)}...` : ad.shortDesc}
										</span>
									)}
								</div>
							</div>
						))
					)}

					{hasMore && (
						<div
							style={{
								textAlign: "center",
								padding: "12px",
								borderTop: "1px solid #f0f0f0",
								marginTop: "8px",
							}}
						>
							{isFetchingMore ? <Spin size="small" /> : <span>滾動加載更多...</span>}
						</div>
					)}
				</div>
			</Spin>
		</div>
	);
}

export default memo(SelectAds);
