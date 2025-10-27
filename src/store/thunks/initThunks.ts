import {createAsyncThunk} from '@reduxjs/toolkit';
import {initDatabase, seedDefaultData} from '@/database';
import {loadAccounts} from './accountThunks';
import {loadTransactions} from './transactionThunks';
import {loadCategories} from './categoryThunks';
import {loadBudgets} from './budgetThunks';

/**
 * 初始化应用数据
 * 在应用启动时调用，负责：
 * 1. 初始化数据库
 * 2. 运行必要的迁移
 * 3. 种子默认数据（如果是首次运行）
 * 4. 从数据库加载所有数据到 Redux store
 */
export const initializeApp = createAsyncThunk(
  'app/initialize',
  async (_, {dispatch, rejectWithValue}) => {
    try {
      console.log('开始初始化应用...');

      // 1. 初始化数据库
      await initDatabase();

      // 2. 种子默认数据（仅在首次运行）
      await seedDefaultData();

      // 3. 加载所有数据到 Redux store
      console.log('从数据库加载数据到 store...');
      await Promise.all([
        dispatch(loadCategories()),
        dispatch(loadAccounts()),
        dispatch(loadTransactions()),
        dispatch(loadBudgets()),
      ]);

      console.log('应用初始化完成');
      return true;
    } catch (error) {
      console.error('应用初始化失败:', error);
      return rejectWithValue('Failed to initialize app');
    }
  },
);
