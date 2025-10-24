/**
 * 货币格式化工具函数
 */

/**
 * 格式化货币
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
): string => {
  if (isNaN(amount)) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(0);
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * 格式化货币（紧凑格式）
 */
export const formatCompactCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
): string => {
  if (isNaN(amount)) {
    return formatCurrency(0, currency, locale);
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(amount);
};

/**
 * 解析货币输入字符串
 */
export const parseCurrencyInput = (input: string): number => {
  const cleaned = input.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * 获取货币符号
 */
export const getCurrencySymbol = (
  currency: string = 'USD',
  locale: string = 'en-US',
): string => {
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(0);
  
  return formatted.replace(/\d/g, '').trim();
};

/**
 * 格式化货币范围
 */
export const formatCurrencyRange = (
  min: number,
  max: number,
  currency: string = 'USD',
  locale: string = 'en-US',
): string => {
  return `${formatCurrency(min, currency, locale)} - ${formatCurrency(max, currency, locale)}`;
};

/**
 * 格式化带符号的货币 (+$10.00, -$5.00)
 */
export const formatSignedCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
): string => {
  if (isNaN(amount)) {
    return formatCurrency(0, currency, locale);
  }
  
  const sign = amount >= 0 ? '+' : '';
  const formatted = formatCurrency(Math.abs(amount), currency, locale);
  return amount >= 0 ? sign + formatted : '-' + formatted;
};

/**
 * 验证货币格式
 */
export const isValidCurrencyInput = (input: string): boolean => {
  const pattern = /^-?\d+(\.\d{0,2})?$/;
  const cleaned = input.replace(/[^0-9.-]/g, '');
  return pattern.test(cleaned);
};

/**
 * 格式化货币（隐藏小数部分如果为0）
 */
export const formatCurrencyWithoutZeroDecimals = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
): string => {
  if (isNaN(amount)) {
    return formatCurrency(0, currency, locale);
  }
  
  const hasDecimals = amount % 1 !== 0;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
};
