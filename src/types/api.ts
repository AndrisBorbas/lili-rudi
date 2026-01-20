// Form data types
export type Attendee = {
	name: string;
	age: number | "";
	allergy?: string;
	hasAllergy?: boolean;
};

export type FormData = {
	email: string;
	name: string;
	attendance: "yes" | "no";
	attendees: Attendee[];
	comment: string;
};

// API response types
export type ApiSuccessResponse<T = unknown> = {
	success: true;
	data: T;
	message?: string;
};

export type ApiErrorResponse = {
	success: false;
	message: string;
	errors?: unknown;
};

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// Specific endpoint responses
export type SubmitResponseSuccess = {
	success: true;
	message: string;
};

export type GetResponseSuccess = ApiSuccessResponse<FormData>;
