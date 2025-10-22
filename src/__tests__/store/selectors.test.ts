import {
  selectAccounts,
  selectTotalBalance,
  selectAccountsByType,
  selectMonthlyIncome,
  selectMonthlyExpenses,
  selectBudgetProgress,
  selectSpendingByCategory,
  selectTransactionsByDateRange,
  selectIncomeExpenseByPeriod,
  selectSpendingTrendReport,
  selectCategoryDistributionReport,
  selectAccountReports,
  selectReportSummary,
} from '@/store/selectors';
import { RootState } from '@/store';
import { Account, Transaction, Budget, ReportFilters } from '@/types';

describe('Store Selectors', () => {
  const mockAccounts: Account[] = [
    {
      id: '1',
      name: 'Checking Account',
      type: 'checking',
      balance: 1000,
      currency: 'USD',
    },
    {
      id: '2',
      name: 'Savings Account',
      type: 'savings',
      balance: 5000,
      currency: 'USD',
    },
    {
      id: '3',
      name: 'Credit Card',
      type: 'credit',
      balance: -500,
      currency: 'USD',
    },
  ];

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      accountId: '1',
      amount: 2000,
      category: 'Salary',
      description: 'Monthly salary',
      date: '2024-01-01',
      type: 'income',
    },
    {
      id: '2',
      accountId: '1',
      amount: -100,
      category: 'Food',
      description: 'Groceries',
      date: '2024-01-15',
      type: 'expense',
    },
    {
      id: '3',
      accountId: '2',
      amount: -50,
      category: 'Entertainment',
      description: 'Movie tickets',
      date: '2024-01-20',
      type: 'expense',
    },
    {
      id: '4',
      accountId: '1',
      amount: -75,
      category: 'Utilities',
      description: 'Electric bill',
      date: '2023-12-28',
      type: 'expense',
    },
  ];

  const mockBudgets: Budget[] = [
    {
      id: '1',
      category: 'Food',
      budgetedAmount: 500,
      spentAmount: 200,
      period: 'monthly',
      currency: 'USD',
    },
    {
      id: '2',
      category: 'Entertainment',
      budgetedAmount: 200,
      spentAmount: 250, // Over budget
      period: 'monthly',
      currency: 'USD',
    },
  ];

  const mockState: RootState = {
    accounts: {
      accounts: mockAccounts,
      loading: false,
      error: null,
    },
    transactions: {
      transactions: mockTransactions,
      loading: false,
      error: null,
    },
    budgets: {
      budgets: mockBudgets,
      loading: false,
      error: null,
    },
    app: {
      isLoading: false,
      error: null,
      theme: 'light',
      language: 'en',
    },
  };

  describe('selectAccounts', () => {
    it('should return all accounts', () => {
      const result = selectAccounts(mockState);
      expect(result).toEqual(mockAccounts);
    });
  });

  describe('selectTotalBalance', () => {
    it('should calculate total balance correctly', () => {
      const result = selectTotalBalance(mockState);
      // 1000 + 5000 + (-500) = 5500
      expect(result).toBe(5500);
    });

    it('should handle empty accounts array', () => {
      const emptyState = {
        ...mockState,
        accounts: { ...mockState.accounts, accounts: [] },
      };
      const result = selectTotalBalance(emptyState);
      expect(result).toBe(0);
    });
  });

  describe('selectAccountsByType', () => {
    it('should group accounts by type', () => {
      const result = selectAccountsByType(mockState);
      expect(result).toEqual({
        checking: [mockAccounts[0]],
        savings: [mockAccounts[1]],
        credit: [mockAccounts[2]],
      });
    });
  });

  describe('selectMonthlyIncome', () => {
    it('should calculate monthly income for current month', () => {
      // Mock current date to January 2024
      const mockDate = new Date('2024-01-15');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
      
      const result = selectMonthlyIncome(mockState);
      expect(result).toBe(2000); // Only the salary transaction
      
      jest.restoreAllMocks();
    });
  });

  describe('selectMonthlyExpenses', () => {
    it('should calculate monthly expenses for current month', () => {
      // Mock current date to January 2024
      const mockDate = new Date('2024-01-15');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
      
      const result = selectMonthlyExpenses(mockState);
      expect(result).toBe(150); // 100 + 50 (absolute values)
      
      jest.restoreAllMocks();
    });
  });

  describe('selectBudgetProgress', () => {
    it('should calculate budget progress correctly', () => {
      const result = selectBudgetProgress(mockState);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: '1',
        category: 'Food',
        progressPercentage: 40, // 200/500 * 100
        remainingAmount: 300,
        isOverBudget: false,
      });
      expect(result[1]).toMatchObject({
        id: '2',
        category: 'Entertainment',
        progressPercentage: 100, // Capped at 100%
        remainingAmount: -50,
        isOverBudget: true,
      });
    });
  });

  describe('selectSpendingByCategory', () => {
    it('should group spending by category for current month', () => {
      // Mock current date to January 2024
      const mockDate = new Date('2024-01-15');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
      
      const result = selectSpendingByCategory(mockState);
      expect(result).toEqual({
        Food: 100,
        Entertainment: 50,
      });
      
      jest.restoreAllMocks();
    });
  });

  describe('Report selectors', () => {
    const reportFilters: ReportFilters = {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      granularity: 'weekly',
    };

    it('should return transactions constrained to the date range', () => {
      const result = selectTransactionsByDateRange(mockState, reportFilters);
      expect(result).toHaveLength(3);
      expect(result.every((tx) => tx.date.startsWith('2024-01'))).toBe(true);
    });

    it('should aggregate income and expenses by the selected period', () => {
      const result = selectIncomeExpenseByPeriod(mockState, reportFilters);
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ income: 2000, expense: 0 });
      expect(result[1]).toMatchObject({ income: 0, expense: 150 });
    });

    it('should build a spending trend dataset from period data', () => {
      const result = selectSpendingTrendReport(mockState, reportFilters);
      expect(result).toHaveLength(2);
      expect(result[0].value).toBe(0);
      expect(result[1].value).toBe(150);
    });

    it('should aggregate expenses by category within the date range', () => {
      const result = selectCategoryDistributionReport(mockState, reportFilters);
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ category: 'Food', total: 100 });
      expect(result[1]).toMatchObject({ category: 'Entertainment', total: 50 });
    });

    it('should provide account reports with related transactions', () => {
      const result = selectAccountReports(mockState, reportFilters);
      expect(result).toHaveLength(3);
      const checking = result.find((report) => report.accountId === '1');
      const savings = result.find((report) => report.accountId === '2');
      expect(checking?.transactions).toHaveLength(2);
      expect(savings?.transactions).toHaveLength(1);
    });

    it('should calculate summary metrics for reports', () => {
      const result = selectReportSummary(mockState, reportFilters);
      expect(result.totalIncome).toBe(2000);
      expect(result.totalExpense).toBe(150);
      expect(result.netBalance).toBe(1850);
      expect(result.topCategories.map((item) => item.category)).toEqual([
        'Food',
        'Entertainment',
      ]);
    });
  });
});
