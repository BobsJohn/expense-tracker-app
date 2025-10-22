import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { Account, Transaction, Budget } from '@/types';

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