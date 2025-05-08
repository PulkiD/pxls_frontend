import { useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  type: ToastType;
  message: string;
  duration?: number;
}

export function useToast() {
  const showToast = useCallback(({ type, message, duration = 3000 }: ToastOptions) => {
    // TODO: Implement actual toast notification system
    // For now, just log to console
    console.log(`[${type.toUpperCase()}] ${message}`);
  }, []);

  return { showToast };
} 