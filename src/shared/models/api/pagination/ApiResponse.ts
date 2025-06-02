export interface ErrorResponse {
    message: string;
    code?: number;
}

export interface ApiResponse<T> {
    isSuccess: boolean;
    data?: T;
    error?: ErrorResponse;
} 