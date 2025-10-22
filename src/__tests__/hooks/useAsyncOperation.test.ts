import {renderHook, act} from '@testing-library/react-native';
import {useAsyncOperation} from '@/hooks/useAsyncOperation';

// Mock the toast service and haptics
jest.mock('@/services/toastService', () => ({
  showToast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('@/utils/haptics', () => ({
  triggerHapticFeedback: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('useAsyncOperation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const {result} = renderHook(() => useAsyncOperation<string>());

    expect(result.current.state).toEqual({
      data: null,
      loading: false,
      error: null,
    });
  });

  it('should handle successful operations', async () => {
    const {result} = renderHook(() => useAsyncOperation<string>());
    const mockOperation = jest.fn().mockResolvedValue('success');

    await act(async () => {
      const data = await result.current.execute(mockOperation);
      expect(data).toBe('success');
    });

    expect(result.current.state).toEqual({
      data: 'success',
      loading: false,
      error: null,
    });

    expect(mockOperation).toHaveBeenCalledTimes(1);
  });

  it('should handle failed operations', async () => {
    const {result} = renderHook(() => useAsyncOperation<string>());
    const mockError = new Error('Test error');
    const mockOperation = jest.fn().mockRejectedValue(mockError);

    await act(async () => {
      const data = await result.current.execute(mockOperation);
      expect(data).toBeNull();
    });

    expect(result.current.state).toEqual({
      data: null,
      loading: false,
      error: 'Test error',
    });
  });

  it('should set loading state during operation', async () => {
    const {result} = renderHook(() => useAsyncOperation<string>());
    let resolvePromise: (value: string) => void;
    const mockOperation = jest.fn().mockReturnValue(
      new Promise<string>(resolve => {
        resolvePromise = resolve;
      }),
    );

    act(() => {
      result.current.execute(mockOperation);
    });

    // Should be loading
    expect(result.current.state.loading).toBe(true);

    await act(async () => {
      resolvePromise!('success');
    });

    // Should no longer be loading
    expect(result.current.state.loading).toBe(false);
  });

  it('should reset state correctly', () => {
    const {result} = renderHook(() => useAsyncOperation<string>());

    // Set some state
    act(() => {
      result.current.state.data = 'test';
      result.current.state.error = 'error';
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.state).toEqual({
      data: null,
      loading: false,
      error: null,
    });
  });
});
