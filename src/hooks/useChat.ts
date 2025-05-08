import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as chatService from '../services/chatService';

export function useConversationSummaries() {
  return useQuery({
    queryKey: ['chat', 'summaries'],
    queryFn: chatService.getConversationSummaries,
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
  });
}

export function useConversationDetails(conversationId?: string) {
  return useQuery({
    queryKey: ['chat', 'conversation', conversationId],
    queryFn: () => {
      if (!conversationId) throw new Error('No conversationId');
      return chatService.getConversationDetails(conversationId);
    },
    enabled: !!conversationId,
    retry: 1,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: chatService.sendMessage,
    onSuccess: (data) => {
      // Invalidate queries to refresh summaries and conversation details
      queryClient.invalidateQueries({ queryKey: ['chat', 'summaries'] });
      if (data.conversationId) {
        queryClient.invalidateQueries({ queryKey: ['chat', 'conversation', data.conversationId] });
      }
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: chatService.deleteConversation,
    onSuccess: (data) => {
      // Invalidate queries to refresh summaries
      queryClient.invalidateQueries({ queryKey: ['chat', 'summaries'] });
      // Also invalidate the specific conversation details if it exists
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversation', data.conversationId] });
    },
  });
} 