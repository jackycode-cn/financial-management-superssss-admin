import type { FieldError } from "react-hook-form";

interface FormErrorMessageProps {
	error?: FieldError;
}

export function FormErrorMessage({ error }: FormErrorMessageProps) {
	if (!error) return null;

	return <span className="text-red-500 text-sm">{error.message}</span>;
}
