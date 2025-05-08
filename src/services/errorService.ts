import axios, { AxiosError } from 'axios';

export interface ErrorReport {
  message: string;
  stack?: string;
  info?: any;
  errorCode?: string;
  context?: Record<string, any>;
  timestamp: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ApiErrorResponse {
  status: 'error' | 'failure';
  errorCode: string;
  message: string;
  details?: Record<string, any>;
}

export interface NormalizedError {
  message: string;
  errorCode?: string;
  details?: Record<string, any>;
  originalError: any;
  context?: Record<string, any>;
  stack?: string;
}

const ERROR_CODES = {
  NETWORK_ERROR: 'ERR_NETWORK',
  TIMEOUT_ERROR: 'ERR_TIMEOUT',
  VALIDATION_ERROR: 'ERR_VALIDATION',
  AUTHENTICATION_ERROR: 'ERR_AUTH',
  AUTHORIZATION_ERROR: 'ERR_FORBIDDEN',
  NOT_FOUND_ERROR: 'ERR_NOT_FOUND',
  SERVER_ERROR: 'ERR_SERVER',
  UNKNOWN_ERROR: 'ERR_UNKNOWN'
} as const;

export function normalizeError(error: any, context?: Record<string, any>): NormalizedError {
  const normalized: NormalizedError = {
    message: 'An unexpected error occurred',
    errorCode: ERROR_CODES.UNKNOWN_ERROR,
    originalError: error,
    context
  };

  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    
    if (!axiosError.response) {
      // Network error
      normalized.message = 'Network error occurred. Please check your connection.';
      normalized.errorCode = ERROR_CODES.NETWORK_ERROR;
    } else {
      // API error response
      const apiError = axiosError.response.data;
      normalized.message = apiError?.message || axiosError.message;
      normalized.errorCode = apiError?.errorCode;
      normalized.details = apiError?.details;
    }
  } else if (error instanceof Error) {
    // Standard JavaScript Error
    normalized.message = error.message;
    normalized.stack = error.stack;
  } else if (typeof error === 'string') {
    // String error
    normalized.message = error;
  }

  return normalized;
}

export function extractUserFriendlyMessage(error: any): string {
  const normalized = normalizeError(error);
  return normalized.message;
}

export async function reportError(error: any, context?: Record<string, any>): Promise<{ success: boolean; message: string }> {
  const normalized = normalizeError(error, context);
  const errorReport: ErrorReport = {
    message: normalized.message,
    errorCode: normalized.errorCode,
    info: normalized.details,
    context: normalized.context,
    timestamp: new Date().toISOString(),
    severity: 'error'
  };

  const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';
  
  if (useMock) {
    console.error('[Mock] Error Report:', errorReport);
    await new Promise(res => setTimeout(res, 500));
    return { success: true, message: 'Error reported (mock).' };
  }

  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/report-error`, errorReport);
    return { success: true, message: 'Error reported successfully.' };
  } catch (err: any) {
    console.error('Failed to report error:', err);
    return { 
      success: false, 
      message: err.response?.data?.message || err.message || 'Failed to report error.' 
    };
  }
}

// Utility function to check if an error is retryable
export function isRetryableError(error: any): boolean {
  const normalized = normalizeError(error);
  
  // Don't retry client errors (4xx)
  if (normalized.errorCode?.startsWith('ERR_4')) {
    return false;
  }
  
  // Retry network errors and server errors (5xx)
  return [
    ERROR_CODES.NETWORK_ERROR,
    ERROR_CODES.TIMEOUT_ERROR,
    ERROR_CODES.SERVER_ERROR
  ].includes(normalized.errorCode as any);
} 