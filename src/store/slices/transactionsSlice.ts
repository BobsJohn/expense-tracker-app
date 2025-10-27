import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Transaction} from '@/types';
import {executeTransfer} from '@/store/actions/transfers';
import {updateCategory as updateCategoryAction, deleteCategory as deleteCategoryAction} from './categoriesSlice';
import {
  loadTransactions,
  createTransaction,
  updateTransaction as updateTransactionThunk,
  deleteTransaction as deleteTransactionThunk,
} from '@/store/thunks/transactionThunks';

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload); // Add to beginning for chronological order
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex(tx => tx.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(tx => tx.id !== action.payload);
    },
    deleteTransactionsByAccount: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(tx => tx.accountId !== action.payload);
    },
  },
  extraReducers: builder => {
    builder
      // loadTransactions
      .addCase(loadTransactions.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(loadTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // createTransaction
      .addCase(createTransaction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.unshift(action.payload.transaction);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updateTransaction
      .addCase(updateTransactionThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransactionThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.transactions.findIndex(tx => tx.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(updateTransactionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // deleteTransaction
      .addCase(deleteTransactionThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransactionThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.filter(tx => tx.id !== action.payload);
      })
      .addCase(deleteTransactionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // executeTransfer
      .addCase(executeTransfer, (state, action) => {
        const {
          transferId,
          sourceAccountId,
          sourceAccountName,
          destinationAccountId,
          destinationAccountName,
          amount,
          timestamp,
          memo,
        } = action.payload;

        if (amount <= 0) {
          return;
        }

        const outgoing: Transaction = {
          id: `${transferId}-out`,
          accountId: sourceAccountId,
          amount: -amount,
          category: 'Transfer',
          description: `Transfer to ${destinationAccountName}`,
          date: timestamp,
          type: 'expense',
          memo,
          transferId,
          relatedAccountId: destinationAccountId,
        };

        const incoming: Transaction = {
          id: `${transferId}-in`,
          accountId: destinationAccountId,
          amount,
          category: 'Transfer',
          description: `Transfer from ${sourceAccountName}`,
          date: timestamp,
          type: 'income',
          memo,
          transferId,
          relatedAccountId: sourceAccountId,
        };

        state.transactions.unshift(outgoing);
        state.transactions.unshift(incoming);
      })
      // updateCategory
      .addCase(updateCategoryAction, (state, action) => {
        const {previous, updates} = action.payload;
        const newName = updates.name.trim();
        const nameChanged = previous.name !== newName;
        const typeChanged = previous.type !== updates.type;

        if (!nameChanged && !typeChanged) {
          return;
        }

        state.transactions = state.transactions.map(transaction => {
          const matchesCategory =
            transaction.category === previous.name && transaction.type === previous.type;

          if (!matchesCategory) {
            return transaction;
          }

          return {
            ...transaction,
            category: nameChanged ? newName : transaction.category,
            type: typeChanged ? updates.type : transaction.type,
          };
        });
      })
      // deleteCategory
      .addCase(deleteCategoryAction, (state, action) => {
        const {category, reassignmentCategory} = action.payload;

        if (!category) {
          return;
        }

        state.transactions = state.transactions.map(transaction => {
          const matchesCategory =
            transaction.category === category.name && transaction.type === category.type;

          if (!matchesCategory) {
            return transaction;
          }

          if (reassignmentCategory) {
            return {
              ...transaction,
              category: reassignmentCategory.name,
              type: reassignmentCategory.type,
            };
          }

          return {
            ...transaction,
            category: 'Uncategorized',
          };
        });
      });
  },
});

export const {
  setLoading,
  setError,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  deleteTransactionsByAccount,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
