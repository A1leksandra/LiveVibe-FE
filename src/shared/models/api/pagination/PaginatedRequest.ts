export interface PaginatedRequest<TRequest> {
    pageNumber: number;
    pageSize: number;
    request: TRequest;
} 