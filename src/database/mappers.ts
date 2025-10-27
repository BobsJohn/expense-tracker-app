// 数据库 DTO 与领域模型之间的映射工具
import {Account, Transaction, Category, Budget} from '@/types';
import {AccountRow, TransactionRow, CategoryRow, BudgetRow, TransferRow} from './types';

// Account 映射
export const mapAccountRowToDomain = (row: AccountRow): Account => {
  return {
    id: row.id,
    name: row.name,
    type: row.type as Account['type'],
    balance: row.balance,
    currency: row.currency,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
};

export const mapAccountToRow = (account: Account): AccountRow => {
  return {
    id: account.id,
    name: account.name,
    type: account.type,
    balance: account.balance,
    currency: account.currency,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
};

// Transaction 映射
export const mapTransactionRowToDomain = (row: TransactionRow): Transaction => {
  return {
    id: row.id,
    accountId: row.accountId,
    amount: row.amount,
    category: row.category,
    description: row.description,
    date: row.date,
    type: row.type as Transaction['type'],
    memo: row.memo ?? undefined,
    transferId: row.transferId ?? undefined,
    relatedAccountId: row.relatedAccountId ?? undefined,
  };
};

export const mapTransactionToRow = (transaction: Transaction): TransactionRow => {
  return {
    id: transaction.id,
    accountId: transaction.accountId,
    amount: transaction.amount,
    category: transaction.category,
    description: transaction.description,
    date: transaction.date,
    type: transaction.type,
    memo: transaction.memo ?? null,
    transferId: transaction.transferId ?? null,
    relatedAccountId: transaction.relatedAccountId ?? null,
  };
};

// Category 映射
export const mapCategoryRowToDomain = (row: CategoryRow): Category => {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    color: row.color,
    type: row.type as Category['type'],
    isDefault: row.isDefault === 1,
  };
};

export const mapCategoryToRow = (category: Category): CategoryRow => {
  return {
    id: category.id,
    name: category.name,
    icon: category.icon,
    color: category.color,
    type: category.type,
    isDefault: category.isDefault ? 1 : 0,
  };
};

// Budget 映射
export const mapBudgetRowToDomain = (row: BudgetRow): Budget => {
  return {
    id: row.id,
    category: row.category,
    budgetedAmount: row.budgetedAmount,
    spentAmount: row.spentAmount,
    period: row.period as Budget['period'],
    currency: row.currency,
    alertThreshold: row.alertThreshold ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
};

export const mapBudgetToRow = (budget: Budget): BudgetRow => {
  return {
    id: budget.id,
    category: budget.category,
    budgetedAmount: budget.budgetedAmount,
    spentAmount: budget.spentAmount,
    period: budget.period,
    currency: budget.currency,
    alertThreshold: budget.alertThreshold ?? null,
    createdAt: budget.createdAt,
    updatedAt: budget.updatedAt,
  };
};

// Transfer 映射（辅助类型）
export interface Transfer {
  id: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  date: string;
  memo?: string;
  createdAt: string;
}

export const mapTransferRowToDomain = (row: TransferRow): Transfer => {
  return {
    id: row.id,
    sourceAccountId: row.sourceAccountId,
    destinationAccountId: row.destinationAccountId,
    amount: row.amount,
    date: row.date,
    memo: row.memo ?? undefined,
    createdAt: row.createdAt,
  };
};

export const mapTransferToRow = (transfer: Transfer): TransferRow => {
  return {
    id: transfer.id,
    sourceAccountId: transfer.sourceAccountId,
    destinationAccountId: transfer.destinationAccountId,
    amount: transfer.amount,
    date: transfer.date,
    memo: transfer.memo ?? null,
    createdAt: transfer.createdAt,
  };
};
