import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Category, CategoryType} from '@/types';

const createDefaultCategory = (
  id: string,
  name: string,
  icon: string,
  color: string,
  type: CategoryType,
): Category => ({
  id,
  name,
  icon,
  color,
  type,
  isDefault: true,
});

const DEFAULT_CATEGORIES: Category[] = [
  createDefaultCategory('default-expense-food', 'Food', 'silverware-fork-knife', '#FF6B6B', 'expense'),
  createDefaultCategory('default-expense-transportation', 'Transportation', 'car', '#FFA502', 'expense'),
  createDefaultCategory('default-expense-housing', 'Housing', 'home-city', '#1E90FF', 'expense'),
  createDefaultCategory('default-expense-utilities', 'Utilities', 'flash', '#3742FA', 'expense'),
  createDefaultCategory('default-expense-healthcare', 'Healthcare', 'heart-pulse', '#FF4757', 'expense'),
  createDefaultCategory('default-expense-entertainment', 'Entertainment', 'music-note', '#A29BFE', 'expense'),
  createDefaultCategory('default-expense-shopping', 'Shopping', 'shopping', '#2ED573', 'expense'),
  createDefaultCategory('default-expense-insurance', 'Insurance', 'shield-check', '#70A1FF', 'expense'),
  createDefaultCategory('default-expense-subscriptions', 'Subscriptions', 'repeat', '#FF6B81', 'expense'),
  createDefaultCategory('default-expense-transfer', 'Transfer', 'swap-horizontal', '#57606F', 'expense'),
  createDefaultCategory('default-expense-other', 'Other', 'dots-horizontal', '#8395A7', 'expense'),
  createDefaultCategory('default-income-salary', 'Salary', 'briefcase', '#34C759', 'income'),
  createDefaultCategory('default-income-bonus', 'Bonus', 'gift', '#FF9F1C', 'income'),
  createDefaultCategory('default-income-investments', 'Investments', 'chart-line', '#1E90FF', 'income'),
  createDefaultCategory('default-income-gifts', 'Gifts', 'hand-heart', '#FF6B6B', 'income'),
  createDefaultCategory('default-income-interest', 'Interest', 'percent', '#5352ED', 'income'),
  createDefaultCategory('default-income-refunds', 'Refunds', 'cash-refund', '#2ED573', 'income'),
  createDefaultCategory('default-income-sales', 'Sales', 'cart-arrow-down', '#FF4757', 'income'),
  createDefaultCategory('default-income-rental', 'Rental Income', 'home-currency-usd', '#3742FA', 'income'),
  createDefaultCategory('default-income-transfer', 'Transfer', 'swap-horizontal', '#57606F', 'income'),
  createDefaultCategory('default-income-other', 'Other', 'dots-horizontal', '#8395A7', 'income'),
];

export interface CategoryInput {
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
}

export interface CategoryUpdatePayload {
  id: string;
  updates: CategoryInput;
  previous: Category;
}

export interface CategoryDeletePayload {
  id: string;
  category: Category;
  reassignmentCategory?: Category;
}

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: DEFAULT_CATEGORIES,
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
    addCategory: {
      reducer: (state, action: PayloadAction<Category>) => {
        const duplicate = state.categories.some(
          category =>
            category.type === action.payload.type &&
            category.name.toLowerCase() === action.payload.name.toLowerCase(),
        );

        if (duplicate) {
          state.error = 'CATEGORY_DUPLICATE';
          return;
        }

        state.categories.push(action.payload);
        state.error = null;
      },
      prepare: (input: CategoryInput) => {
        const trimmedName = input.name.trim();
        return {
          payload: {
            ...input,
            id: `category-${Date.now()}`,
            name: trimmedName,
            isDefault: false,
          } as Category,
        };
      },
    },
    updateCategory: (state, action: PayloadAction<CategoryUpdatePayload>) => {
      const {id, updates} = action.payload;
      const index = state.categories.findIndex(category => category.id === id);

      if (index === -1) {
        return;
      }

      const existing = state.categories[index];

      if (existing.isDefault) {
        state.error = 'CATEGORY_READ_ONLY';
        return;
      }

      const trimmedName = updates.name.trim();
      const normalizedUpdates = {...updates, name: trimmedName};

      const duplicate = state.categories.some(category => {
        if (category.id === existing.id) {
          return false;
        }

        return (
          category.type === normalizedUpdates.type &&
          category.name.toLowerCase() === normalizedUpdates.name.toLowerCase()
        );
      });

      if (duplicate) {
        state.error = 'CATEGORY_DUPLICATE';
        return;
      }

      state.categories[index] = {
        ...existing,
        ...normalizedUpdates,
      };
      state.error = null;
    },
    deleteCategory: (state, action: PayloadAction<CategoryDeletePayload>) => {
      const index = state.categories.findIndex(category => category.id === action.payload.id);

      if (index === -1) {
        return;
      }

      if (state.categories[index].isDefault) {
        state.error = 'CATEGORY_READ_ONLY';
        return;
      }

      state.categories.splice(index, 1);
      state.error = null;
    },
  },
});

export const defaultCategories = DEFAULT_CATEGORIES;

export const {setLoading, setError, clearError, addCategory, updateCategory, deleteCategory} =
  categoriesSlice.actions;

export default categoriesSlice.reducer;
