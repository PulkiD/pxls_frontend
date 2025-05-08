import { useState, useCallback } from 'react';
import { reportError } from '../services/errorService';
import type { ErrorReport } from '../services/errorService';

export function useErrorReport() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendErrorReport = useCallback(async (errorReport: ErrorReport) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await reportError(errorReport);
      setResult(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to report error.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { sendErrorReport, loading, result, error };
} 