import { configureStore } from '@reduxjs/toolkit';
import accountsSlice, { addAccount, updateAccountBalance } from '@/store/slices/accountsSlice';
import transactionsSlice, { addTransaction } from '@/store/slices/transactionsSlice';
import budgetsSlice, { updateBudgetSpent } from '@/store/slices/budgetsSlice';
import { selectTotalBalance, selectMonthlyIncome } from '@/store/selectors';
import { Account, Transaction, Budget } from '@/types';

describe('Store Integration Tests', () => {
  const createTestStore = () => {
    return configureStore({
      reducer: {
        accounts: accountsSlice,
        transactions: transactionsSlice,
        budgets: budgetsSlice,
      },
    });
  };

  it('should properly integrate account and transaction operations', () => {
    const store = createTestStore();

    // Add an account
    const newAccount: Account = {
      id: 'test-account-1',
      name: 'Test Checking',
      type: 'checking',
      balance: 1000,
      currency: 'USD',
    };

    store.dispatch(addAccount(newAccount));

    // Verify account was added
    let state = store.getState();
    expect(state.accounts.accounts).toContainEqual(newAccount);

    // Add a transaction
    const newTransaction: Transaction = {
      id: 'test-tx-1',
      accountId: 'test-account-1',
      amount: -100,
      category: 'Food',
      description: 'Groceries',
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
    };

    store.dispatch(addTransaction(newTransaction));

    // Update account balance based on transaction
    store.dispatch(updateAccountBalance({
      accountId: 'test-account-1',
      amount: newTransaction.amount,
    }));

    // Verify state is consistent
    state = store.getState();
    const account = state.accounts.accounts.find(acc => acc.id === 'test-account-1');
    expect(account?.balance).toBe(900); // 1000 - 100

    const transaction = state.transactions.transactions.find(tx => tx.id === 'test-tx-1');
    expect(transaction).toEqual(newTransaction);
  });

  it('should properly calculate totals with selectors', () => {
    const store = createTestStore();

    // Set up initial state
    const account1: Account = {
      id: 'acc-1',
      name: 'Checking',
      type: 'checking',
      balance: 1000,
      currency: 'USD',
    };

    const account2: Account = {
      id: 'acc-2',
      name: 'Savings',
      type: 'savings',
      balance: 5000,
      currency: 'USD',
    };

    store.dispatch(addAccount(account1));
    store.dispatch(addAccount(account2));

    // Add transactions
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentDate = new Date(currentYear, currentMonth, 15).toISOString().split('T')[0];

    const incomeTransaction: Transaction = {
      id: 'tx-income',
      accountId: 'acc-1',
      amount: 2000,
      category: 'Salary',
      description: 'Monthly salary',
      date: currentDate,
      type: 'income',
    };

    store.dispatch(addTransaction(incomeTransaction));

    const state = store.getState();

    // Test selectors
    const totalBalance = selectTotalBalance(state);
    expect(totalBalance).toBe(6000); // 1000 + 5000

    const monthlyIncome = selectMonthlyIncome(state);
    expect(monthlyIncome).toBe(2000);
  });

  it('should handle budget updates correctly', () => {
    const store = createTestStore();

    // Initial budget state should be empty after clearing default data
    let state = store.getState();
    expect(state.budgets.budgets).toHaveLength(3); // Default budgets from initial state

    // Update budget spent amount
    store.dispatch(updateBudgetSpent({
      budgetId: '1', // Food budget from initial state
      amount: 50,
    }));

    state = store.getState();
    const foodBudget = state.budgets.budgets.find(b => b.id === '1');
    expect(foodBudget?.spentAmount).toBe(295.67); // 245.67 + 50
  });

  it('should maintain data consistency across operations', () => {
    const store = createTestStore();

    // Perform multiple operations
    const account: Account = {
      id: 'consistency-test',
      name: 'Test Account',
      type: 'checking',
      balance: 500,
      currency: 'USD',
    };

    store.dispatch(addAccount(account));

    // Add multiple transactions
    const transactions: Transaction[] = [
      {
        id: 'tx-1',
        accountId: 'consistency-test',
        amount: 200,
        category: 'Income',
        description: 'Freelance',
        date: '2024-01-01',
        type: 'income',
      },
      {
        id: 'tx-2',
        accountId: 'consistency-test',
        amount: -50,
        category: 'Food',
        description: 'Lunch',
        date: '2024-01-02',
        type: 'expense',
      },
    ];

    transactions.forEach(tx => {
      store.dispatch(addTransaction(tx));
      store.dispatch(updateAccountBalance({
        accountId: tx.accountId,
        amount: tx.amount,
      }));
    });

    const state = store.getState();
    const finalAccount = state.accounts.accounts.find(acc => acc.id === 'consistency-test');
    
    // 500 + 200 - 50 = 650
    expect(finalAccount?.balance).toBe(650);
    expect(state.transactions.transactions).toHaveLength(5); // 3 initial + 2 new
  });
});