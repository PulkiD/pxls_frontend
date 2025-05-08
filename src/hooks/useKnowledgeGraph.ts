import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchKnowledgeGraph,
  getSavedQueries,
  saveQuery,
  deleteQuery,
  updateQuery,
} from '../services/kgService';
import type { SaveQueryRequest, SavedQuery } from '../types/kgApi.types';

export function useKnowledgeGraph(query: string | null) {
  const queryClient = useQueryClient();

  const {
    data: graphData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['knowledgeGraph', query],
    queryFn: () => fetchKnowledgeGraph(query!),
    enabled: !!query,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const {
    data: savedQueries = [],
    isLoading: loadingSavedQueries,
    error: savedQueriesError,
  } = useQuery({
    queryKey: ['savedQueries'],
    queryFn: getSavedQueries,
    staleTime: 1000 * 60, // 1 minute
  });

  const saveQueryMutation = useMutation({
    mutationFn: (query: SaveQueryRequest) => saveQuery(query),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedQueries'] });
    },
  });

  const deleteQueryMutation = useMutation({
    mutationFn: (queryId: string) => deleteQuery(queryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedQueries'] });
    },
  });

  const updateQueryMutation = useMutation({
    mutationFn: ({ queryId, updates }: { queryId: string; updates: Partial<SavedQuery> }) =>
      updateQuery(queryId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedQueries'] });
    },
  });

  return {
    // Graph data
    graphData,
    isLoading,
    error,
    refetch,
    
    // Saved queries
    savedQueries,
    loadingSavedQueries,
    savedQueriesError,
    
    // Mutations
    saveQuery: saveQueryMutation.mutate,
    deleteQuery: deleteQueryMutation.mutate,
    updateQuery: updateQueryMutation.mutate,
    
    // Mutation states
    isSaving: saveQueryMutation.isPending,
    isDeleting: deleteQueryMutation.isPending,
    isUpdating: updateQueryMutation.isPending,
    
    // Mutation errors
    saveError: saveQueryMutation.error,
    deleteError: deleteQueryMutation.error,
    updateError: updateQueryMutation.error,
  };
} 