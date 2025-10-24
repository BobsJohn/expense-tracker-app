import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Budget} from '@/types';
import {updateCategory, deleteCategory} from './categoriesSlice';

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
      alertThreshold: 80,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    },
    {
      id: '2',
      category: 'Transportation',
      budgetedAmount: 300.0,
      spentAmount: 125.0,
      period: 'monthly',
      currency: 'USD',
      alertThreshold: 75,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z',
    },
    {
      id: '3',
      category: 'Entertainment',
      budgetedAmount: 200.0,
      spentAmount: 189.99,
      period: 'monthly',
      currency: 'USD',
      alertThreshold: 90,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z',
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
    addBudget: (
      state,
      action: PayloadAction<Omit<Budget, 'id' | 'createdAt' | 'updatedAt' | 'spentAmount'>>,
    ) => {
      const now = new Date().toISOString();
      const newBudget: Budget = {
        ...action.payload,
        id: Date.now().toString(),
        spentAmount: 0,
        createdAt: now,
        updatedAt: now,
      };
      state.budgets.push(newBudget);
    },
    updateBudget: (state, action: PayloadAction<Budget>) => {
      const index = state.budgets.findIndex(budget => budget.id === action.payload.id);
      if (index !== -1) {
        state.budgets[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteBudget: (state, action: PayloadAction<string>) => {
      state.budgets = state.budgets.filter(budget => budget.id !== action.payload);
    },
    updateBudgetSpent: (state, action: PayloadAction<{budgetId: string; amount: number}>) => {
      const budget = state.budgets.find(b => b.id === action.payload.budgetId);
      if (budget) {
        budget.spentAmount += action.payload.amount;
        budget.updatedAt = new Date().toISOString();
      }
    },
    resetBudgetSpending: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        // Reset specific budget
        const budget = state.budgets.find(b => b.id === action.payload);
        if (budget) {
          budget.spentAmount = 0;
          budget.updatedAt = new Date().toISOString();
        }
      } else {
        // Reset all budgets (for monthly reset)
        state.budgets.forEach(budget => {
          budget.spentAmount = 0;
          budget.updatedAt = new Date().toISOString();
        });
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(updateCategory, (state, action) => {
        const previousName = action.payload.previous.name;
        const newName = action.payload.updates.name.trim();

        if (previousName === newName) {
          return;
        }

        state.budgets = state.budgets.map(budget => {
          if (budget.category !== previousName) {
            return budget;
          }

          return {
            ...budget,
            category: newName,
            updatedAt: new Date().toISOString(),
          };
        });
      })
      .addCase(deleteCategory, (state, action) => {
        const removedCategory = action.payload.category;

        if (!removedCategory) {
          return;
        }

        if (action.payload.reassignmentCategory) {
          const replacementName = action.payload.reassignmentCategory.name;
          state.budgets = state.budgets.map(budget => {
            if (budget.category !== removedCategory.name) {
              return budget;
            }

            return {
              ...budget,
              category: replacementName,
              updatedAt: new Date().toISOString(),
            };
          });
        } else {
          state.budgets = state.budgets.filter(budget => budget.category !== removedCategory.name);
        }
      });
  },
});

export const {
  setLoading,
  setError,
  addBudget,
  updateBudget,
  deleteBudget,
  updateBudgetSpent,
  resetBudgetSpending,
} = budgetsSlice.actions;

export default budgetsSlice.reducer;
