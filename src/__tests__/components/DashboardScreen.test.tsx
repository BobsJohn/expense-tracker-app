import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';

import DashboardScreen from '@/screens/dashboard/DashboardScreen';
import accountsSlice from '@/store/slices/accountsSlice';
import transactionsSlice from '@/store/slices/transactionsSlice';
import budgetsSlice from '@/store/slices/budgetsSlice';
import appSlice from '@/store/slices/appSlice';

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      accounts: accountsSlice,
      transactions: transactionsSlice,
      budgets: budgetsSlice,
      app: appSlice,
    },
    preloadedState: {
      accounts: {
        accounts: [
          {
            id: '1',
            name: 'Test Account',
            type: 'checking',
            balance: 1000,
            currency: 'USD',
          },
        ],
        loading: false,
        error: null,
      },
      transactions: {
        transactions: [
          {
            id: '1',
            accountId: '1',
            amount: 100,
            category: 'Test',
            description: 'Test transaction',
            date: '2024-01-15',
            type: 'income',
          },
        ],
        loading: false,
        error: null,
      },
      budgets: {
        budgets: [
          {
            id: '1',
            category: 'Food',
            budgetedAmount: 500,
            spentAmount: 200,
            period: 'monthly',
            currency: 'USD',
          },
        ],
        loading: false,
        error: null,
      },
      app: {
        isLoading: false,
        error: null,
        theme: 'light',
        language: 'en',
      },
      ...initialState,
    },
  });
};

const renderWithProviders = (component: React.ReactElement, store = createMockStore()) => {
  return render(
    <Provider store={store}>
      <NavigationContainer>
        {component}
      </NavigationContainer>
    </Provider>
  );
};

describe('DashboardScreen', () => {
  it('renders without crashing', () => {
    renderWithProviders(<DashboardScreen />);
    expect(screen.getByText('dashboard.title')).toBeTruthy();
  });

  it('displays total balance', () => {
    renderWithProviders(<DashboardScreen />);
    expect(screen.getByText('dashboard.totalBalance')).toBeTruthy();
  });

  it('shows loading spinner when loading', () => {
    const loadingStore = createMockStore({
      accounts: {
        accounts: [],
        loading: true,
        error: null,
      },
    });
    
    renderWithProviders(<DashboardScreen />, loadingStore);
    expect(screen.getByText('common.loading')).toBeTruthy();
  });

  it('displays recent transactions section', () => {
    renderWithProviders(<DashboardScreen />);
    expect(screen.getByText('dashboard.recentTransactions')).toBeTruthy();
  });

  it('displays budget overview section', () => {
    renderWithProviders(<DashboardScreen />);
    expect(screen.getByText('dashboard.budgetOverview')).toBeTruthy();
  });

  it('handles empty transactions gracefully', () => {
    const emptyTransactionsStore = createMockStore({
      transactions: {
        transactions: [],
        loading: false,
        error: null,
      },
    });
    
    renderWithProviders(<DashboardScreen />, emptyTransactionsStore);
    expect(screen.getByText('dashboard.noTransactions')).toBeTruthy();
  });

  it('displays monthly income and expenses', () => {
    renderWithProviders(<DashboardScreen />);
    expect(screen.getByText('dashboard.monthlyIncome')).toBeTruthy();
    expect(screen.getByText('dashboard.monthlyExpenses')).toBeTruthy();
  });
});