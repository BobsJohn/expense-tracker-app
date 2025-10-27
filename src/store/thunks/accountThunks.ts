import {createAsyncThunk} from '@reduxjs/toolkit';
import {Account} from '@/types';
import {accountRepository} from '@/repositories';

/**
 * 从数据库加载所有账户
 */
export const loadAccounts = createAsyncThunk(
  'accounts/loadAccounts',
  async (_, {rejectWithValue}) => {
    try {
      const accounts = await accountRepository.findAll();
      return accounts;
    } catch (error) {
      console.error('加载账户失败:', error);
      return rejectWithValue('Failed to load accounts');
    }
  },
);

/**
 * 创建新账户
 */
export const createAccount = createAsyncThunk(
  'accounts/createAccount',
  async (account: Account, {rejectWithValue}) => {
    try {
      await accountRepository.create(account);
      return account;
    } catch (error) {
      console.error('创建账户失败:', error);
      return rejectWithValue('Failed to create account');
    }
  },
);

/**
 * 更新账户
 */
export const updateAccount = createAsyncThunk(
  'accounts/updateAccount',
  async (account: Account, {rejectWithValue}) => {
    try {
      await accountRepository.update(account);
      return account;
    } catch (error) {
      console.error('更新账户失败:', error);
      return rejectWithValue('Failed to update account');
    }
  },
);

/**
 * 删除账户
 */
export const deleteAccount = createAsyncThunk(
  'accounts/deleteAccount',
  async (accountId: string, {rejectWithValue}) => {
    try {
      await accountRepository.delete(accountId);
      return accountId;
    } catch (error) {
      console.error('删除账户失败:', error);
      return rejectWithValue('Failed to delete account');
    }
  },
);

/**
 * 更新账户余额
 */
export const updateAccountBalance = createAsyncThunk(
  'accounts/updateAccountBalance',
  async (payload: {accountId: string; balance: number}, {rejectWithValue}) => {
    try {
      await accountRepository.updateBalance(payload.accountId, payload.balance);
      return payload;
    } catch (error) {
      console.error('更新账户余额失败:', error);
      return rejectWithValue('Failed to update account balance');
    }
  },
);
