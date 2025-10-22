import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import {
  Account,
  Transaction,
  Budget,
  ReportFilters,
  TimeGranularity,
  PeriodReportDatum,
  TrendReportDatum,
  CategoryReportDatum,
  AccountReportDatum,
  ReportSummary,
} from '@/types';

// Basic selectors
export const selectAccounts = (state: RootState) => state.accounts.accounts;
export const selectTransactions = (state: RootState) => state.transactions.transactions;
export const selectBudgets = (state: RootState) => state.budgets.budgets;

// Account selectors
export const selectAccountById = createSelector(
  [selectAccounts, (state: RootState, accountId: string) => accountId],
  (accounts, accountId) => accounts.find(account => account.id === accountId)
);

export const selectTotalBalance = createSelector(
  [selectAccounts],
  (accounts) => accounts.reduce((total, account) => {
    // Only include positive balances for net worth calculation
    return account.type === 'credit' 
      ? total + account.balance // Credit balances are negative, so this subtracts debt
      : total + account.balance;
  }, 0)
);

export const selectAccountsByType = createSelector(
  [selectAccounts],
  (accounts) => accounts.reduce((acc, account) => {
    if (!acc[account.type]) {
      acc[account.type] = [];
    }
    acc[account.type].push(account);
    return acc;
  }, {} as Record<string, Account[]>)
);

// Transaction selectors
export const selectTransactionsByAccount = createSelector(
  [selectTransactions, (state: RootState, accountId: string) => accountId],
  (transactions, accountId) => 
    transactions.filter(transaction => transaction.accountId === accountId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
);

export const selectRecentTransactions = createSelector(
  [selectTransactions],
  (transactions) => 
    transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
);

export const selectMonthlyIncome = createSelector(
  [selectTransactions],
  (transactions) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getMonth() === currentMonth && 
               txDate.getFullYear() === currentYear &&
               tx.type === 'income';
      })
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  }
);

export const selectMonthlyExpenses = createSelector(
  [selectTransactions],
  (transactions) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getMonth() === currentMonth && 
               txDate.getFullYear() === currentYear &&
               tx.type === 'expense';
      })
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  }
);

// Budget selectors
export const selectBudgetById = createSelector(
  [selectBudgets, (state: RootState, budgetId: string) => budgetId],
  (budgets, budgetId) => budgets.find(budget => budget.id === budgetId)
);

export const selectBudgetProgress = createSelector(
  [selectBudgets],
  (budgets) => budgets.map(budget => ({
    ...budget,
    progressPercentage: Math.min((budget.spentAmount / budget.budgetedAmount) * 100, 100),
    remainingAmount: budget.budgetedAmount - budget.spentAmount,
    isOverBudget: budget.spentAmount > budget.budgetedAmount,
  }))
);

export const selectTotalBudgeted = createSelector(
  [selectBudgets],
  (budgets) => budgets.reduce((total, budget) => total + budget.budgetedAmount, 0)
);

export const selectTotalSpent = createSelector(
  [selectBudgets],
  (budgets) => budgets.reduce((total, budget) => total + budget.spentAmount, 0)
);

const toDate = (value: Date | string): Date => {
  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const normalizeDate = (date: Date): Date => {
  const normalized = new Date(date.getTime());
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const endOfDay = (date: Date): Date => {
  const normalized = new Date(date.getTime());
  normalized.setHours(23, 59, 59, 999);
  return normalized;
};

const getPeriodStart = (date: Date, granularity: TimeGranularity): Date => {
  const base = normalizeDate(date);

  switch (granularity) {
    case 'weekly': {
      const day = base.getDay();
      const diff = (day + 6) % 7; // Monday as start of week
      base.setDate(base.getDate() - diff);
      break;
    }
    case 'monthly':
      base.setDate(1);
      break;
    case 'yearly':
      base.setMonth(0, 1);
      break;
    case 'daily':
    default:
      break;
  }

  return base;
};

const getPeriodEnd = (start: Date, granularity: TimeGranularity): Date => {
  const base = normalizeDate(start);

  switch (granularity) {
    case 'weekly':
      base.setDate(base.getDate() + 6);
      break;
    case 'monthly':
      base.setMonth(base.getMonth() + 1, 0);
      break;
    case 'yearly':
      base.setMonth(11, 31);
      break;
    case 'daily':
    default:
      break;
  }

  return endOfDay(base);
};

const formatDateParts = (
  date: Date,
  options: Intl.DateTimeFormatOptions,
): string => date.toLocaleDateString(undefined, options);

const getPeriodLabel = (
  start: Date,
  end: Date,
  granularity: TimeGranularity,
): string => {
  switch (granularity) {
    case 'weekly':
      return `${formatDateParts(start, { month: 'short', day: 'numeric' })} - ${formatDateParts(
        end,
        { month: 'short', day: 'numeric' },
      )}`;
    case 'monthly':
      return formatDateParts(start, { month: 'short', year: 'numeric' });
    case 'yearly':
      return formatDateParts(start, { year: 'numeric' });
    case 'daily':
    default:
      return formatDateParts(start, { month: 'short', day: 'numeric' });
  }
};

const selectReportFilters = (_: RootState, filters: ReportFilters) => filters;

export const selectTransactionsByDateRange = createSelector(
  [selectTransactions, selectReportFilters],
  (transactions, filters) => {
    if (!filters?.startDate || !filters?.endDate) {
      return transactions;
    }

    const start = normalizeDate(toDate(filters.startDate));
    const end = endOfDay(toDate(filters.endDate));

    return transactions.filter((transaction) => {
      const txDate = toDate(transaction.date);
      return txDate >= start && txDate <= end;
    });
  },
);

export const selectIncomeExpenseByPeriod = createSelector(
  [selectTransactionsByDateRange, selectReportFilters],
  (transactions, filters) => {
    if (!filters?.granularity) {
      return [] as PeriodReportDatum[];
    }

    const bucketMap = new Map<string, PeriodReportDatum>();

    transactions.forEach((transaction) => {
      const txDate = toDate(transaction.date);
      const periodStart = getPeriodStart(txDate, filters.granularity);
      const periodEnd = getPeriodEnd(periodStart, filters.granularity);
      const periodKey = `${filters.granularity}-${periodStart.getTime()}`;

      if (!bucketMap.has(periodKey)) {
        bucketMap.set(periodKey, {
          periodKey,
          label: getPeriodLabel(periodStart, periodEnd, filters.granularity),
          startDate: periodStart.toISOString(),
          endDate: periodEnd.toISOString(),
          income: 0,
          expense: 0,
          transactions: [],
        });
      }

      const bucket = bucketMap.get(periodKey)!;
      if (transaction.type === 'income') {
        bucket.income += Math.abs(transaction.amount);
      } else {
        bucket.expense += Math.abs(transaction.amount);
      }
      bucket.transactions.push(transaction);
    });

    return Array.from(bucketMap.values()).sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
  },
);

export const selectSpendingTrendReport = createSelector(
  [selectIncomeExpenseByPeriod],
  (periods): TrendReportDatum[] =>
    periods.map((period) => ({
      periodKey: period.periodKey,
      label: period.label,
      value: period.expense,
      transactions: period.transactions.filter((tx) => tx.type === 'expense'),
    })),
);

export const selectCategoryDistributionReport = createSelector(
  [selectTransactionsByDateRange],
  (transactions) => {
    const expenses = transactions.filter((tx) => tx.type === 'expense');
    if (!expenses.length) {
      return [] as CategoryReportDatum[];
    }

    const map = new Map<string, CategoryReportDatum>();

    expenses.forEach((transaction) => {
      const key = transaction.category || 'Uncategorized';
      if (!map.has(key)) {
        map.set(key, {
          category: key,
          total: 0,
          transactions: [],
        });
      }

      const bucket = map.get(key)!;
      bucket.total += Math.abs(transaction.amount);
      bucket.transactions.push(transaction);
    });

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  },
);

export const selectAccountReports = createSelector(
  [selectAccounts, selectTransactionsByDateRange],
  (accounts, transactions) =>
    accounts
      .map((account) => {
        const relatedTransactions = transactions.filter(
          (transaction) => transaction.accountId === account.id,
        );
        return {
          accountId: account.id,
          accountName: account.name,
          balance: account.balance,
          transactions: relatedTransactions,
        } as AccountReportDatum;
      })
      .filter((report) => report.balance !== 0 || report.transactions.length > 0),
);

export const selectReportSummary = createSelector(
  [selectIncomeExpenseByPeriod, selectCategoryDistributionReport],
  (periods, categories): ReportSummary => {
    const totals = periods.reduce(
      (acc, period) => {
        acc.income += period.income;
        acc.expense += period.expense;
        return acc;
      },
      { income: 0, expense: 0 },
    );

    const summary: ReportSummary = {
      totalIncome: totals.income,
      totalExpense: totals.expense,
      netBalance: totals.income - totals.expense,
      topCategories: categories.slice(0, 3),
    };

    return summary;
  },
);

// Category spending analysis
export const selectSpendingByCategory = createSelector(
  [selectTransactions],
  (transactions) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getMonth() === currentMonth && 
               txDate.getFullYear() === currentYear &&
               tx.type === 'expense';
      })
      .reduce((acc, tx) => {
        const category = tx.category;
        acc[category] = (acc[category] || 0) + Math.abs(tx.amount);
        return acc;
      }, {} as Record<string, number>);
  }
);

// Loading and error selectors
export const selectIsLoading = (state: RootState) => 
  state.accounts.loading || state.transactions.loading || state.budgets.loading || state.app.isLoading;

export const selectErrors = (state: RootState) => ({
  accounts: state.accounts.error,
  transactions: state.transactions.error,
  budgets: state.budgets.error,
  app: state.app.error,
});