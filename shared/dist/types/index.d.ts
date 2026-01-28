export * from './user';
export * from './event';
export * from './shift';
export * from './attendance';
export * from './incident';
export * from './notification';
export * from './organization';
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface PaginatedResponse<T = any> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}
export interface FirebaseError {
    code: string;
    message: string;
}
