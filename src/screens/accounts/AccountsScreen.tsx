import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectAccounts, selectAccountsByType } from '@/store/selectors';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatCurrency } from '@/utils/currency';
import { Account } from '@/types';
import { RootStackParamList } from '@/types';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Accounts'>;

const AccountsScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  
  const accounts = useAppSelector(selectAccounts);
  const accountsByType = useAppSelector(selectAccountsByType);
  const isLoading = useAppSelector(state => state.accounts.loading);

  const accountSections = useMemo(() => {
    return Object.entries(accountsByType).map(([type, accountList]) => ({
      type,
      accounts: accountList,
      total: accountList.reduce((sum, account) => sum + account.balance, 0),
    }));
  }, [accountsByType]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const navigateToAccountDetails = (accountId: string) => {
    navigation.navigate('AccountDetails', { accountId });
  };

  const renderAccount = ({ item }: { item: Account }) => (
    <TouchableOpacity
      onPress={() => navigateToAccountDetails(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.accountItem}>
        <View style={styles.accountInfo}>
          <Text style={styles.accountName}>{item.name}</Text>
          <Text style={styles.accountType}>
            {t(`accounts.accountTypes.${item.type}`)}
          </Text>
        </View>
        <Text style={[
          styles.accountBalance,
          item.balance < 0 ? styles.negativeBalance : styles.positiveBalance
        ]}>
          {formatCurrency(item.balance)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSection = (section: { type: string; accounts: Account[]; total: number }) => (
    <Card key={section.type} style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t(`accounts.accountTypes.${section.type}`)} Accounts
        </Text>
        <Text style={[
          styles.sectionTotal,
          section.total < 0 ? styles.negativeBalance : styles.positiveBalance
        ]}>
          {formatCurrency(section.total)}
        </Text>
      </View>
      <FlatList
        data={section.accounts}
        renderItem={renderAccount}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('accounts.title')}</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {/* TODO: Navigate to add account */}}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={accountSections}
        renderItem={({ item }) => renderSection(item)}
        keyExtractor={(item) => item.type}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  sectionCard: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  sectionTotal: {
    fontSize: 16,
    fontWeight: '600',
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  accountType: {
    fontSize: 14,
    color: '#666',
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: '600',
  },
  positiveBalance: {
    color: '#34C759',
  },
  negativeBalance: {
    color: '#FF3B30',
  },
});

export default AccountsScreen;