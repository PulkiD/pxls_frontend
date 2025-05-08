import axios, { AxiosError } from 'axios';
import type { GraphData } from '../types/GraphVisualization.types';
import type {
  KnowledgeGraphResponse,
  SavedQueriesResponse,
  SaveQueryRequest,
  SaveQueryResponse,
  SavedQuery,
} from '../types/kgApi.types';
import { ApiErrorResponse, ApiErrorCode } from '../types/kgApi.types';
import {
  generateMockGraphData,
  getMockSavedQueries,
  saveMockQuery,
  deleteMockQuery,
  updateMockQuery,
} from './mockData/kgMockData';

const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';

// Helper function to handle API errors
function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string; code: string; details?: any }>;
    const response = axiosError.response?.data;
    
    if (response) {
      throw new ApiErrorResponse(
        (response.code as ApiErrorCode) || ApiErrorCode.INTERNAL_ERROR,
        response.message || 'An error occurred',
        response.details
      );
    }
  }
  
  throw new ApiErrorResponse(
    ApiErrorCode.INTERNAL_ERROR,
    'An unexpected error occurred'
  );
}

// Knowledge Graph Query
export async function fetchKnowledgeGraph(query: string): Promise<GraphData> {
  try {
    if (useMock) {
      return generateMockGraphData(query);
    }

    const response = await axios.get<KnowledgeGraphResponse>(
      `${import.meta.env.VITE_API_BASE_URL}/api/knowledge-graph/query`,
      { params: { query } }
    );

    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
}

// Saved Queries
export async function getSavedQueries(): Promise<SavedQuery[]> {
  try {
    if (useMock) {
      return getMockSavedQueries();
    }

    const response = await axios.get<SavedQueriesResponse>(
      `${import.meta.env.VITE_API_BASE_URL}/api/knowledge-graph/saved-queries`
    );

    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function saveQuery(query: SaveQueryRequest): Promise<SavedQuery> {
  try {
    if (useMock) {
      return saveMockQuery(query);
    }

    const response = await axios.post<SaveQueryResponse>(
      `${import.meta.env.VITE_API_BASE_URL}/api/knowledge-graph/saved-queries`,
      query
    );

    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function deleteQuery(queryId: string): Promise<boolean> {
  try {
    if (useMock) {
      return deleteMockQuery(queryId);
    }

    await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/api/knowledge-graph/saved-queries/${queryId}`
    );

    return true;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateQuery(queryId: string, updates: Partial<SavedQuery>): Promise<SavedQuery> {
  try {
    if (useMock) {
      const updated = updateMockQuery(queryId, updates);
      if (!updated) {
        throw new ApiErrorResponse(
          ApiErrorCode.NOT_FOUND,
          `Saved query with ID ${queryId} not found`
        );
      }
      return updated;
    }

    const response = await axios.patch<SaveQueryResponse>(
      `${import.meta.env.VITE_API_BASE_URL}/api/knowledge-graph/saved-queries/${queryId}`,
      updates
    );

    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
} 