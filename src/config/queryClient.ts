import { QueryClient } from '@tanstack/react-query';
import { isRetryableError } from '../services/errorService';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: unknown) => {
        // Don't retry if it's not a retryable error
        if (!isRetryableError(error)) {
          return false;
        }
        // Retry up to 3 times for retryable errors
        return failureCount < 3;
      }
    }
  }
}); 