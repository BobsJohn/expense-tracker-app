/**
 * Yup 验证模式定义
 */

import * as yup from 'yup';

// 通用验证规则
export const commonValidations = {
  required: (fieldName: string) => 
    yup.string().required(`${fieldName}为必填项`),
  
  email: () => 
    yup.string()
      .email('请输入有效的邮箱地址')
      .required('邮箱为必填项'),
  
  minLength: (fieldName: string, min: number) =>
    yup.string()
      .min(min, `${fieldName}至少需要${min}个字符`)
      .required(`${fieldName}为必填项`),
  
  maxLength: (fieldName: string, max: number) =>
    yup.string()
      .max(max, `${fieldName}最多${max}个字符`)
      .required(`${fieldName}为必填项`),
  
  number: (fieldName: string) =>
    yup.number()
      .typeError(`${fieldName}必须是数字`)
      .required(`${fieldName}为必填项`),
  
  positiveNumber: (fieldName: string) =>
    yup.number()
      .typeError(`${fieldName}必须是数字`)
      .positive(`${fieldName}必须大于0`)
      .required(`${fieldName}为必填项`),
  
  amount: (fieldName: string) =>
    yup.number()
      .typeError(`${fieldName}必须是数字`)
      .min(0, `${fieldName}不能为负数`)
      .required(`${fieldName}为必填项`),
  
  date: (fieldName: string) =>
    yup.date()
      .typeError(`${fieldName}必须是有效日期`)
      .required(`${fieldName}为必填项`),
  
  futureDate: (fieldName: string) =>
    yup.date()
      .typeError(`${fieldName}必须是有效日期`)
      .min(new Date(), `${fieldName}必须是未来日期`)
      .required(`${fieldName}为必填项`),
  
  pastDate: (fieldName: string) =>
    yup.date()
      .typeError(`${fieldName}必须是有效日期`)
      .max(new Date(), `${fieldName}必须是过去日期`)
      .required(`${fieldName}为必填项`),
};

// 预定义的表单模式
export const schemas = {
  // 交易表单
  transaction: yup.object().shape({
    amount: commonValidations.positiveNumber('金额'),
    category: commonValidations.required('类别'),
    description: yup.string().max(200, '描述最多200个字符'),
    date: commonValidations.date('日期'),
  }),
  
  // 预算表单
  budget: yup.object().shape({
    name: commonValidations.minLength('预算名称', 2),
    amount: commonValidations.positiveNumber('金额'),
    category: commonValidations.required('类别'),
    startDate: commonValidations.date('开始日期'),
    endDate: commonValidations.futureDate('结束日期'),
  }),
  
  // 类别表单
  category: yup.object().shape({
    name: commonValidations.minLength('类别名称', 2),
    color: yup.string().matches(/^#[0-9A-F]{6}$/i, '请输入有效的颜色代码'),
    icon: yup.string(),
  }),
  
  // 金额输入
  amountInput: yup.object().shape({
    amount: commonValidations.amount('金额'),
  }),
  
  // 日期范围
  dateRange: yup.object().shape({
    startDate: commonValidations.date('开始日期'),
    endDate: commonValidations.date('结束日期'),
  }).test('date-range', '结束日期必须晚于开始日期', function(value) {
    const {startDate, endDate} = value;
    if (!startDate || !endDate) return true;
    return new Date(endDate) >= new Date(startDate);
  }),
};

// 创建自定义验证模式的辅助函数
export const createSchema = (shape: Record<string, yup.AnySchema>) => {
  return yup.object().shape(shape);
};

// 验证单个字段
export const validateField = async (
  schema: yup.AnySchema,
  value: any,
): Promise<{isValid: boolean; error?: string}> => {
  try {
    await schema.validate(value);
    return {isValid: true};
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return {isValid: false, error: err.message};
    }
    return {isValid: false, error: '验证失败'};
  }
};

// 验证整个对象
export const validateObject = async (
  schema: yup.ObjectSchema<any>,
  values: any,
): Promise<{isValid: boolean; errors?: Record<string, string>}> => {
  try {
    await schema.validate(values, {abortEarly: false});
    return {isValid: true};
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      err.inner.forEach((error) => {
        if (error.path) {
          errors[error.path] = error.message;
        }
      });
      return {isValid: false, errors};
    }
    return {isValid: false, errors: {_general: '验证失败'}};
  }
};
