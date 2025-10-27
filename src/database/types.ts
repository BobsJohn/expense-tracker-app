// 数据库表的行类型定义（DTO）

export interface AccountRow {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionRow {
  id: string;
  accountId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: string;
  memo: string | null;
  transferId: string | null;
  relatedAccountId: string | null;
}

export interface CategoryRow {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: string;
  isDefault: number;
}

export interface BudgetRow {
  id: string;
  category: string;
  budgetedAmount: number;
  spentAmount: number;
  period: string;
  currency: string;
  alertThreshold: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsRow {
  key: string;
  value: string;
}

export interface TransferRow {
  id: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  date: string;
  memo: string | null;
  createdAt: string;
}

export interface DatabaseVersion {
  version: number;
}
