import type { AttributeDef, EntityAttributeValue } from "#/api";
import {
	reqEavbulkcreateorupdate,
	reqEavfindbyentity,
	reqEavfindbyentitytypeid,
	reqEavremoveentityattributevalue,
} from "@/api/services/EAV";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useState } from "react";

interface UseEntityAttributeValuesParams {
	/**
	 * 实体类型ID
	 */
	entityTypeId?: string;
	/**
	 * 實體類型的Code碼
	 */
	entityTypeCode?: string;
	/**
	 * 实体ID
	 */
	entityId?: string | null;
	/**
	 * 是否禁用编辑
	 */
	disabled?: boolean;
}

export interface UseEntityAttributeValuesReturn {
	// 属性定义相关
	attributeDefs: AttributeDef[] | undefined;
	attributeDefsLoading: boolean;
	refetchAttributeDefs: () => void;

	// 实体属性值相关
	entityValues: EntityAttributeValue[] | undefined;
	entityValuesLoading: boolean;
	refetchEntityValues: () => void;

	// 数据变更操作
	deleteValue: (id: string) => void;
	bulkUpdateValues: (
		entityTypeId: string,
		entityId: string,
		values: Array<{ attrDefId: string; attrValue?: string }>,
	) => void;

	// 加载状态
	isDeleting: boolean;
	isBulkUpdating: boolean;
}

export const useEntityAttributeValues = ({
	entityTypeId,
	entityId,
	entityTypeCode = "advertisement",
	disabled = false,
}: UseEntityAttributeValuesParams): UseEntityAttributeValuesReturn => {
	const queryClient = useQueryClient();
	const [currentEntityTypeId, setCurrentEntityTypeId] = useState(entityTypeId);
	// 查询属性定义列表
	const {
		data: attributeDefs,
		isLoading: attributeDefsLoading,
		refetch: refetchAttributeDefs,
	} = useQuery({
		queryKey: ["attributeDefs", entityTypeCode || entityTypeId],
		queryFn: async () => {
			const keyword = entityTypeId || entityTypeCode;
			if (!keyword) {
				return Promise.resolve([]);
			}
			const type = entityTypeId ? "entityTypeId" : "entityTypeCode";
			const result = await reqEavfindbyentitytypeid(keyword, type);
			if (result && result.length > 0) {
				const item = result[0];
				if (item.entityTypeId) {
					setCurrentEntityTypeId(item.entityTypeId);
				}
			}
			return result;
		},
		enabled: !!entityTypeCode || !!entityTypeId,
	});

	// 查询实体属性值
	const {
		data: entityValues,
		isLoading: entityValuesLoading,
		refetch: refetchEntityValues,
	} = useQuery({
		queryKey: ["entityAttributeValues", entityTypeCode || entityTypeId, entityId],
		queryFn: () => {
			if (!entityId) {
				return Promise.resolve([]);
			}

			return reqEavfindbyentity({
				entityTypeId: currentEntityTypeId,
				entityId,
			});
		},
		enabled: (!!entityTypeCode || !!entityTypeId) && !!entityId,
	});

	// 批量创建或更新属性值的mutation
	const bulkUpdateMutation = useMutation({
		mutationFn: (data: Parameters<typeof reqEavbulkcreateorupdate>[0]) => reqEavbulkcreateorupdate(data),
		onSuccess: (_, variables) => {
			refetchEntityValues();
		},
		onError: (error: any) => {},
	});

	// 删除属性值
	const deleteMutation = useMutation({
		mutationFn: (id: string) => reqEavremoveentityattributevalue(id),
		onSuccess: () => {
			message.success("属性值删除成功");
			refetchEntityValues();
		},
		onError: (error: any) => {
			message.error(`删除失败: ${error.message}`);
		},
	});

	return {
		// 属性定义相关
		attributeDefs,
		attributeDefsLoading,
		refetchAttributeDefs,

		// 实体属性值相关
		entityValues,
		entityValuesLoading,
		refetchEntityValues,

		// 数据变更操作
		deleteValue: deleteMutation.mutate,
		bulkUpdateValues: (
			entityTypeId: string,
			entityId: string,
			values: Array<{ attrDefId: string; attrValue?: string }>,
		) => {
			bulkUpdateMutation.mutate({
				entityTypeId: currentEntityTypeId || entityTypeId,
				entityId,
				values,
			});
		},

		// 加载状态
		isDeleting: deleteMutation.isPending,
		isBulkUpdating: bulkUpdateMutation.isPending,
	};
};
