export type Category<T extends string | number = string | number> = {
	label: string;
	value: T;
};
