import { apiClient } from "../apiClient";

import type {
	AttributeDef,
	CreateAttributeDefDto,
	CreateEntityAttributeValueDto,
	CreateEntityTypeDto,
	EntityAttributeValue,
	EntityType,
	Reqeavfindallattributedefsquery,
	Reqeavfindallentitytypesquery,
	Reqeavfindbyentityquery,
	UpdateAttributeDefDto,
	UpdateEntityAttributeValueDto,
	UpdateEntityTypeDto,
} from "#/api";
import type { MyPaginationResponse } from "@/types";

/**
 *創建實體類型
 */
export async function reqEavcreateentitytype(data: CreateEntityTypeDto): Promise<EntityType> {
	return await apiClient.post("/api/eav/entity-types", data);
}

/**
 *查詢實體類型列表
 */
export async function reqEavfindallentitytypes(
	query: Reqeavfindallentitytypesquery,
): Promise<MyPaginationResponse<EntityType>> {
	return await apiClient.get("/api/eav/entity-types", {
		params: query,
	});
}

/**
 *查詢單個實體類型
 */
export async function reqEavfindoneentitytype(id: string): Promise<EntityType> {
	return await apiClient.get(`/api/eav/entity-types/${id}`);
}

/**
 *更新實體類型
 */
export async function reqEavupdateentitytype(id: string, data: UpdateEntityTypeDto): Promise<EntityType> {
	return await apiClient.patch(`/api/eav/entity-types/${id}`, data);
}

/**
 *刪除實體類型
 */
export async function reqEavremoveentitytype(id: string): Promise<string> {
	return await apiClient.delete(`/api/eav/entity-types/${id}`);
}

/**
 *創建屬性定義
 */
export async function reqEavcreateattributedef(data: CreateAttributeDefDto): Promise<AttributeDef> {
	return await apiClient.post("/api/eav/attribute-defs", data);
}

/**
 *查詢所有屬性定義
 */
export async function reqEavfindallattributedefs(
	query: Reqeavfindallattributedefsquery,
): Promise<MyPaginationResponse<AttributeDef>> {
	return await apiClient.get("/api/eav/attribute-defs", {
		params: query,
	});
}

/**
 *根據實體類型查詢屬性定義
 */
export async function reqEavfindbyentitytypeid(
	entityTypeId: string,
	type?: "entityTypeId" | "entityTypeCode",
): Promise<AttributeDef[]> {
	return await apiClient.get(`/api/eav/attribute-defs/entity-type/${entityTypeId}`, {
		params: {
			type,
		},
	});
}

/**
 *查詢單個屬性定義
 */
export async function reqEavfindoneattributedef(id: string): Promise<AttributeDef> {
	return await apiClient.get(`/api/eav/attribute-defs/${id}`);
}

/**
 *更新屬性定義
 */
export async function reqEavupdateattributedef(id: string, data: UpdateAttributeDefDto): Promise<AttributeDef> {
	return await apiClient.patch(`/api/eav/attribute-defs/${id}`, data);
}

/**
 *刪除屬性定義
 */
export async function reqEavremoveattributedef(id: string): Promise<string> {
	return await apiClient.delete(`/api/eav/attribute-defs/${id}`);
}

/**
 *創建實體屬性值
 */
export async function reqEavcreateentityattributevalue(
	data: CreateEntityAttributeValueDto,
): Promise<EntityAttributeValue> {
	return await apiClient.post("/api/eav/entity-attribute-values", data);
}

/**
 *批量創建或更新實體屬性值
 */
export async function reqEavbulkcreateorupdate(): Promise<EntityAttributeValue[]> {
	return await apiClient.post("/api/eav/entity-attribute-values/bulk");
}

/**
 *根據實體查詢屬性值
 */
export async function reqEavfindbyentity(query: Reqeavfindbyentityquery): Promise<EntityAttributeValue[]> {
	return await apiClient.get("/api/eav/entity-attribute-values/entity", {
		params: query,
	});
}

/**
 *查詢單個實體屬性值
 */
export async function reqEavfindoneentityattributevalue(id: string): Promise<EntityAttributeValue> {
	return await apiClient.get(`/api/eav/entity-attribute-values/${id}`);
}

/**
 *更新實體屬性值
 */
export async function reqEavupdateentityattributevalue(
	id: string,
	data: UpdateEntityAttributeValueDto,
): Promise<EntityAttributeValue> {
	return await apiClient.patch(`/api/eav/entity-attribute-values/${id}`, data);
}

/**
 *刪除實體屬性值
 */
export async function reqEavremoveentityattributevalue(id: string): Promise<string> {
	return await apiClient.delete(`/api/eav/entity-attribute-values/${id}`);
}

/**
 *刪除實體的所有屬性值
 */
export async function reqEavremovebyentity(entityTypeId: string, entityId: string): Promise<string> {
	return await apiClient.delete(`/api/eav/entity-attribute-values/entity/${entityTypeId}/${entityId}`);
}
