import { isAxiosError } from 'axios';
import { ApiResponse, ErrorResponse } from './models/api/pagination/ApiResponse';
import { PagedResponse } from './models/api/pagination/PagedResponse';
import { PaginatedRequest } from './models/api/pagination/PaginatedRequest';
import axios from './axios';

export const api = {
    get: async <TResponse>(url: string, params?: any, queryParams?: any): Promise<ApiResponse<TResponse>> => {
        try {
            let resultUrl = url;

            if (queryParams) {
                const query = new URLSearchParams(queryParams);
                resultUrl = resultUrl + '?' + query.toString();
            }
            console.log('resultUrl', axios.defaults.baseURL + resultUrl);
            const response = await axios.get<TResponse>(resultUrl, { params: params });

            return { isSuccess: true, data: response.data };
        }
        catch (error) {
            return handleError(error);
        }
    },

    getPaginated: async <TResponse>(url: string, pagination: PaginatedRequest<any>): Promise<ApiResponse<PagedResponse<TResponse>>> => {
        try {
            const response = await axios.get<PagedResponse<TResponse>>(url, {
                params: {
                    ...pagination,
                    ...pagination.request
                }
            });
            return { isSuccess: true, data: response.data };
        }
        catch (error) {
            return handleError(error);
        }
    },

    postPaginated: async <TRequest, TResponse>(url: string, request: PaginatedRequest<TRequest>): Promise<ApiResponse<PagedResponse<TResponse>>> => {
        try {
            const queryParams = new URLSearchParams({ page: request.pageNumber.toString(), pageSize: request.pageSize.toString() });

            const response = await axios.post<PagedResponse<TResponse>>(url + '?' + queryParams.toString(), request.request);
            return { isSuccess: true, data: response.data };
        }
        catch (error) {
            return handleError(error);
        }
    },


    post: async <TRequest, TResponse>(url: string, request: TRequest, headers?: { [key: string]: string }): Promise<ApiResponse<TResponse>> => {
        try {
            const response = await axios.post<TResponse>(url, request, {
                headers: headers
            });
            return { isSuccess: true, data: response.data };
        }
        catch (error) {
            return handleError(error);
        }
    },

    put: async <TRequest, TResponse>(url: string, request: TRequest): Promise<ApiResponse<TResponse>> => {
        try {
            const response = await axios.put<TResponse>(url, request);
            return { isSuccess: true, data: response.data };
        }
        catch (error) {
            return handleError(error);
        }
    },

    delete: async (url: string): Promise<ApiResponse<{}>> => {
        try {
            await axios.delete(url);
            return { isSuccess: true };
        }
        catch (error) {
            return handleError(error);
        }
    }
};

const handleError = <T>(error: any): ApiResponse<T> => {
    console.error("API Error:", error);

    if (isAxiosError(error)) {
        const response = error.response;
        const request = error.request;

        // Handle HTTP errors (4xx, 5xx)
        if (response) {
            const statusCode = response.status;
            const errorData = response.data;

            console.error(`HTTP Error ${statusCode}:`, errorData);

            // Try to extract error information from response
            let baseError: ErrorResponse;

            if (errorData && typeof errorData === 'object') {
                // If the response contains structured error data
                baseError = {
                    code: statusCode,
                    message: errorData.message || errorData.error || getDefaultErrorMessage(statusCode)
                };
            } else {
                // Fallback for non-structured error responses
                baseError = {
                    code: statusCode,
                    message: typeof errorData === 'string' ? errorData : getDefaultErrorMessage(statusCode)
                };
            }

            return { isSuccess: false, error: baseError };
        }

        // Handle network errors (no response received)
        if (request) {
            console.error("Network Error - No response received:", request);
            return {
                isSuccess: false,
                error: {
                    code: 0,
                    message: "Network Error: No response received from server. Please check your internet connection."
                }
            };
        }

        // Handle request setup errors
        console.error("Request Setup Error:", error.message);
        return {
            isSuccess: false,
            error: {
                code: -1,
                message: error.message || "Request Error: An error occurred while setting up the request"
            }
        };
    }

    // Handle non-Axios errors
    console.error("Unexpected Error:", error);
    return {
        isSuccess: false,
        error: {
            code: -1,
            message: error?.message || "Unexpected Error: An unexpected error occurred"
        }
    };
};

const getDefaultErrorMessage = (statusCode: number): string => {
    switch (statusCode) {
        case 400:
            return "Bad Request - The request was invalid";
        case 401:
            return "Unauthorized - Authentication required";
        case 403:
            return "Forbidden - Access denied";
        case 404:
            return "Not Found - The requested resource was not found";
        case 409:
            return "Conflict - The request conflicts with current state";
        case 422:
            return "Validation Error - The request data is invalid";
        case 429:
            return "Too Many Requests - Rate limit exceeded";
        case 500:
            return "Internal Server Error - Something went wrong on the server";
        case 502:
            return "Bad Gateway - Server received invalid response";
        case 503:
            return "Service Unavailable - Server temporarily unavailable";
        case 504:
            return "Gateway Timeout - Server response timeout";
        default:
            if (statusCode >= 400 && statusCode < 500) {
                return `Client Error (${statusCode})`;
            } else if (statusCode >= 500) {
                return `Server Error (${statusCode})`;
            }
            return `HTTP Error (${statusCode})`;
    }
};

export default api; 