/**
 * 异步操作 Hook
 * 
 * 功能说明：
 * - 封装异步操作的通用逻辑（加载状态、错误处理、成功/失败反馈）
 * - 自动管理 loading、error、data 状态
 * - 集成 Toast 消息提示和触觉反馈
 * - 提供重置状态的方法
 * 
 * 使用场景：
 * - 表单提交
 * - 数据加载
 * - API 调用
 * - 任何需要统一错误处理的异步操作
 * 
 * @module hooks/useAsyncOperation
 */
import {useState, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {showToast} from '@/services/toastService';
import {triggerHapticFeedback} from '@/utils/haptics';

/**
 * 异步操作状态接口
 * 
 * @template T - 操作返回的数据类型
 */
interface AsyncOperationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook 返回值接口
 * 
 * @template T - 操作返回的数据类型
 */
interface AsyncOperationReturn<T> {
  state: AsyncOperationState<T>;
  execute: (operation: () => Promise<T>) => Promise<T | null>;
  reset: () => void;
}

/**
 * 异步操作 Hook
 * 
 * @template T - 异步操作返回的数据类型
 * @returns AsyncOperationReturn<T> Hook 返回对象
 * 
 * @example
 * const {state, execute, reset} = useAsyncOperation<Account>();
 * 
 * const handleSubmit = async () => {
 *   await execute(() => createAccount(formData));
 * };
 */
export const useAsyncOperation = <T>(): AsyncOperationReturn<T> => {
  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  /**
   * 执行异步操作
   * 
   * 功能：
   * - 设置 loading 状态
   * - 执行传入的异步操作
   * - 处理成功：保存数据、触发成功反馈
   * - 处理失败：保存错误、显示 Toast、触发错误反馈
   * 
   * @param operation - 要执行的异步操作函数
   * @returns Promise<T | null> 成功返回数据，失败返回 null
   */
  const execute = useCallback(async (operation: () => Promise<T>): Promise<T | null> => {
    setState(prev => ({...prev, loading: true, error: null}));

    try {
      const result = await operation();
      setState({data: result, loading: false, error: null});
      triggerHapticFeedback.success();
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({...prev, loading: false, error: errorMessage}));
      triggerHapticFeedback.error();
      showToast.error(errorMessage);
      return null;
    }
  }, []);

  /**
   * 重置状态
   * 
   * 功能：将所有状态重置为初始值
   */
  const reset = useCallback(() => {
    setState({data: null, loading: false, error: null});
  }, []);

  return {state, execute, reset};
};
