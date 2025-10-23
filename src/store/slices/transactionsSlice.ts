import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Transaction} from '@/types';
import {executeTransfer} from '@/store/actions/transfers';

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [
    {
      id: '1',
      accountId: '1',
      amount: -45.67,
      category: 'Food',
      description: 'Grocery shopping',
      date: '2024-01-15',
      type: 'expense',
    },
    {
      id: '2',
      accountId: '1',
      amount: 2500.0,
      category: 'Salary',
      description: 'Monthly salary',
      date: '2024-01-01',
      type: 'income',
    },
    {
      id: '3',
      accountId: '2',
      amount: 500.0,
      category: 'Transfer',
      description: 'Monthly savings',
      date: '2024-01-02',
      type: 'income',
    },
  ],
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
    builder.addCase(executeTransfer, (state, action) => {
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
