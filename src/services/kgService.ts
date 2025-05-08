import axios from 'axios';
import type { GraphData } from '../components/KGViz/types';

export async function fetchKnowledgeGraph(query: string): Promise<GraphData> {
  const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';
  console.log('VITE_USE_MOCK_API:', import.meta.env.VITE_USE_MOCK_API, 'useMock:', useMock);
  if (useMock) {
    try {
      const data = await import('./dummydata/sample_kg_output.json');
      // Map 'weightage' to 'weight' for relationships
      const mapped = {
        ...data.default,
        relationships: data.default.relationships.map((rel: any) => ({
          ...rel,
          weight: rel.weightage,
          weightage: undefined // Remove weightage
        }))
      };
      return mapped as GraphData;
    } catch (err) {
      throw new Error('Failed to load mock knowledge graph data.');
    }
  }
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/kg`,
      { params: { query } }
    );
    return response.data as GraphData;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const msg = error.response?.data?.message || error.message || 'Unknown API error.';
      throw new Error(`API Error: ${msg}`);
    }
    throw new Error('Unexpected error occurred while fetching knowledge graph data.');
  }
} 