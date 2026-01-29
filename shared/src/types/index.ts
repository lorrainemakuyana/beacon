// User types
export * from './user';

// Event types
export * from './event';

// Shift types
export * from './shift';

// Attendance types
export * from './attendance';

// Incident types
export * from './incident';

// Notification types
export * from './notification';

// Organization types
export * from './organization';

// Common utility types
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
