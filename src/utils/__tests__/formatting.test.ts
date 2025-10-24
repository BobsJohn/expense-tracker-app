/**
 * 格式化工具单元测试
 */

import {
  formatCurrency,
  formatCompactCurrency,
  parseCurrencyInput,
  getCurrencySymbol,
  formatSignedCurrency,
  isValidCurrencyInput,
} from '../formatting/currency';

import {
  formatDate,
  formatShortDate,
  formatLongDate,
  formatDateTime,
  formatRelativeTime,
  getMonthName,
  getDayName,
  isToday,
  isThisWeek,
  getDateRangeText,
} from '../formatting/date';

import {
  formatNumber,
  formatDecimal,
  formatPercentage,
  formatPercentageFromDecimal,
  formatCompactNumber,
  parseNumberInput,
  roundToDecimals,
  formatAmount,
  calculatePercentage,
  calculatePercentageChange,
  formatSignedNumber,
  clamp,
} from '../formatting/number';

describe('货币格式化工具', () => {
  describe('formatCurrency', () => {
    it('应该正确格式化美元', () => {
      expect(formatCurrency(1234.56, 'USD', 'en-US')).toBe('$1,234.56');
    });

    it('应该处理负数', () => {
      expect(formatCurrency(-1234.56, 'USD', 'en-US')).toBe('-$1,234.56');
    });

    it('应该处理零', () => {
      expect(formatCurrency(0, 'USD', 'en-US')).toBe('$0.00');
    });

    it('应该处理NaN', () => {
      expect(formatCurrency(NaN, 'USD', 'en-US')).toBe('$0.00');
    });
  });

  describe('formatCompactCurrency', () => {
    it('应该压缩大数字', () => {
      const result = formatCompactCurrency(1500000, 'USD', 'en-US');
      expect(result).toContain('1');
      expect(result).toContain('M');
    });
  });

  describe('parseCurrencyInput', () => {
    it('应该解析货币字符串', () => {
      expect(parseCurrencyInput('$1,234.56')).toBe(1234.56);
      expect(parseCurrencyInput('1234.56')).toBe(1234.56);
      expect(parseCurrencyInput('1,234')).toBe(1234);
    });

    it('应该处理负数', () => {
      expect(parseCurrencyInput('-$1,234.56')).toBe(-1234.56);
    });

    it('应该处理无效输入', () => {
      expect(parseCurrencyInput('abc')).toBe(0);
      expect(parseCurrencyInput('')).toBe(0);
    });
  });

  describe('getCurrencySymbol', () => {
    it('应该返回美元符号', () => {
      expect(getCurrencySymbol('USD', 'en-US')).toBe('$');
    });
  });

  describe('formatSignedCurrency', () => {
    it('应该为正数添加加号', () => {
      expect(formatSignedCurrency(100, 'USD', 'en-US')).toContain('+');
    });

    it('应该为负数添加减号', () => {
      expect(formatSignedCurrency(-100, 'USD', 'en-US')).toContain('-');
    });
  });

  describe('isValidCurrencyInput', () => {
    it('应该验证有效输入', () => {
      expect(isValidCurrencyInput('123.45')).toBe(true);
      expect(isValidCurrencyInput('123')).toBe(true);
      expect(isValidCurrencyInput('-123.45')).toBe(true);
    });

    it('应该拒绝无效输入', () => {
      expect(isValidCurrencyInput('123.456')).toBe(false);
      expect(isValidCurrencyInput('abc')).toBe(false);
    });
  });
});

describe('日期格式化工具', () => {
  const testDate = new Date('2024-01-15T10:30:00');

  describe('formatDate', () => {
    it('应该格式化日期', () => {
      const result = formatDate(testDate, 'en-US');
      expect(result).toBeTruthy();
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('应该处理字符串输入', () => {
      const result = formatDate('2024-01-15', 'en-US');
      expect(result).toBeTruthy();
    });

    it('应该处理无效日期', () => {
      expect(formatDate('invalid', 'en-US')).toBe('');
    });
  });

  describe('formatShortDate', () => {
    it('应该格式化为短日期', () => {
      const result = formatShortDate(testDate, 'en-US');
      expect(result).toBeTruthy();
    });
  });

  describe('formatLongDate', () => {
    it('应该格式化为长日期', () => {
      const result = formatLongDate(testDate, 'en-US');
      expect(result).toContain('January');
    });
  });

  describe('formatDateTime', () => {
    it('应该格式化日期时间', () => {
      const result = formatDateTime(testDate, 'en-US');
      expect(result).toBeTruthy();
    });
  });

  describe('formatRelativeTime', () => {
    it('应该格式化相对时间', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(yesterday, 'en-US');
      expect(result).toBeTruthy();
    });
  });

  describe('getMonthName', () => {
    it('应该返回月份名称', () => {
      expect(getMonthName(0, 'en-US', 'long')).toBe('January');
      expect(getMonthName(0, 'en-US', 'short')).toBe('Jan');
    });
  });

  describe('getDayName', () => {
    it('应该返回星期名称', () => {
      const result = getDayName(0, 'en-US', 'long');
      expect(result).toBeTruthy();
    });
  });

  describe('isToday', () => {
    it('应该检测今天', () => {
      expect(isToday(new Date())).toBe(true);
      expect(isToday(new Date('2020-01-01'))).toBe(false);
    });
  });

  describe('isThisWeek', () => {
    it('应该检测本周', () => {
      expect(isThisWeek(new Date())).toBe(true);
    });
  });

  describe('getDateRangeText', () => {
    it('应该格式化日期范围', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      const result = getDateRangeText(start, end, 'en-US');
      expect(result).toContain('-');
    });
  });
});

describe('数字格式化工具', () => {
  describe('formatNumber', () => {
    it('应该格式化数字', () => {
      expect(formatNumber(1234.56, 'en-US')).toBe('1,234.56');
    });

    it('应该处理NaN', () => {
      expect(formatNumber(NaN, 'en-US')).toBe('0');
    });
  });

  describe('formatDecimal', () => {
    it('应该格式化小数', () => {
      expect(formatDecimal(123.456, 2, 'en-US')).toBe('123.46');
      expect(formatDecimal(123, 2, 'en-US')).toBe('123.00');
    });
  });

  describe('formatPercentage', () => {
    it('应该格式化百分比', () => {
      expect(formatPercentage(50, 1, 'en-US')).toBe('50.0%');
      expect(formatPercentage(75.5, 1, 'en-US')).toBe('75.5%');
    });

    it('应该处理NaN', () => {
      expect(formatPercentage(NaN, 1, 'en-US')).toBe('0%');
    });
  });

  describe('formatPercentageFromDecimal', () => {
    it('应该从小数格式化百分比', () => {
      expect(formatPercentageFromDecimal(0.5, 1, 'en-US')).toBe('50.0%');
    });
  });

  describe('formatCompactNumber', () => {
    it('应该压缩大数字', () => {
      const result = formatCompactNumber(1500000, 'en-US');
      expect(result).toContain('1');
      expect(result).toContain('M');
    });
  });

  describe('parseNumberInput', () => {
    it('应该解析数字输入', () => {
      expect(parseNumberInput('1,234.56')).toBe(1234.56);
      expect(parseNumberInput('1234')).toBe(1234);
      expect(parseNumberInput('-123')).toBe(-123);
    });

    it('应该处理无效输入', () => {
      expect(parseNumberInput('abc')).toBe(0);
    });
  });

  describe('roundToDecimals', () => {
    it('应该四舍五入到指定小数位', () => {
      expect(roundToDecimals(123.456, 2)).toBe(123.46);
      expect(roundToDecimals(123.454, 2)).toBe(123.45);
    });
  });

  describe('formatAmount', () => {
    it('应该格式化金额', () => {
      expect(formatAmount(1234.56, 2, 'en-US')).toBe('1,234.56');
    });
  });

  describe('calculatePercentage', () => {
    it('应该计算百分比', () => {
      expect(calculatePercentage(50, 100)).toBe(50);
      expect(calculatePercentage(25, 100)).toBe(25);
    });

    it('应该处理零除数', () => {
      expect(calculatePercentage(50, 0)).toBe(0);
    });
  });

  describe('calculatePercentageChange', () => {
    it('应该计算百分比变化', () => {
      expect(calculatePercentageChange(100, 150)).toBe(50);
      expect(calculatePercentageChange(100, 50)).toBe(-50);
    });

    it('应该处理零除数', () => {
      expect(calculatePercentageChange(0, 100)).toBe(0);
    });
  });

  describe('formatSignedNumber', () => {
    it('应该为正数添加加号', () => {
      expect(formatSignedNumber(100, 'en-US')).toContain('+');
    });

    it('应该为负数添加减号', () => {
      expect(formatSignedNumber(-100, 'en-US')).toContain('-');
    });
  });

  describe('clamp', () => {
    it('应该限制数字在范围内', () => {
      expect(clamp(50, 0, 100)).toBe(50);
      expect(clamp(150, 0, 100)).toBe(100);
      expect(clamp(-50, 0, 100)).toBe(0);
    });
  });
});
