/**
 * 表单验证工具函数
 * 
 * 功能说明：
 * - 提供常用的表单字段验证方法
 * - 统一的验证规则和返回格式
 * - 支持金额、邮箱、必填项等验证
 * 
 * @module utils/validation
 */

/**
 * 验证金额格式
 * 
 * 规则：必须是大于 0 的有效数字
 * 
 * @param amount - 金额字符串
 * @returns boolean 有效返回 true，无效返回 false
 */
export const validateAmount = (amount: string): boolean => {
  const parsed = parseFloat(amount);
  return !isNaN(parsed) && parsed > 0;
};

/**
 * 验证必填项
 * 
 * 规则：去除空格后长度大于 0
 * 
 * @param value - 输入值
 * @returns boolean 有效返回 true，无效返回 false
 */
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * 验证邮箱格式
 * 
 * 规则：符合基本的邮箱格式（包含 @ 和域名）
 * 
 * @param email - 邮箱字符串
 * @returns boolean 有效返回 true，无效返回 false
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 验证账户名称
 * 
 * 规则：长度在 2-50 个字符之间
 * 
 * @param name - 账户名称
 * @returns boolean 有效返回 true，无效返回 false
 */
export const validateAccountName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};
