import type { GraphData } from './GraphVisualization.types';

// Base API Response type
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Error Response type
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Knowledge Graph Query Response
export interface KnowledgeGraphResponse extends ApiResponse<GraphData> {}

// Saved Query types
export interface SavedQuery {
  id: string;
  queryText: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  description?: string;
  tags?: string[];
}

export interface SavedQueriesResponse extends ApiResponse<SavedQuery[]> {}

export interface SaveQueryRequest {
  queryText: string;
  description?: string;
  tags?: string[];
}

export interface SaveQueryResponse extends ApiResponse<SavedQuery> {}

// API Error Codes
export enum ApiErrorCode {
  INVALID_REQUEST = 'INVALID_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

// Custom error class for API errors
export class ApiErrorResponse extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiErrorResponse';
  }
} 