import { useQuery } from '@tanstack/react-query';
import { fetchKnowledgeGraph } from '../services/kgService';
import type { GraphData } from '../types/GraphVisualization_types';

export function useKnowledgeGraph(query: string | null) {
  return useQuery<GraphData, Error>({
    queryKey: ['knowledgeGraph', query],
    queryFn: () => {
      if (!query) throw new Error('Query is required');
      return fetchKnowledgeGraph(query);
    },
    enabled: !!query,
    retry: 1, // Only retry once on error
    staleTime: 1000 * 60, // 1 minute
  });
} 