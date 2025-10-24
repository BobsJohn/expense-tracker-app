import {createAsyncThunk} from '@reduxjs/toolkit';
import {Transaction} from '@/types';
import * as DatabaseService from '@/services/databaseService';
import {
  addTransaction as addTransactionAction,
  updateTransaction as updateTransactionAction,
  deleteTransaction as deleteTransactionAction,
  setLoading,
  setError,
} from '@/store/slices/transactionsSlice';
import {updateAccount} from '@/store/slices/accountsSlice';
import {RootState} from '@/store';
import {selectAccountById} from '@/store/selectors';
import Toast from 'react-native-toast-message';

export const addTransactionThunk = createAsyncThunk<Transaction, Transaction, {state: RootState}>(
  'transactions/add',
  async (transaction, {dispatch, getState}) => {
    try {
      dispatch(setLoading(true));

      const state = getState();
      const account = selectAccountById(state, transaction.accountId);

      if (!account) {
        throw new Error('Account not found');
      }

      dispatch(addTransactionAction(transaction));

      const newBalance = account.balance + transaction.amount;
      const updatedAccount = {
        ...account,
        balance: newBalance,
        updatedAt: new Date().toISOString(),
      };

      dispatch(updateAccount(updatedAccount));

      await DatabaseService.insertTransaction(transaction);
      await DatabaseService.updateAccount(updatedAccount);

      Toast.show({
        type: 'success',
        text1: '交易已添加',
        text2: transaction.type === 'income' ? '收入已记录' : '支出已记录',
      });

      return transaction;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '添加交易失败';
      dispatch(setError(errorMessage));

      Toast.show({
        type: 'error',
        text1: '错误',
        text2: errorMessage,
      });

      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const updateTransactionThunk = createAsyncThunk<
  {oldTransaction: Transaction; newTransaction: Transaction},
  Transaction,
  {state: RootState}
>('transactions/update', async (newTransaction, {dispatch, getState}) => {
  try {
    dispatch(setLoading(true));

    const state = getState();
    const oldTransaction = state.transactions.transactions.find(tx => tx.id === newTransaction.id);

    if (!oldTransaction) {
      throw new Error('Transaction not found');
    }

    const oldAccount = selectAccountById(state, oldTransaction.accountId);
    const newAccount = selectAccountById(state, newTransaction.accountId);

    if (!oldAccount || !newAccount) {
      throw new Error('Account not found');
    }

    dispatch(updateTransactionAction(newTransaction));

    if (oldTransaction.accountId === newTransaction.accountId) {
      const balanceDelta = newTransaction.amount - oldTransaction.amount;
      const updatedAccount = {
        ...newAccount,
        balance: newAccount.balance + balanceDelta,
        updatedAt: new Date().toISOString(),
      };

      dispatch(updateAccount(updatedAccount));
      await DatabaseService.updateAccount(updatedAccount);
    } else {
      const updatedOldAccount = {
        ...oldAccount,
        balance: oldAccount.balance - oldTransaction.amount,
        updatedAt: new Date().toISOString(),
      };

      const updatedNewAccount = {
        ...newAccount,
        balance: newAccount.balance + newTransaction.amount,
        updatedAt: new Date().toISOString(),
      };

      dispatch(updateAccount(updatedOldAccount));
      dispatch(updateAccount(updatedNewAccount));

      await DatabaseService.updateAccount(updatedOldAccount);
      await DatabaseService.updateAccount(updatedNewAccount);
    }

    await DatabaseService.updateTransaction(newTransaction);

    Toast.show({
      type: 'success',
      text1: '交易已更新',
      text2: '交易详情已保存',
    });

    return {oldTransaction, newTransaction};
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '更新交易失败';
    dispatch(setError(errorMessage));

    Toast.show({
      type: 'error',
      text1: '错误',
      text2: errorMessage,
    });

    throw error;
  } finally {
    dispatch(setLoading(false));
  }
});

export const deleteTransactionThunk = createAsyncThunk<string, string, {state: RootState}>(
  'transactions/delete',
  async (transactionId, {dispatch, getState}) => {
    try {
      dispatch(setLoading(true));

      const state = getState();
      const transaction = state.transactions.transactions.find(tx => tx.id === transactionId);

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      const account = selectAccountById(state, transaction.accountId);

      if (!account) {
        throw new Error('Account not found');
      }

      dispatch(deleteTransactionAction(transactionId));

      const updatedAccount = {
        ...account,
        balance: account.balance - transaction.amount,
        updatedAt: new Date().toISOString(),
      };

      dispatch(updateAccount(updatedAccount));

      await DatabaseService.deleteTransaction(transactionId);
      await DatabaseService.updateAccount(updatedAccount);

      Toast.show({
        type: 'success',
        text1: '交易已删除',
        text2: '账户余额已更新',
      });

      return transactionId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除交易失败';
      dispatch(setError(errorMessage));

      Toast.show({
        type: 'error',
        text1: '错误',
        text2: errorMessage,
      });

      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const loadTransactionsThunk = createAsyncThunk(
  'transactions/load',
  async (_, {dispatch}) => {
    try {
      dispatch(setLoading(true));
      const transactions = await DatabaseService.getTransactions();
      return transactions;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载交易失败';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);
