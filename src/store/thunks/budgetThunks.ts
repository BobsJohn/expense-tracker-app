import {createAsyncThunk} from '@reduxjs/toolkit';
import {Budget} from '@/types';
import {budgetRepository} from '@/repositories';

/**
 * 从数据库加载所有预算
 */
export const loadBudgets = createAsyncThunk(
  'budgets/loadBudgets',
  async (_, {rejectWithValue}) => {
    try {
      const budgets = await budgetRepository.findAll();
      return budgets;
    } catch (error) {
      console.error('加载预算失败:', error);
      return rejectWithValue('Failed to load budgets');
    }
  },
);

/**
 * 创建新预算
 */
export const createBudget = createAsyncThunk(
  'budgets/createBudget',
  async (budget: Budget, {rejectWithValue}) => {
    try {
      await budgetRepository.create(budget);
      return budget;
    } catch (error) {
      console.error('创建预算失败:', error);
      return rejectWithValue('Failed to create budget');
    }
  },
);

/**
 * 更新预算
 */
export const updateBudget = createAsyncThunk(
  'budgets/updateBudget',
  async (budget: Budget, {rejectWithValue}) => {
    try {
      await budgetRepository.update(budget);
      return budget;
    } catch (error) {
      console.error('更新预算失败:', error);
      return rejectWithValue('Failed to update budget');
    }
  },
);

/**
 * 删除预算
 */
export const deleteBudget = createAsyncThunk(
  'budgets/deleteBudget',
  async (budgetId: string, {rejectWithValue}) => {
    try {
      await budgetRepository.delete(budgetId);
      return budgetId;
    } catch (error) {
      console.error('删除预算失败:', error);
      return rejectWithValue('Failed to delete budget');
    }
  },
);

/**
 * 更新预算的已支出金额
 */
export const updateBudgetSpent = createAsyncThunk(
  'budgets/updateBudgetSpent',
  async (payload: {id: string; spentAmount: number}, {rejectWithValue}) => {
    try {
      await budgetRepository.updateSpentAmount(payload.id, payload.spentAmount);
      return payload;
    } catch (error) {
      console.error('更新预算支出失败:', error);
      return rejectWithValue('Failed to update budget spent amount');
    }
  },
);
