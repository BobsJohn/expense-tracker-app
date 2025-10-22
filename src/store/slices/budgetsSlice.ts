import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Budget } from '@/types';

interface BudgetsState {
  budgets: Budget[];
  loading: boolean;
  error: string | null;
}

const initialState: BudgetsState = {
  budgets: [
    {
      id: '1',
      category: 'Food',
      budgetedAmount: 500.0,
      spentAmount: 245.67,
      period: 'monthly',
      currency: 'USD',
    },
    {
      id: '2',
      category: 'Transportation',
      budgetedAmount: 300.0,
      spentAmount: 125.0,
      period: 'monthly',
      currency: 'USD',
    },
    {
      id: '3',
      category: 'Entertainment',
      budgetedAmount: 200.0,
      spentAmount: 89.99,
      period: 'monthly',
      currency: 'USD',
    },
  ],
  loading: false,
  error: null,
};

const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addBudget: (state, action: PayloadAction<Budget>) => {
      state.budgets.push(action.payload);
    },
    updateBudget: (state, action: PayloadAction<Budget>) => {
      const index = state.budgets.findIndex(budget => budget.id === action.payload.id);
      if (index !== -1) {
        state.budgets[index] = action.payload;
      }
    },
    deleteBudget: (state, action: PayloadAction<string>) => {
      state.budgets = state.budgets.filter(budget => budget.id !== action.payload);
    },
    updateBudgetSpent: (state, action: PayloadAction<{ budgetId: string; amount: number }>) => {
      const budget = state.budgets.find(b => b.id === action.payload.budgetId);
      if (budget) {
        budget.spentAmount += action.payload.amount;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  addBudget,
  updateBudget,
  deleteBudget,
  updateBudgetSpent,
} = budgetsSlice.actions;

export default budgetsSlice.reducer;