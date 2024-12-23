export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  meta?: {
    timestamp: string;
    path: string;
    [key: string]: any;
  };
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  error: {
    code: string;
    details?: any;
    stack?: string;
  };
  meta: {
    timestamp: string;
    path: string;
  };
}

export interface SuccessResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    timestamp: string;
    path: string;
    [key: string]: any;
  };
}
