// 账户 slice 测试
import accountsReducer, {
  setLoading,
  setError,
  addAccount,
  updateAccountLocal,
  deleteAccountLocal,
} from '@/store/slices/accountsSlice';
import {Account} from '@/types';

describe('accountsSlice', () => {
  const initialState = {
    accounts: [],
    loading: false,
    error: null,
  };

  const mockAccount: Account = {
    id: '1',
    name: 'Test Account',
    type: 'checking',
    balance: 1000,
    currency: 'USD',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  it('应该返回初始状态', () => {
    expect(accountsReducer(undefined, {type: 'unknown'})).toEqual(initialState);
  });

  it('应该处理 setLoading', () => {
    const state = accountsReducer(initialState, setLoading(true));
    expect(state.loading).toBe(true);
  });

  it('应该处理 setError', () => {
    const state = accountsReducer(initialState, setError('测试错误'));
    expect(state.error).toBe('测试错误');
  });

  it('应该处理 addAccount', () => {
    const state = accountsReducer(initialState, addAccount(mockAccount));
    expect(state.accounts).toHaveLength(1);
    expect(state.accounts[0]).toEqual(mockAccount);
  });

  it('应该处理 updateAccountLocal', () => {
    const stateWithAccount = {
      ...initialState,
      accounts: [mockAccount],
    };

    const updatedAccount = {...mockAccount, balance: 2000};
    const state = accountsReducer(stateWithAccount, updateAccountLocal(updatedAccount));

    expect(state.accounts[0].balance).toBe(2000);
  });

  it('应该处理 deleteAccountLocal', () => {
    const stateWithAccount = {
      ...initialState,
      accounts: [mockAccount],
    };

    const state = accountsReducer(stateWithAccount, deleteAccountLocal('1'));
    expect(state.accounts).toHaveLength(0);
  });

  it('应该在 addAccount 时自动设置时间戳', () => {
    const accountWithoutTimestamp = {
      ...mockAccount,
      createdAt: undefined,
      updatedAt: undefined,
    } as any;

    const state = accountsReducer(initialState, addAccount(accountWithoutTimestamp));
    expect(state.accounts[0].createdAt).toBeDefined();
    expect(state.accounts[0].updatedAt).toBeDefined();
  });
});
