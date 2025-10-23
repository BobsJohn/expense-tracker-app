import {configureStore} from '@reduxjs/toolkit';
import accountsSlice, {addAccount, updateAccountBalance} from '@/store/slices/accountsSlice';
import transactionsSlice, {addTransaction} from '@/store/slices/transactionsSlice';
import budgetsSlice, {updateBudgetSpent} from '@/store/slices/budgetsSlice';
import {selectTotalBalance, selectMonthlyIncome} from '@/store/selectors';
import {executeTransfer} from '@/store/actions/transfers';
import {Account, Transaction} from '@/types';

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
    const timestamp = '2024-01-01T00:00:00.000Z';
    const newAccount: Account = {
      id: 'test-account-1',
      name: 'Test Checking',
      type: 'checking',
      balance: 1000,
      currency: 'USD',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    store.dispatch(addAccount(newAccount));

    // Verify account was added
    let state = store.getState();
    const storedAccount = state.accounts.accounts.find(acc => acc.id === newAccount.id);
    expect(storedAccount).toMatchObject({
      id: newAccount.id,
      name: newAccount.name,
      type: newAccount.type,
      balance: newAccount.balance,
      currency: newAccount.currency,
    });
    expect(storedAccount?.createdAt).toBeDefined();
    expect(storedAccount?.updatedAt).toBeDefined();

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
    store.dispatch(
      updateAccountBalance({
        accountId: 'test-account-1',
        amount: newTransaction.amount,
      }),
    );

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
    const baseTimestamp = '2024-01-01T00:00:00.000Z';
    const account1: Account = {
      id: 'acc-1',
      name: 'Checking',
      type: 'checking',
      balance: 1000,
      currency: 'USD',
      createdAt: baseTimestamp,
      updatedAt: baseTimestamp,
    };

    const account2: Account = {
      id: 'acc-2',
      name: 'Savings',
      type: 'savings',
      balance: 5000,
      currency: 'USD',
      createdAt: baseTimestamp,
      updatedAt: baseTimestamp,
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

  it('should execute transfers atomically across accounts and transactions', () => {
    const store = createTestStore();

    const timestamp = '2024-02-01T00:00:00.000Z';

    const sourceAccount: Account = {
      id: 'transfer-source',
      name: 'Source',
      type: 'checking',
      balance: 500,
      currency: 'USD',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const destinationAccount: Account = {
      id: 'transfer-destination',
      name: 'Destination',
      type: 'savings',
      balance: 250,
      currency: 'USD',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    store.dispatch(addAccount(sourceAccount));
    store.dispatch(addAccount(destinationAccount));

    const transferTimestamp = '2024-02-15T12:00:00.000Z';

    store.dispatch(
      executeTransfer({
        transferId: 'transfer-test-1',
        sourceAccountId: sourceAccount.id,
        sourceAccountName: sourceAccount.name,
        destinationAccountId: destinationAccount.id,
        destinationAccountName: destinationAccount.name,
        amount: 150,
        timestamp: transferTimestamp,
        memo: 'Monthly savings',
      }),
    );

    const state = store.getState();
    const updatedSource = state.accounts.accounts.find(acc => acc.id === sourceAccount.id);
    const updatedDestination = state.accounts.accounts.find(acc => acc.id === destinationAccount.id);

    expect(updatedSource?.balance).toBe(350);
    expect(updatedDestination?.balance).toBe(400);

    const transferTransactions = state.transactions.transactions.filter(
      tx => tx.transferId === 'transfer-test-1',
    );

    expect(transferTransactions).toHaveLength(2);

    const outgoing = transferTransactions.find(tx => tx.accountId === sourceAccount.id);
    const incoming = transferTransactions.find(tx => tx.accountId === destinationAccount.id);

    expect(outgoing).toMatchObject({
      accountId: sourceAccount.id,
      amount: -150,
      type: 'expense',
      relatedAccountId: destinationAccount.id,
      memo: 'Monthly savings',
    });
    expect(outgoing?.date).toBe(transferTimestamp);

    expect(incoming).toMatchObject({
      accountId: destinationAccount.id,
      amount: 150,
      type: 'income',
      relatedAccountId: sourceAccount.id,
      memo: 'Monthly savings',
    });
    expect(incoming?.date).toBe(transferTimestamp);
  });

  it('should handle budget updates correctly', () => {
    const store = createTestStore();

    // Initial budget state should be empty after clearing default data
    let state = store.getState();
    expect(state.budgets.budgets).toHaveLength(3); // Default budgets from initial state

    // Update budget spent amount
    store.dispatch(
      updateBudgetSpent({
        budgetId: '1', // Food budget from initial state
        amount: 50,
      }),
    );

    state = store.getState();
    const foodBudget = state.budgets.budgets.find(b => b.id === '1');
    expect(foodBudget?.spentAmount).toBe(295.67); // 245.67 + 50
  });

  it('should maintain data consistency across operations', () => {
    const store = createTestStore();

    // Perform multiple operations
    const timestamp = '2024-01-01T00:00:00.000Z';
    const account: Account = {
      id: 'consistency-test',
      name: 'Test Account',
      type: 'checking',
      balance: 500,
      currency: 'USD',
      createdAt: timestamp,
      updatedAt: timestamp,
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
      store.dispatch(
        updateAccountBalance({
          accountId: tx.accountId,
          amount: tx.amount,
        }),
      );
    });

    const state = store.getState();
    const finalAccount = state.accounts.accounts.find(acc => acc.id === 'consistency-test');

    // 500 + 200 - 50 = 650
    expect(finalAccount?.balance).toBe(650);
    expect(state.transactions.transactions).toHaveLength(5); // 3 initial + 2 new
  });
});
