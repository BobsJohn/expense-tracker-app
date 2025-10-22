import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

// Screens
import DashboardScreen from '@/screens/dashboard/DashboardScreen';
import AccountsScreen from '@/screens/accounts/AccountsScreen';
import AccountDetailsScreen from '@/screens/accounts/AccountDetailsScreen';
import ReportsScreen from '@/screens/reports/ReportsScreen';
import SettingsScreen from '@/screens/settings/SettingsScreen';
import ExportScreen from '@/screens/export/ExportScreen';
// import BudgetsScreen from '@/screens/budgets/BudgetsScreen';
// import TransactionsScreen from '@/screens/transactions/TransactionsScreen';

import { BottomTabParamList, RootStackParamList } from '@/types';

const Tab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Temporary placeholder components for missing screens
import { View, Text, StyleSheet } from 'react-native';

const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={placeholderStyles.container}>
    <Text style={placeholderStyles.text}>{title} - Coming Soon</Text>
  </View>
);

const placeholderStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  text: {
    fontSize: 18,
    color: '#666',
  },
});

const BudgetsScreen = () => <PlaceholderScreen title="Budgets" />;
const TransactionsScreen = () => <PlaceholderScreen title="Transactions" />;

const MainTabs: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopColor: '#E5E5EA',
          paddingTop: 8,
          paddingBottom: 8,
        },
        headerStyle: {
          backgroundColor: '#FFF',
          borderBottomColor: '#E5E5EA',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          title: t('navigation.dashboard'),
          headerShown: false,
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
        name="Transactions" 
        component={TransactionsScreen}
        options={{
          title: t('navigation.transactions'),
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
  const { t } = useTranslation();
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Dashboard"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="AccountDetails"
          component={AccountDetailsScreen}
          options={{ title: 'Account Details' }}
        />
        <Stack.Screen 
          name="Export"
          component={ExportScreen}
          options={{ title: t('export.title') }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;