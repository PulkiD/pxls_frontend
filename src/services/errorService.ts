import axios from 'axios';

export interface ErrorReport {
  message: string;
  stack?: string;
  info?: any;
}

export async function reportError(error: ErrorReport): Promise<{ success: boolean; message: string }> {
  const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';
  if (useMock) {
    // Simulate a successful report
    await new Promise(res => setTimeout(res, 500));
    return { success: true, message: 'Error reported (mock).' };
  }
  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/report-error`, error);
    return { success: true, message: 'Error reported successfully.' };
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      return { success: false, message: err.response?.data?.message || err.message || 'Failed to report error.' };
    }
    return { success: false, message: 'Unexpected error occurred while reporting error.' };
  }
} 