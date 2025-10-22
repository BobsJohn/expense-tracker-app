import React, {useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '@/hooks/useAppSelector';
import {selectAccountById, selectTransactionsByAccount} from '@/store/selectors';
import Card from '@/components/ui/Card';
import VirtualizedList from '@/components/ui/VirtualizedList';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorState from '@/components/common/ErrorState';
import {formatCurrency} from '@/utils/currency';
import {Transaction} from '@/types';
import {RootStackParamList} from '@/types';

type AccountDetailsRouteProp = RouteProp<RootStackParamList, 'AccountDetails'>;

const AccountDetailsScreen: React.FC = () => {
  const {t} = useTranslation();
  const route = useRoute<AccountDetailsRouteProp>();
  const {accountId} = route.params;

  const account = useAppSelector(state => selectAccountById(state, accountId));
  const transactions = useAppSelector(state => selectTransactionsByAccount(state, accountId));
  const isLoading = useAppSelector(state => state.accounts.loading || state.transactions.loading);
  const error = useAppSelector(state => state.accounts.error || state.transactions.error);

  const accountStats = useMemo(() => {
    if (!transactions.length) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        transactionCount: 0,
        averageTransaction: 0,
      };
    }

    const income = transactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    const expenses = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      transactionCount: transactions.length,
      averageTransaction: (income + expenses) / transactions.length,
    };
  }, [transactions]);

  const renderTransaction = ({item}: {item: Transaction}) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionContent}>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <Text style={styles.transactionCategory}>{item.category}</Text>
        </View>
        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              item.type === 'income' ? styles.incomeAmount : styles.expenseAmount,
            ]}>
            {item.type === 'income' ? '+' : '-'}
            {formatCurrency(Math.abs(item.amount))}
          </Text>
          <Text style={styles.transactionDate}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!account) {
    return <ErrorState message={t('errors.accountNotFound')} showRetry={false} />;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Account Summary */}
      <Card>
        <View style={styles.accountHeader}>
          <Text style={styles.accountName}>{account.name}</Text>
          <Text style={styles.accountType}>{t(`accounts.accountTypes.${account.type}`)}</Text>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>{t('accounts.balance')}</Text>
          <Text
            style={[
              styles.balanceAmount,
              account.balance < 0 ? styles.negativeBalance : styles.positiveBalance,
            ]}>
            {formatCurrency(account.balance)}
          </Text>
        </View>
      </Card>

      {/* Account Statistics */}
      <Card>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatCurrency(accountStats.totalIncome)}</Text>
            <Text style={styles.statLabel}>Total Income</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatCurrency(accountStats.totalExpenses)}</Text>
            <Text style={styles.statLabel}>Total Expenses</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{accountStats.transactionCount}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {formatCurrency(accountStats.averageTransaction || 0)}
            </Text>
            <Text style={styles.statLabel}>Average</Text>
          </View>
        </View>
      </Card>

      {/* Transactions */}
      <Card style={styles.transactionsCard}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.length > 0 ? (
          <VirtualizedList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={item => item.id}
            itemHeight={80}
            style={styles.transactionsList}
          />
        ) : (
          <Text style={styles.emptyText}>No transactions found</Text>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  accountHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  accountName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  accountType: {
    fontSize: 16,
    color: '#666',
    textTransform: 'capitalize',
  },
  balanceContainer: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  positiveBalance: {
    color: '#34C759',
  },
  negativeBalance: {
    color: '#FF3B30',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  transactionsCard: {
    marginBottom: 20,
  },
  transactionsList: {
    maxHeight: 400,
  },
  transactionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#666',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  incomeAmount: {
    color: '#34C759',
  },
  expenseAmount: {
    color: '#FF3B30',
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
});

export default AccountDetailsScreen;
