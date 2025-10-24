/**
 * 表单辅助函数
 */

import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {FieldError} from 'react-hook-form';

/**
 * 创建 react-hook-form resolver
 */
export const createFormResolver = (schema: yup.ObjectSchema<any>) => {
  return yupResolver(schema);
};

/**
 * 获取字段错误消息
 */
export const getFieldError = (error?: FieldError): string | undefined => {
  return error?.message;
};

/**
 * 检查字段是否有错误
 */
export const hasFieldError = (error?: FieldError): boolean => {
  return !!error;
};

/**
 * 格式化表单数据（移除空白字符）
 */
export const trimFormValues = <T extends Record<string, any>>(values: T): T => {
  const trimmed = {...values};
  Object.keys(trimmed).forEach((key) => {
    if (typeof trimmed[key as keyof T] === 'string') {
      (trimmed[key as keyof T] as any) = (trimmed[key as keyof T] as string).trim();
    }
  });
  return trimmed;
};

/**
 * 表单默认值辅助函数
 */
export const getDefaultFormValues = <T extends Record<string, any>>(
  defaults: Partial<T>,
  overrides?: Partial<T>,
): T => {
  return {
    ...defaults,
    ...overrides,
  } as T;
};

/**
 * 将表单错误转换为用户友好消息
 */
export const formatFormErrors = (
  errors: Record<string, FieldError>,
): string[] => {
  return Object.values(errors)
    .filter((error) => error?.message)
    .map((error) => error.message!);
};

/**
 * 合并多个验证模式
 */
export const mergeSchemas = (...schemas: yup.ObjectSchema<any>[]) => {
  return schemas.reduce((merged, schema) => {
    return merged.concat(schema);
  });
};

/**
 * 条件验证辅助函数
 */
export const conditionalValidation = (
  condition: boolean,
  schema: yup.AnySchema,
  defaultSchema?: yup.AnySchema,
) => {
  return condition ? schema : (defaultSchema || yup.mixed().notRequired());
};

/**
 * 创建异步验证器
 */
export const createAsyncValidator = <T>(
  validateFn: (value: T) => Promise<boolean>,
  errorMessage: string,
) => {
  return yup.mixed().test('async-validation', errorMessage, async (value) => {
    try {
      return await validateFn(value as T);
    } catch {
      return false;
    }
  });
};

/**
 * 表单状态辅助类型
 */
export interface FormState {
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  errors: Record<string, any>;
}

/**
 * 检查表单是否可以提交
 */
export const canSubmitForm = (formState: FormState): boolean => {
  return formState.isValid && !formState.isSubmitting && formState.isDirty;
};

/**
 * 重置表单字段错误
 */
export const clearFieldErrors = (
  fields: string[],
  clearErrors: (name?: string | string[]) => void,
) => {
  clearErrors(fields);
};

/**
 * 设置多个字段值
 */
export const setMultipleFields = <T extends Record<string, any>>(
  setValue: (name: keyof T, value: any) => void,
  values: Partial<T>,
) => {
  Object.entries(values).forEach(([key, value]) => {
    setValue(key as keyof T, value);
  });
};
