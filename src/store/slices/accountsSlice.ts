import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Account} from '@/types';

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
    },
    {
      id: '2',
      name: 'Savings Account',
      type: 'savings',
      balance: 15000.0,
      currency: 'USD',
    },
    {
      id: '3',
      name: 'Credit Card',
      type: 'credit',
      balance: -850.0,
      currency: 'USD',
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
      state.accounts.push(action.payload);
    },
    updateAccount: (state, action: PayloadAction<Account>) => {
      const index = state.accounts.findIndex(acc => acc.id === action.payload.id);
      if (index !== -1) {
        state.accounts[index] = action.payload;
      }
    },
    deleteAccount: (state, action: PayloadAction<string>) => {
      state.accounts = state.accounts.filter(acc => acc.id !== action.payload);
    },
    updateAccountBalance: (state, action: PayloadAction<{accountId: string; amount: number}>) => {
      const account = state.accounts.find(acc => acc.id === action.payload.accountId);
      if (account) {
        account.balance += action.payload.amount;
      }
    },
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
