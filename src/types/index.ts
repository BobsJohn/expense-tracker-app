export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  memo?: string;
  transferId?: string;
  relatedAccountId?: string;
}

export interface Budget {
  id: string;
  category: string;
  budgetedAmount: number;
  spentAmount: number;
  period: 'monthly' | 'yearly';
  currency: string;
  alertThreshold?: number; // Percentage (0-100) at which to trigger alerts
  createdAt: string;
  updatedAt: string;
}

export type TimeGranularity = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface ReportFilters {
  startDate: Date;
  endDate: Date;
  granularity: TimeGranularity;
}

export interface PeriodReportDatum {
  periodKey: string;
  label: string;
  startDate: string;
  endDate: string;
  income: number;
  expense: number;
  transactions: Transaction[];
}

export interface TrendReportDatum {
  periodKey: string;
  label: string;
  value: number;
  transactions: Transaction[];
}

export interface CategoryReportDatum {
  category: string;
  total: number;
  transactions: Transaction[];
}

export interface AccountReportDatum {
  accountId: string;
  accountName: string;
  balance: number;
  transactions: Transaction[];
}

export interface ReportSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  topCategories: CategoryReportDatum[];
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
  AccountDetails: {accountId: string};
  Budgets: undefined;
  BudgetDetails: {budgetId: string};
  Transactions: undefined;
  AddTransaction: {accountId?: string};
  Settings: undefined;
  Export: undefined;
};

export type BottomTabParamList = {
  Dashboard: undefined;
  Reports: undefined;
  Accounts: undefined;
  Budgets: undefined;
  Transactions: undefined;
  Settings: undefined;
};
