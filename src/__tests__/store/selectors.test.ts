// Redux selectors 测试
import {
  selectAllAccounts,
  selectAccountById,
  selectTotalBalance,
  selectAllTransactions,
  selectTransactionsByAccountId,
  selectAllCategories,
  selectCategoriesByType,
} from '@/store/selectors';
import {RootState} from '@/store';
import {Account, Transaction, Category} from '@/types';

describe('Redux Selectors', () => {
  const mockAccounts: Account[] = [
    {
      id: '1',
      name: 'Checking',
      type: 'checking',
      balance: 1000,
      currency: 'USD',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Savings',
      type: 'savings',
      balance: 5000,
      currency: 'USD',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      accountId: '1',
      amount: -100,
      category: 'Food',
      description: 'Groceries',
      date: '2024-01-15',
      type: 'expense',
    },
    {
      id: '2',
      accountId: '2',
      amount: 500,
      category: 'Salary',
      description: 'Monthly salary',
      date: '2024-01-01',
      type: 'income',
    },
  ];

  const mockCategories: Category[] = [
    {
      id: '1',
      name: 'Food',
      icon: 'food',
      color: '#FF0000',
      type: 'expense',
      isDefault: true,
    },
    {
      id: '2',
      name: 'Salary',
      icon: 'salary',
      color: '#00FF00',
      type: 'income',
      isDefault: true,
    },
  ];

  const mockState: Partial<RootState> = {
    accounts: {
      accounts: mockAccounts,
      loading: false,
      error: null,
    },
    transactions: {
      transactions: mockTransactions,
      loading: false,
      error: null,
    },
    categories: {
      categories: mockCategories,
      loading: false,
      error: null,
    },
  };

  describe('Account Selectors', () => {
    it('selectAllAccounts 应该返回所有账户', () => {
      const accounts = selectAllAccounts(mockState as RootState);
      expect(accounts).toEqual(mockAccounts);
    });

    it('selectAccountById 应该根据 ID 返回账户', () => {
      const account = selectAccountById(mockState as RootState, '1');
      expect(account).toEqual(mockAccounts[0]);
    });

    it('selectAccountById 对不存在的 ID 应该返回 undefined', () => {
      const account = selectAccountById(mockState as RootState, 'non-existent');
      expect(account).toBeUndefined();
    });

    it('selectTotalBalance 应该计算总余额', () => {
      const totalBalance = selectTotalBalance(mockState as RootState);
      expect(totalBalance).toBe(6000); // 1000 + 5000
    });
  });

  describe('Transaction Selectors', () => {
    it('selectAllTransactions 应该返回所有交易', () => {
      const transactions = selectAllTransactions(mockState as RootState);
      expect(transactions).toEqual(mockTransactions);
    });

    it('selectTransactionsByAccountId 应该返回指定账户的交易', () => {
      const transactions = selectTransactionsByAccountId(mockState as RootState, '1');
      expect(transactions).toHaveLength(1);
      expect(transactions[0].accountId).toBe('1');
    });
  });

  describe('Category Selectors', () => {
    it('selectAllCategories 应该返回所有分类', () => {
      const categories = selectAllCategories(mockState as RootState);
      expect(categories).toEqual(mockCategories);
    });

    it('selectCategoriesByType 应该返回指定类型的分类', () => {
      const expenseCategories = selectCategoriesByType(mockState as RootState, 'expense');
      expect(expenseCategories).toHaveLength(1);
      expect(expenseCategories[0].type).toBe('expense');

      const incomeCategories = selectCategoriesByType(mockState as RootState, 'income');
      expect(incomeCategories).toHaveLength(1);
      expect(incomeCategories[0].type).toBe('income');
    });
  });
});
