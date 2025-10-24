import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {configureStore} from '@reduxjs/toolkit';

import ExportScreen from '@/screens/export/ExportScreen';
import accountsSlice from '@/store/slices/accountsSlice';
import transactionsSlice from '@/store/slices/transactionsSlice';
import budgetsSlice from '@/store/slices/budgetsSlice';
import categoriesSlice from '@/store/slices/categoriesSlice';
import appSlice from '@/store/slices/appSlice';
import exportService from '@/services/exportService';
import '@/localization/i18n';

// Mock the export service
jest.mock('@/services/exportService', () => ({
  exportData: jest.fn(),
  shareFile: jest.fn(),
  cleanupTempFiles: jest.fn(),
}));

const Stack = createStackNavigator();

const mockStore = configureStore({
  reducer: {
    accounts: accountsSlice,
    transactions: transactionsSlice,
    budgets: budgetsSlice,
    categories: categoriesSlice,
    app: appSlice,
  },
  preloadedState: {
    accounts: {
      accounts: [
        {
          id: '1',
          name: 'Checking Account',
          type: 'checking' as const,
          balance: 1000,
          currency: 'USD',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
        {
          id: '2',
          name: 'Savings Account',
          type: 'savings' as const,
          balance: 5000,
          currency: 'USD',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
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
          amount: -45.67,
          category: 'Food',
          description: 'Grocery shopping',
          date: '2024-01-15',
          type: 'expense' as const,
        },
        {
          id: '2',
          accountId: '1',
          amount: 2500.0,
          category: 'Salary',
          description: 'Monthly salary',
          date: '2024-01-01',
          type: 'income' as const,
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
          budgetedAmount: 500.0,
          spentAmount: 245.67,
          period: 'monthly' as const,
          currency: 'USD',
        },
        {
          id: '2',
          category: 'Transportation',
          budgetedAmount: 300.0,
          spentAmount: 125.0,
          period: 'monthly' as const,
          currency: 'USD',
        },
      ],
      loading: false,
      error: null,
    },
    categories: {
      categories: [
        {
          id: 'category-expense-food',
          name: 'Food',
          icon: 'silverware-fork-knife',
          color: '#FF6B6B',
          type: 'expense' as const,
          isDefault: true,
        },
        {
          id: 'category-income-salary',
          name: 'Salary',
          icon: 'briefcase',
          color: '#34C759',
          type: 'income' as const,
          isDefault: true,
        },
      ],
      loading: false,
      error: null,
    },
    app: {
      loading: false,
      error: null,
    },
  },
});

const TestComponent = () => (
  <Provider store={mockStore}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Export" component={ExportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  </Provider>
);

describe('ExportScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all sections', () => {
    const {getByText} = render(<TestComponent />);

    expect(getByText('Export Format')).toBeTruthy();
    expect(getByText('CSV')).toBeTruthy();
    expect(getByText('Excel (XLSX)')).toBeTruthy();
    expect(getByText('Data to Export')).toBeTruthy();
    expect(getByText('Include Transactions')).toBeTruthy();
    expect(getByText('Include Budgets')).toBeTruthy();
    expect(getByText('Export Data')).toBeTruthy();
  });

  it('allows switching between CSV and XLSX formats', () => {
    const {getByText} = render(<TestComponent />);

    const csvButton = getByText('CSV');
    const xlsxButton = getByText('Excel (XLSX)');

    // CSV should be selected by default
    expect(csvButton.parent?.props.style).toContainEqual(
      expect.objectContaining({backgroundColor: '#007AFF'}),
    );

    // Switch to XLSX
    fireEvent.press(xlsxButton);
    expect(xlsxButton.parent?.props.style).toContainEqual(
      expect.objectContaining({backgroundColor: '#007AFF'}),
    );
  });

  it('allows toggling data type switches', () => {
    const {getByText} = render(<TestComponent />);

    // Find the switches by their labels
    const transactionsSwitch = getByText('Include Transactions').parent?.parent?.children[1];
    const budgetsSwitch = getByText('Include Budgets').parent?.parent?.children[1];

    expect(transactionsSwitch).toBeTruthy();
    expect(budgetsSwitch).toBeTruthy();

    // Both should be enabled by default
    expect(transactionsSwitch?.props.value).toBe(true);
    expect(budgetsSwitch?.props.value).toBe(true);
  });

  it('shows account selection when accounts are available', () => {
    const {getByText} = render(<TestComponent />);

    expect(getByText('Accounts')).toBeTruthy();
    expect(getByText('Checking Account')).toBeTruthy();
    expect(getByText('Savings Account')).toBeTruthy();
    expect(getByText('Select All')).toBeTruthy();
  });

  it('shows category selection when categories are available', () => {
    const {getByText} = render(<TestComponent />);

    expect(getByText('Categories')).toBeTruthy();
    expect(getByText('Food')).toBeTruthy();
    expect(getByText('Salary')).toBeTruthy();
  });

  it('handles account selection correctly', () => {
    const {getByText} = render(<TestComponent />);

    const checkingAccountRow = getByText('Checking Account').parent;
    const selectAllButton = getByText('Select All');

    // Initially no accounts should be selected
    fireEvent.press(checkingAccountRow!);

    // Test select all functionality
    fireEvent.press(selectAllButton);
    expect(getByText('Deselect All')).toBeTruthy();

    // Test deselect all
    fireEvent.press(getByText('Deselect All'));
    expect(getByText('Select All')).toBeTruthy();
  });

  it('handles category selection correctly', () => {
    const {getByText} = render(<TestComponent />);

    const foodCategoryRow = getByText('Food').parent;
    const selectAllButton = getByText('Categories').parent?.children[0].children[1];

    // Select a category
    fireEvent.press(foodCategoryRow!);

    // Test category select all functionality
    fireEvent.press(selectAllButton!);
  });

  it('calls export service when export button is pressed', async () => {
    (exportService.exportData as jest.Mock).mockResolvedValue({
      success: true,
      filePath: '/path/to/export.csv',
    });
    (exportService.cleanupTempFiles as jest.Mock).mockResolvedValue(undefined);

    const {getByText} = render(<TestComponent />);

    const exportButton = getByText('Export Data');
    fireEvent.press(exportButton);

    await waitFor(() => {
      expect(exportService.exportData).toHaveBeenCalledWith(
        expect.any(Array), // transactions
        expect.any(Array), // budgets
        expect.any(Array), // accounts
        expect.objectContaining({
          format: 'csv',
          includeTransactions: true,
          includeBudgets: true,
        }),
      );
    });
  });

  it('handles export errors gracefully', async () => {
    (exportService.exportData as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Export failed',
    });

    const {getByText} = render(<TestComponent />);

    const exportButton = getByText('Export Data');
    fireEvent.press(exportButton);

    await waitFor(() => {
      expect(exportService.exportData).toHaveBeenCalled();
    });
  });

  it('shows loading state during export', async () => {
    (exportService.exportData as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({success: true}), 100)),
    );

    const {getByText} = render(<TestComponent />);

    const exportButton = getByText('Export Data');
    fireEvent.press(exportButton);

    expect(getByText('Exporting...')).toBeTruthy();

    await waitFor(() => {
      expect(getByText('Export Data')).toBeTruthy();
    });
  });

  it('prevents export when no data types are selected', () => {
    const {getByText} = render(<TestComponent />);

    // Disable both data types
    const transactionsSwitch = getByText('Include Transactions').parent?.parent?.children[1];
    const budgetsSwitch = getByText('Include Budgets').parent?.parent?.children[1];

    fireEvent(transactionsSwitch!, 'valueChange', false);
    fireEvent(budgetsSwitch!, 'valueChange', false);

    const exportButton = getByText('Export Data');
    fireEvent.press(exportButton);

    // Should not call export service
    expect(exportService.exportData).not.toHaveBeenCalled();
  });

  it('handles successful export with sharing option', async () => {
    (exportService.exportData as jest.Mock).mockResolvedValue({
      success: true,
      filePath: '/path/to/export.csv',
    });
    (exportService.shareFile as jest.Mock).mockResolvedValue({
      success: true,
    });
    (exportService.cleanupTempFiles as jest.Mock).mockResolvedValue(undefined);

    // Mock Alert.alert to simulate user pressing "Share"
    const mockAlert = jest.spyOn(require('react-native').Alert, 'alert');
    mockAlert.mockImplementation((title, message, buttons) => {
      if (buttons && buttons[1]) {
        buttons[1].onPress();
      }
    });

    const {getByText} = render(<TestComponent />);

    const exportButton = getByText('Export Data');
    fireEvent.press(exportButton);

    await waitFor(() => {
      expect(exportService.exportData).toHaveBeenCalled();
      expect(exportService.shareFile).toHaveBeenCalledWith(
        '/path/to/export.csv',
        'Financial Data Export',
      );
      expect(exportService.cleanupTempFiles).toHaveBeenCalled();
    });

    mockAlert.mockRestore();
  });
});
