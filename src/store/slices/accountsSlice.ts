import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Account} from '@/types';
import {executeTransfer} from '@/store/actions/transfers';
import {
  loadAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  updateAccountBalance,
} from '@/store/thunks/accountThunks';

interface AccountsState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountsState = {
  accounts: [],
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
    updateAccountLocal: (state, action: PayloadAction<Account>) => {
      const index = state.accounts.findIndex(acc => acc.id === action.payload.id);
      if (index !== -1) {
        state.accounts[index] = {
          ...action.payload,
          updatedAt: action.payload.updatedAt ?? new Date().toISOString(),
        };
      }
    },
    deleteAccountLocal: (state, action: PayloadAction<string>) => {
      state.accounts = state.accounts.filter(acc => acc.id !== action.payload);
    },
    updateAccountBalanceLocal: (state, action: PayloadAction<{accountId: string; amount: number}>) => {
      const account = state.accounts.find(acc => acc.id === action.payload.accountId);
      if (account) {
        account.balance += action.payload.amount;
        account.updatedAt = new Date().toISOString();
      }
    },
  },
  extraReducers: builder => {
    builder
      // loadAccounts
      .addCase(loadAccounts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(loadAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // createAccount
      .addCase(createAccount.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts.push(action.payload);
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updateAccount
      .addCase(updateAccount.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.accounts.findIndex(acc => acc.id === action.payload.id);
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // deleteAccount
      .addCase(deleteAccount.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = state.accounts.filter(acc => acc.id !== action.payload);
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updateAccountBalance
      .addCase(updateAccountBalance.fulfilled, (state, action) => {
        const account = state.accounts.find(acc => acc.id === action.payload.accountId);
        if (account) {
          account.balance = action.payload.balance;
          account.updatedAt = new Date().toISOString();
        }
      })
      // executeTransfer
      .addCase(executeTransfer, (state, action) => {
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
  updateAccountLocal,
  deleteAccountLocal,
  updateAccountBalanceLocal,
} = accountsSlice.actions;

export default accountsSlice.reducer;
