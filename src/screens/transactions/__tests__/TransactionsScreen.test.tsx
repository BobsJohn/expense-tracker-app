import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import TransactionsScreen from '../TransactionsScreen';
import transactionsSlice from '@/store/slices/transactionsSlice';
import accountsSlice from '@/store/slices/accountsSlice';
import categoriesSlice from '@/store/slices/categoriesSlice';
import appSlice from '@/store/slices/appSlice';
import budgetsSlice from '@/store/slices/budgetsSlice';

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    GestureHandlerRootView: View,
    Swipeable: View,
  };
});

jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

const createTestStore = () => {
  return configureStore({
    reducer: {
      transactions: transactionsSlice,
      accounts: accountsSlice,
      categories: categoriesSlice,
      app: appSlice,
      budgets: budgetsSlice,
    },
    preloadedState: {
      transactions: {
        transactions: [],
        loading: false,
        error: null,
      },
      accounts: {
        accounts: [],
        loading: false,
        error: null,
      },
      categories: {
        categories: [],
        loading: false,
        error: null,
      },
      app: {
        isLoading: false,
        error: null,
        theme: 'light' as const,
        language: 'en',
      },
      budgets: {
        budgets: [],
        loading: false,
        error: null,
      },
    },
  });
};

describe('TransactionsScreen', () => {
  it('renders without crashing', () => {
    const store = createTestStore();
    const {getByText} = render(
      <Provider store={store}>
        <TransactionsScreen />
      </Provider>,
    );

    expect(getByText('交易')).toBeTruthy();
  });

  it('shows empty state when no transactions', () => {
    const store = createTestStore();
    const {getByText} = render(
      <Provider store={store}>
        <TransactionsScreen />
      </Provider>,
    );

    expect(getByText('还没有交易')).toBeTruthy();
  });

  it('displays transaction summary', () => {
    const store = createTestStore();
    const {getByText} = render(
      <Provider store={store}>
        <TransactionsScreen />
      </Provider>,
    );

    expect(getByText('交易摘要')).toBeTruthy();
    expect(getByText('收入')).toBeTruthy();
    expect(getByText('支出')).toBeTruthy();
    expect(getByText('净额')).toBeTruthy();
  });
});
