import React, {useMemo, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import Toast from 'react-native-toast-message';

import {useAppSelector} from '@/hooks/useAppSelector';
import {selectAccountById, selectAccounts, selectTransactionsByAccount} from '@/store/selectors';
import Card from '@/components/ui/Card';
import VirtualizedList from '@/components/ui/VirtualizedList';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorState from '@/components/common/ErrorState';
import Button from '@/components/ui/Button';
import AccountFormModal from './components/AccountFormModal';
import TransferModal from './components/TransferModal';
import {formatCurrency} from '@/utils/currency';
import {Transaction, RootStackParamList} from '@/types';
import {deleteAccount} from '@/store/slices/accountsSlice';
import {deleteTransactionsByAccount} from '@/store/slices/transactionsSlice';
import {AppDispatch} from '@/store';
import {triggerHapticFeedback} from '@/utils/haptics';

type AccountDetailsRouteProp = RouteProp<RootStackParamList, 'AccountDetails'>;
type AccountDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'AccountDetails'>;

const AccountDetailsScreen: React.FC = () => {
  const {t} = useTranslation();
  const route = useRoute<AccountDetailsRouteProp>();
  const navigation = useNavigation<AccountDetailsNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const {accountId} = route.params;

  const account = useAppSelector(state => selectAccountById(state, accountId));
  const transactions = useAppSelector(state => selectTransactionsByAccount(state, accountId));
  const isLoading = useAppSelector(state => state.accounts.loading || state.transactions.loading);
  const error = useAppSelector(state => state.accounts.error || state.transactions.error);
  const accountsCount = useAppSelector(selectAccounts).length;
  const canTransfer = accountsCount > 1;

  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);

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
          {item.memo ? <Text style={styles.transactionMemo}>{item.memo}</Text> : null}
        </View>
        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              item.type === 'income' ? styles.incomeAmount : styles.expenseAmount,
            ]}>
            {formatCurrency(item.amount, account?.currency)}
          </Text>
          <Text style={styles.transactionDate}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
      </View>
    </View>
  );

  const handleDeleteAccount = () => {
    if (!account) {
      return;
    }

    const hasBalance = Math.abs(account.balance) > 0.009;

    if (hasBalance) {
      const message = canTransfer
        ? t('accounts.deleteBlockedMessage')
        : t('accounts.deleteBlockedNoAccounts');

      Alert.alert(
        t('accounts.deleteBlockedTitle'),
        message,
        canTransfer
          ? [
              {
                text: t('accounts.transfer'),
                onPress: () => setTransferModalVisible(true),
              },
              {
                text: t('common.cancel'),
                style: 'cancel',
              },
            ]
          : [
              {
                text: t('common.cancel'),
                style: 'cancel',
              },
            ],
      );
      return;
    }

    Alert.alert(t('accounts.deleteAccount'), t('accounts.deleteConfirmation', {name: account.name}), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          dispatch(deleteAccount(account.id));
          dispatch(deleteTransactionsByAccount(account.id));
          triggerHapticFeedback.light();
          Toast.show({type: 'success', text1: t('success.accountDeleted')});
          navigation.goBack();
        },
      },
    ]);
  };

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
      <Card>
        <View style={styles.accountHeader}>
          <View style={styles.headerInfo}>
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
              {formatCurrency(account.balance, account.currency)}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>{t('accounts.currency')}</Text>
          <Text style={styles.metaValue}>{account.currency}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>{t('accounts.createdAt')}</Text>
          <Text style={styles.metaValue}>{new Date(account.createdAt).toLocaleDateString()}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>{t('accounts.updatedAt')}</Text>
          <Text style={styles.metaValue}>{new Date(account.updatedAt).toLocaleString()}</Text>
        </View>

        <View style={styles.actionRow}>
          <Button
            title={t('accounts.transfer')}
            onPress={() => setTransferModalVisible(true)}
            variant="secondary"
            size="small"
            disabled={!canTransfer}
            style={styles.actionButton}
          />
          <Button
            title={t('common.edit')}
            onPress={() => setAccountModalVisible(true)}
            variant="secondary"
            size="small"
            style={styles.actionButton}
          />
          <Button
            title={t('common.delete')}
            onPress={handleDeleteAccount}
            variant="danger"
            size="small"
            style={styles.actionButton}
          />
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>{t('accounts.statisticsTitle', 'Statistics')}</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatCurrency(accountStats.totalIncome, account.currency)}</Text>
            <Text style={styles.statLabel}>{t('accounts.totalIncomeLabel', 'Total Income')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatCurrency(accountStats.totalExpenses, account.currency)}</Text>
            <Text style={styles.statLabel}>{t('accounts.totalExpenseLabel', 'Total Expenses')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{accountStats.transactionCount}</Text>
            <Text style={styles.statLabel}>{t('accounts.transactionCountLabel', 'Transactions')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {formatCurrency(accountStats.averageTransaction || 0, account.currency)}
            </Text>
            <Text style={styles.statLabel}>{t('accounts.averageTransactionLabel', 'Average')}</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.transactionsCard}>
        <Text style={styles.sectionTitle}>{t('accounts.recentTransactions')}</Text>
        {transactions.length > 0 ? (
          <VirtualizedList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={item => item.id}
            itemHeight={90}
            style={styles.transactionsList}
          />
        ) : (
          <Text style={styles.emptyText}>{t('transactions.noTransactions')}</Text>
        )}
      </Card>

      <AccountFormModal
        visible={accountModalVisible}
        account={account}
        onClose={() => setAccountModalVisible(false)}
      />
      <TransferModal
        visible={transferModalVisible}
        sourceAccountId={account.id}
        onClose={() => setTransferModalVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
    marginRight: 12,
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
    alignItems: 'flex-end',
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
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  metaLabel: {
    fontSize: 14,
    color: '#666',
  },
  metaValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
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
    maxHeight: 420,
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
  transactionMemo: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  transactionRight: {
    alignItems: 'flex-end',
    marginLeft: 16,
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
