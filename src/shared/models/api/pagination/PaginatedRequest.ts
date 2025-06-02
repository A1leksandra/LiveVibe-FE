export interface PaginatedRequest<TRequest> {
    page: number;
    pageSize: number;
    request: TRequest;
} 