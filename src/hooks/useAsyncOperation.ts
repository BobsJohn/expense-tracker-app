import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { showToast } from '@/services/toastService';
import { triggerHapticFeedback } from '@/utils/haptics';

interface AsyncOperationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface AsyncOperationReturn<T> {
  state: AsyncOperationState<T>;
  execute: (operation: () => Promise<T>) => Promise<T | null>;
  reset: () => void;
}

export const useAsyncOperation = <T>(): AsyncOperationReturn<T> => {
  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (operation: () => Promise<T>): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await operation();
      setState({ data: result, loading: false, error: null });
      triggerHapticFeedback.success();
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      triggerHapticFeedback.error();
      showToast.error(errorMessage);
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { state, execute, reset };
};