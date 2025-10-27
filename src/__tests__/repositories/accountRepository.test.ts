// 账户仓储测试（使用 mock 数据库）
import {AccountRepository} from '@/repositories/accountRepository';
import {Account} from '@/types';

// Mock 数据库模块
jest.mock('@/database/database', () => ({
  getDatabase: jest.fn(() => ({
    executeSql: jest.fn(),
  })),
}));

describe('AccountRepository', () => {
  let repository: AccountRepository;
  let mockExecuteSql: jest.Mock;

  beforeEach(() => {
    repository = new AccountRepository();
    // 获取 mock 的 executeSql 方法
    mockExecuteSql = jest.fn();
    jest.spyOn(repository as any, 'executeSql').mockImplementation(mockExecuteSql);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('应该返回所有账户', async () => {
      const mockAccounts = [
        {
          id: '1',
          name: 'Test Account',
          type: 'checking',
          balance: 1000,
          currency: 'USD',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      mockExecuteSql.mockResolvedValue([
        {
          rows: {
            length: 1,
            item: (index: number) => mockAccounts[index],
          },
        },
      ]);

      const accounts = await repository.findAll();
      expect(accounts).toHaveLength(1);
      expect(accounts[0].name).toBe('Test Account');
    });
  });

  describe('create', () => {
    it('应该创建新账户', async () => {
      const account: Account = {
        id: '1',
        name: 'New Account',
        type: 'checking',
        balance: 0,
        currency: 'USD',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockExecuteSql.mockResolvedValue([{rows: {length: 0}}]);

      await repository.create(account);
      expect(mockExecuteSql).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO accounts'),
        expect.any(Array),
      );
    });
  });

  describe('update', () => {
    it('应该更新账户', async () => {
      const account: Account = {
        id: '1',
        name: 'Updated Account',
        type: 'checking',
        balance: 1500,
        currency: 'USD',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      mockExecuteSql.mockResolvedValue([{rows: {length: 0}}]);

      await repository.update(account);
      expect(mockExecuteSql).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE accounts'),
        expect.any(Array),
      );
    });
  });

  describe('delete', () => {
    it('应该删除账户', async () => {
      mockExecuteSql.mockResolvedValue([{rows: {length: 0}}]);

      await repository.delete('1');
      expect(mockExecuteSql).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM accounts'),
        ['1'],
      );
    });
  });

  describe('updateBalance', () => {
    it('应该更新账户余额', async () => {
      mockExecuteSql.mockResolvedValue([{rows: {length: 0}}]);

      await repository.updateBalance('1', 2000);
      expect(mockExecuteSql).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE accounts'),
        expect.arrayContaining([2000, expect.any(String), '1']),
      );
    });
  });
});
