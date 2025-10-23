import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Account} from '@/types';
import {executeTransfer} from '@/store/actions/transfers';

interface AccountsState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountsState = {
  accounts: [
    {
      id: '1',
      name: 'Main Checking',
      type: 'checking',
      balance: 2500.0,
      currency: 'USD',
      createdAt: '2023-12-01T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z',
    },
    {
      id: '2',
      name: 'Savings Account',
      type: 'savings',
      balance: 15000.0,
      currency: 'USD',
      createdAt: '2023-10-10T08:00:00Z',
      updatedAt: '2024-01-10T08:00:00Z',
    },
    {
      id: '3',
      name: 'Credit Card',
      type: 'credit',
      balance: -850.0,
      currency: 'USD',
      createdAt: '2023-11-05T08:00:00Z',
      updatedAt: '2024-01-18T08:00:00Z',
    },
  ],
  loading: false,
  error: null,
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addAccount: (state, action: PayloadAction<Account>) => {
      const now = new Date().toISOString();
      state.accounts.push({
        ...action.payload,
        createdAt: action.payload.createdAt ?? now,
        updatedAt: action.payload.updatedAt ?? now,
      });
    },
    updateAccount: (state, action: PayloadAction<Account>) => {
      const index = state.accounts.findIndex(acc => acc.id === action.payload.id);
      if (index !== -1) {
        state.accounts[index] = {
          ...action.payload,
          updatedAt: action.payload.updatedAt ?? new Date().toISOString(),
        };
      }
    },
    deleteAccount: (state, action: PayloadAction<string>) => {
      state.accounts = state.accounts.filter(acc => acc.id !== action.payload);
    },
    updateAccountBalance: (state, action: PayloadAction<{accountId: string; amount: number}>) => {
      const account = state.accounts.find(acc => acc.id === action.payload.accountId);
      if (account) {
        account.balance += action.payload.amount;
        account.updatedAt = new Date().toISOString();
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(executeTransfer, (state, action) => {
      const {sourceAccountId, destinationAccountId, amount, timestamp} = action.payload;
      if (amount <= 0) {
        return;
      }

      const sourceAccount = state.accounts.find(acc => acc.id === sourceAccountId);
      const destinationAccount = state.accounts.find(acc => acc.id === destinationAccountId);

      if (sourceAccount) {
        sourceAccount.balance -= amount;
        sourceAccount.updatedAt = timestamp;
      }

      if (destinationAccount) {
        destinationAccount.balance += amount;
        destinationAccount.updatedAt = timestamp;
      }
    });
  },
});

export const {
  setLoading,
  setError,
  addAccount,
  updateAccount,
  deleteAccount,
  updateAccountBalance,
} = accountsSlice.actions;

export default accountsSlice.reducer;
