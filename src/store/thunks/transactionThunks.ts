import {createAsyncThunk} from '@reduxjs/toolkit';
import {Transaction} from '@/types';
import {transactionRepository, accountRepository} from '@/repositories';

/**
 * 从数据库加载所有交易
 */
export const loadTransactions = createAsyncThunk(
  'transactions/loadTransactions',
  async (_, {rejectWithValue}) => {
    try {
      const transactions = await transactionRepository.findAll();
      return transactions;
    } catch (error) {
      console.error('加载交易失败:', error);
      return rejectWithValue('Failed to load transactions');
    }
  },
);

/**
 * 创建新交易
 * 同时更新账户余额
 */
export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transaction: Transaction, {rejectWithValue}) => {
    try {
      // 创建交易
      await transactionRepository.create(transaction);

      // 更新账户余额
      const account = await accountRepository.findById(transaction.accountId);
      if (account) {
        const newBalance = account.balance + transaction.amount;
        await accountRepository.updateBalance(transaction.accountId, newBalance);
      }

      return {transaction, accountId: transaction.accountId, amount: transaction.amount};
    } catch (error) {
      console.error('创建交易失败:', error);
      return rejectWithValue('Failed to create transaction');
    }
  },
);

/**
 * 更新交易
 * 同时调整账户余额
 */
export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async (
    payload: {oldTransaction: Transaction; newTransaction: Transaction},
    {rejectWithValue},
  ) => {
    try {
      const {oldTransaction, newTransaction} = payload;

      // 更新交易
      await transactionRepository.update(newTransaction);

      // 如果金额或账户变化，需要调整余额
      if (
        oldTransaction.amount !== newTransaction.amount ||
        oldTransaction.accountId !== newTransaction.accountId
      ) {
        // 恢复旧账户余额
        const oldAccount = await accountRepository.findById(oldTransaction.accountId);
        if (oldAccount) {
          const restoredBalance = oldAccount.balance - oldTransaction.amount;
          await accountRepository.updateBalance(oldTransaction.accountId, restoredBalance);
        }

        // 更新新账户余额
        const newAccount = await accountRepository.findById(newTransaction.accountId);
        if (newAccount) {
          const newBalance = newAccount.balance + newTransaction.amount;
          await accountRepository.updateBalance(newTransaction.accountId, newBalance);
        }
      }

      return newTransaction;
    } catch (error) {
      console.error('更新交易失败:', error);
      return rejectWithValue('Failed to update transaction');
    }
  },
);

/**
 * 删除交易
 * 同时调整账户余额
 */
export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (transaction: Transaction, {rejectWithValue}) => {
    try {
      // 删除交易
      await transactionRepository.delete(transaction.id);

      // 恢复账户余额
      const account = await accountRepository.findById(transaction.accountId);
      if (account) {
        const restoredBalance = account.balance - transaction.amount;
        await accountRepository.updateBalance(transaction.accountId, restoredBalance);
      }

      return transaction.id;
    } catch (error) {
      console.error('删除交易失败:', error);
      return rejectWithValue('Failed to delete transaction');
    }
  },
);

/**
 * 根据账户 ID 加载交易
 */
export const loadTransactionsByAccountId = createAsyncThunk(
  'transactions/loadTransactionsByAccountId',
  async (accountId: string, {rejectWithValue}) => {
    try {
      const transactions = await transactionRepository.findByAccountId(accountId);
      return transactions;
    } catch (error) {
      console.error('加载账户交易失败:', error);
      return rejectWithValue('Failed to load transactions for account');
    }
  },
);

/**
 * 根据分类更新交易
 */
export const updateTransactionCategory = createAsyncThunk(
  'transactions/updateTransactionCategory',
  async (
    payload: {oldName: string; newName: string; type: 'income' | 'expense'},
    {rejectWithValue},
  ) => {
    try {
      await transactionRepository.updateCategoryName(payload.oldName, payload.newName, payload.type);
      return payload;
    } catch (error) {
      console.error('更新交易分类失败:', error);
      return rejectWithValue('Failed to update transaction category');
    }
  },
);
