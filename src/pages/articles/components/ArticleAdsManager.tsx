import { reqArticleassignadvertisementtoarticlebypublicid } from "@/api/services";
import { reqAdvertisementgetarticleadvertisementsbypublicarticleid } from "@/api/services/advertise";
import SelectAds from "@/pages/ads/ads-admin/components/select-ads.checkbox";
import type { Advertisement } from "@/types";
import { Button, Divider, List, Tag, Typography } from "antd";
import { CheckIcon } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface ArticleAdsManagerProps {
	publicArticleId: string;
	articleTitle?: string;
	onClose?: () => void;
}

function ArticleAdsManagerNoMemo({ publicArticleId, articleTitle, onClose }: ArticleAdsManagerProps) {
	const [assignedAds, setAssignedAds] = useState<Advertisement[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const [selectedAdIds, setSelectedAdIds] = useState<string[]>([]);
	const getCurrentArticleAds = useCallback(() => {
		reqAdvertisementgetarticleadvertisementsbypublicarticleid(publicArticleId)
			.then((res) => {
				setAssignedAds(res || []);
				const initialSelectedIds = res.map((ad) => ad.id);
				setSelectedAdIds(initialSelectedIds);
				setLoading(false);
			})
			.catch((err) => {
				const errorMessage = "獲取文章廣告失敗";
				toast.error(errorMessage);
				console.error("獲取文章廣告失敗:", err);
			});
	}, [publicArticleId]);
	useEffect(() => {
		if (!publicArticleId) {
			return;
		}
		getCurrentArticleAds();
	}, [getCurrentArticleAds, publicArticleId]);

	const handleSaveAssignment = useCallback(async () => {
		try {
			setSaving(true);
			await reqArticleassignadvertisementtoarticlebypublicid(publicArticleId, {
				ids: selectedAdIds,
			});

			setAssignedAds((prev) => {
				return prev.filter((ad) => selectedAdIds.includes(ad.id));
			});

			toast.success("廣告分配已保存");
			getCurrentArticleAds();
			onClose?.();
		} catch (error) {
			toast.error("保存廣告分配失敗");
			console.error("保存廣告分配失敗:", error);
		} finally {
			setSaving(false);
		}
	}, [onClose, selectedAdIds, publicArticleId, getCurrentArticleAds]);

	return (
		<div className="article-ads-manager">
			<div className="header-section" style={{ marginBottom: "20px" }}>
				<Typography.Title level={4}>文章廣告管理: {articleTitle}</Typography.Title>
				<div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
					<Button onClick={onClose}>取消</Button>
					<Button type="primary" loading={saving} onClick={handleSaveAssignment}>
						保存更改
					</Button>
				</div>
			</div>

			<Divider orientation="left">已分配的廣告</Divider>
			<div className="assigned-ads-container">
				{loading ? (
					<div style={{ textAlign: "center", padding: "20px" }}>加載中...</div>
				) : assignedAds.length > 0 ? (
					<List
						dataSource={assignedAds}
						renderItem={(ad) => (
							<List.Item
								key={ad.id}
								actions={[
									<Tag color="success" key="status">
										已分配
									</Tag>,
								]}
							>
								<List.Item.Meta
									avatar={<CheckIcon style={{ fontSize: "20px", color: "#52c41a" }} />}
									title={ad.title || `廣告 ${ad.id}`}
									description={`ID: ${ad.id} | 重定向連接: ${ad.redirectUrl || "未指定"}`}
								/>
							</List.Item>
						)}
					/>
				) : (
					<div style={{ textAlign: "center", padding: "20px", color: "#bfbfbf" }}>此文章暫無分配廣告</div>
				)}
			</div>

			<Divider orientation="left">選擇要分配的廣告</Divider>
			<div className="select-ads-section">
				<SelectAds value={selectedAdIds} onChange={setSelectedAdIds} />
				<div style={{ marginTop: "10px", textAlign: "right" }}>
					<Typography.Text type="secondary">已選擇 {selectedAdIds.length} 個廣告</Typography.Text>
				</div>
			</div>
		</div>
	);
}

export default memo(ArticleAdsManagerNoMemo);
