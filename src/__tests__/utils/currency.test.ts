import { formatCurrency, formatNumber, parseCurrencyInput } from '@/utils/currency';

describe('Currency Utils', () => {
  describe('formatCurrency', () => {
    it('should format positive amounts correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('should format negative amounts correctly', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
    });

    it('should format zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should handle different currencies', () => {
      expect(formatCurrency(1234.56, 'EUR', 'de-DE')).toBe('1.234,56 €');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with decimal places', () => {
      expect(formatNumber(1234.56)).toBe('1,234.56');
    });

    it('should format integers with .00', () => {
      expect(formatNumber(1234)).toBe('1,234.00');
    });
  });

  describe('parseCurrencyInput', () => {
    it('should parse valid currency strings', () => {
      expect(parseCurrencyInput('$1,234.56')).toBe(1234.56);
      expect(parseCurrencyInput('1234.56')).toBe(1234.56);
      expect(parseCurrencyInput('1,234')).toBe(1234);
    });

    it('should handle negative amounts', () => {
      expect(parseCurrencyInput('-$1,234.56')).toBe(-1234.56);
      expect(parseCurrencyInput('-1234.56')).toBe(-1234.56);
    });

    it('should return 0 for invalid inputs', () => {
      expect(parseCurrencyInput('abc')).toBe(0);
      expect(parseCurrencyInput('')).toBe(0);
      expect(parseCurrencyInput('$')).toBe(0);
    });

    it('should handle partial inputs', () => {
      expect(parseCurrencyInput('12.')).toBe(12);
      expect(parseCurrencyInput('.56')).toBe(0.56);
    });
  });
});