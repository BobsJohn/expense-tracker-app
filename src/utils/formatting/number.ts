/**
 * 数字格式化工具函数
 */

/**
 * 格式化数字为本地化字符串
 */
export const formatNumber = (
  value: number,
  locale: string = 'en-US',
  options?: Intl.NumberFormatOptions,
): string => {
  if (isNaN(value)) {
    return '0';
  }
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
};

/**
 * 格式化数字为带小数位的字符串
 */
export const formatDecimal = (
  value: number,
  decimals: number = 2,
  locale: string = 'en-US',
): string => {
  if (isNaN(value)) {
    return '0';
  }
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * 格式化百分比
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1,
  locale: string = 'en-US',
): string => {
  if (isNaN(value)) {
    return '0%';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

/**
 * 格式化百分比（已经是小数的值，如 0.5 = 50%）
 */
export const formatPercentageFromDecimal = (
  value: number,
  decimals: number = 1,
  locale: string = 'en-US',
): string => {
  if (isNaN(value)) {
    return '0%';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * 格式化为紧凑格式 (1K, 1M, 1B)
 */
export const formatCompactNumber = (
  value: number,
  locale: string = 'en-US',
): string => {
  if (isNaN(value)) {
    return '0';
  }
  
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value);
};

/**
 * 解析数字输入字符串
 */
export const parseNumberInput = (input: string): number => {
  const cleaned = input.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * 四舍五入到指定小数位
 */
export const roundToDecimals = (value: number, decimals: number = 2): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

/**
 * 格式化为货币（无货币符号）
 */
export const formatAmount = (
  value: number,
  decimals: number = 2,
  locale: string = 'en-US',
): string => {
  if (isNaN(value)) {
    return '0.00';
  }
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * 计算百分比
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0 || isNaN(value) || isNaN(total)) {
    return 0;
  }
  return (value / total) * 100;
};

/**
 * 计算百分比变化
 */
export const calculatePercentageChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0 || isNaN(oldValue) || isNaN(newValue)) {
    return 0;
  }
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
};

/**
 * 格式化带符号的数字 (+10, -5)
 */
export const formatSignedNumber = (
  value: number,
  locale: string = 'en-US',
): string => {
  if (isNaN(value)) {
    return '0';
  }
  
  const sign = value >= 0 ? '+' : '';
  return sign + formatNumber(value, locale);
};

/**
 * 限制数字在范围内
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};
