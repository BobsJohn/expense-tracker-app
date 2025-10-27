import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@/theme';

// Screens
import LoginScreen from '@/screens/auth/LoginScreen';
import AccountsScreen from '@/screens/accounts/AccountsScreen';
import AccountDetailsScreen from '@/screens/accounts/AccountDetailsScreen';
import ReportsScreen from '@/screens/reports/ReportsScreen';
import SettingsScreen from '@/screens/settings/SettingsScreen';
import CategoryManagementScreen from '@/screens/settings/CategoryManagementScreen';
import ExportScreen from '@/screens/export/ExportScreen';
import BudgetsScreen from '@/screens/budgets/BudgetsScreen';
import TransactionsScreen from '@/screens/transactions/TransactionsScreen';

import {BottomTabParamList, RootStackParamList} from '@/types';

const Tab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const MainTabs: React.FC = () => {
  const {t} = useTranslation();
  const {theme} = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.borderLight,
          paddingTop: 8,
          paddingBottom: 8,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.borderLight,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: theme.colors.textPrimary,
        },
      }}>
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          title: t('navigation.transactions'),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Accounts"
        component={AccountsScreen}
        options={{
          title: t('navigation.accounts'),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Budgets"
        component={BudgetsScreen}
        options={{
          title: t('navigation.budgets'),
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          title: t('navigation.reports'),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: t('navigation.settings'),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const {t} = useTranslation();
  const {theme, themeMode} = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Navigation theme for React Navigation
  const navigationTheme = {
    dark: themeMode === 'dark',
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.background,
      text: theme.colors.textPrimary,
      border: theme.colors.borderLight,
      notification: theme.colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.textPrimary,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        {!isAuthenticated ? (
          // Auth Stack
          <Stack.Screen name="Login" options={{headerShown: false}}>
            {() => <LoginScreen onLogin={() => setIsAuthenticated(true)} />}
          </Stack.Screen>
        ) : (
          // Main App Stack
          <>
            <Stack.Screen name="Dashboard" component={MainTabs} options={{headerShown: false}} />
            <Stack.Screen
              name="AccountDetails"
              component={AccountDetailsScreen}
              options={{title: 'Account Details'}}
            />
            <Stack.Screen
              name="CategoryManagement"
              component={CategoryManagementScreen}
              options={{title: t('categoryManagement.title')}}
            />
            <Stack.Screen
              name="Export"
              component={ExportScreen}
              options={{title: t('export.title')}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
