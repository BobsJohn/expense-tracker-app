/**
 * 货币格式化工具函数
 * 
 * 功能说明：
 * - 提供货币和数字的格式化功能
 * - 处理用户输入的货币字符串解析
 * - 支持国际化和多币种
 * 
 * @module utils/currency
 */

/**
 * 格式化货币金额
 * 
 * 功能：将数字格式化为带货币符号的字符串
 * 
 * @param amount - 金额数值
 * @param currency - 货币代码（如 'USD', 'CNY'），默认 'USD'
 * @param locale - 地区代码（如 'en-US', 'zh-CN'），默认 'en-US'
 * @returns 格式化后的货币字符串（如 '$1,234.56' 或 '¥1,234.56'）
 * 
 * @example
 * formatCurrency(1234.56, 'CNY', 'zh-CN') // '¥1,234.56'
 * formatCurrency(1234.56, 'USD', 'en-US') // '$1,234.56'
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * 格式化数字
 * 
 * 功能：将数字格式化为带千分位的字符串（不带货币符号）
 * 
 * @param amount - 数值
 * @param locale - 地区代码，默认 'en-US'
 * @returns 格式化后的数字字符串（如 '1,234.56'）
 * 
 * @example
 * formatNumber(1234.56) // '1,234.56'
 */
export const formatNumber = (amount: number, locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * 解析货币输入字符串
 * 
 * 功能：将用户输入的货币字符串转换为数字
 * 
 * @param input - 输入字符串（可能包含货币符号、千分位等）
 * @returns 解析后的数字，无效输入返回 0
 * 
 * @example
 * parseCurrencyInput('$1,234.56') // 1234.56
 * parseCurrencyInput('¥1,234.56') // 1234.56
 * parseCurrencyInput('abc') // 0
 */
export const parseCurrencyInput = (input: string): number => {
  const cleaned = input.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};
