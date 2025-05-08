import { useCallback } from 'react';
import { useToast } from '../hooks/useToast';
import type { ToastOptions } from '../hooks/useToast';
import { normalizeError, reportError, extractUserFriendlyMessage } from '../services/errorService';

interface ErrorHandlerOptions {
  showToast?: boolean;
  reportToServer?: boolean;
  context?: Record<string, any>;
}

export function useErrorHandler() {
  const { showToast } = useToast();

  const handleError = useCallback(async (
    error: any,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast: shouldShowToast = true,
      reportToServer = true,
      context
    } = options;

    // Normalize the error
    const normalizedError = normalizeError(error, context);
    
    // Extract user-friendly message
    const userMessage = extractUserFriendlyMessage(error);

    // Show toast if enabled
    if (shouldShowToast) {
      const toastOptions: ToastOptions = {
        type: 'error',
        message: userMessage
      };
      showToast(toastOptions);
    }

    // Report to server if enabled
    if (reportToServer) {
      try {
        await reportError(error, context);
      } catch (reportError) {
        console.error('Failed to report error:', reportError);
      }
    }

    return normalizedError;
  }, [showToast]);

  return { handleError };
} 