// 数据映射器测试
import {
  mapAccountRowToDomain,
  mapAccountToRow,
  mapTransactionRowToDomain,
  mapTransactionToRow,
  mapCategoryRowToDomain,
  mapCategoryToRow,
  mapBudgetRowToDomain,
  mapBudgetToRow,
} from '@/database/mappers';
import {Account, Transaction, Category, Budget} from '@/types';

describe('数据映射器测试', () => {
  describe('Account 映射', () => {
    it('应该将账户行数据映射到领域模型', () => {
      const row = {
        id: '1',
        name: 'Test Account',
        type: 'checking',
        balance: 1000,
        currency: 'USD',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const account = mapAccountRowToDomain(row);

      expect(account).toEqual({
        id: '1',
        name: 'Test Account',
        type: 'checking',
        balance: 1000,
        currency: 'USD',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      });
    });

    it('应该将账户领域模型映射到行数据', () => {
      const account: Account = {
        id: '1',
        name: 'Test Account',
        type: 'checking',
        balance: 1000,
        currency: 'USD',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const row = mapAccountToRow(account);

      expect(row).toEqual({
        id: '1',
        name: 'Test Account',
        type: 'checking',
        balance: 1000,
        currency: 'USD',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      });
    });
  });

  describe('Transaction 映射', () => {
    it('应该将交易行数据映射到领域模型（包含可选字段）', () => {
      const row = {
        id: '1',
        accountId: 'acc1',
        amount: -100,
        category: 'Food',
        description: 'Groceries',
        date: '2024-01-01',
        type: 'expense',
        memo: 'Weekly shopping',
        transferId: null,
        relatedAccountId: null,
      };

      const transaction = mapTransactionRowToDomain(row);

      expect(transaction).toEqual({
        id: '1',
        accountId: 'acc1',
        amount: -100,
        category: 'Food',
        description: 'Groceries',
        date: '2024-01-01',
        type: 'expense',
        memo: 'Weekly shopping',
      });
    });

    it('应该将交易领域模型映射到行数据（null 值处理）', () => {
      const transaction: Transaction = {
        id: '1',
        accountId: 'acc1',
        amount: -100,
        category: 'Food',
        description: 'Groceries',
        date: '2024-01-01',
        type: 'expense',
      };

      const row = mapTransactionToRow(transaction);

      expect(row).toEqual({
        id: '1',
        accountId: 'acc1',
        amount: -100,
        category: 'Food',
        description: 'Groceries',
        date: '2024-01-01',
        type: 'expense',
        memo: null,
        transferId: null,
        relatedAccountId: null,
      });
    });
  });

  describe('Category 映射', () => {
    it('应该将分类行数据映射到领域模型（isDefault 为 1）', () => {
      const row = {
        id: 'cat1',
        name: 'Food',
        icon: 'food-icon',
        color: '#FF0000',
        type: 'expense',
        isDefault: 1,
      };

      const category = mapCategoryRowToDomain(row);

      expect(category.isDefault).toBe(true);
    });

    it('应该将分类领域模型映射到行数据（isDefault 转为数字）', () => {
      const category: Category = {
        id: 'cat1',
        name: 'Food',
        icon: 'food-icon',
        color: '#FF0000',
        type: 'expense',
        isDefault: true,
      };

      const row = mapCategoryToRow(category);

      expect(row.isDefault).toBe(1);
    });
  });

  describe('Budget 映射', () => {
    it('应该将预算行数据映射到领域模型', () => {
      const row = {
        id: 'budget1',
        category: 'Food',
        budgetedAmount: 500,
        spentAmount: 250,
        period: 'monthly',
        currency: 'USD',
        alertThreshold: 80,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const budget = mapBudgetRowToDomain(row);

      expect(budget).toEqual({
        id: 'budget1',
        category: 'Food',
        budgetedAmount: 500,
        spentAmount: 250,
        period: 'monthly',
        currency: 'USD',
        alertThreshold: 80,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      });
    });
  });
});
