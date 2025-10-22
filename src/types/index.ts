export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

export interface Budget {
  id: string;
  category: string;
  budgetedAmount: number;
  spentAmount: number;
  period: 'monthly' | 'yearly';
  currency: string;
}

export interface AppState {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  loading: boolean;
  error: string | null;
}

export type RootStackParamList = {
  Dashboard: undefined;
  Accounts: undefined;
  AccountDetails: { accountId: string };
  Budgets: undefined;
  BudgetDetails: { budgetId: string };
  Transactions: undefined;
  AddTransaction: { accountId?: string };
  Settings: undefined;
};

export type BottomTabParamList = {
  Dashboard: undefined;
  Accounts: undefined;
  Budgets: undefined;
  Transactions: undefined;
  Settings: undefined;
};