import type { ResultStatus } from "../enum";

export interface ApiResponse<T = unknown> {
	status: ResultStatus;
	message: string;
	data: T;
}
