import React, {useMemo, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {useAppSelector} from '@/hooks/useAppSelector';
import {
  selectAccounts,
  selectAccountsByType,
  selectLatestTransactionByAccount,
} from '@/store/selectors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import {formatCurrency} from '@/utils/currency';
import {Account, RootStackParamList} from '@/types';
import AccountFormModal from './components/AccountFormModal';
import TransferModal from './components/TransferModal';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Accounts'>;

interface AccountSection {
  type: string;
  accounts: Account[];
  total: number;
  currency: string;
}

const AccountsScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  const accounts = useAppSelector(selectAccounts);
  const accountsByType = useAppSelector(selectAccountsByType);
  const latestTransactions = useAppSelector(selectLatestTransactionByAccount);
  const isLoading = useAppSelector(state => state.accounts.loading);

  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [transferSourceId, setTransferSourceId] = useState<string | undefined>();

  const canTransfer = accounts.length > 1;

  const accountSections = useMemo<AccountSection[]>(() => {
    return Object.entries(accountsByType).map(([type, accountList]) => ({
      type,
      accounts: accountList,
      total: accountList.reduce((sum, account) => sum + account.balance, 0),
      currency: accountList[0]?.currency ?? 'USD',
    }));
  }, [accountsByType]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const navigateToAccountDetails = (accountId: string) => {
    navigation.navigate('AccountDetails', {accountId});
  };

  const openAccountModal = (accountToEdit?: Account) => {
    setEditingAccount(accountToEdit ?? null);
    setAccountModalVisible(true);
  };

  const closeAccountModal = () => {
    setAccountModalVisible(false);
    setEditingAccount(null);
  };

  const openTransferModal = (accountId?: string) => {
    setTransferSourceId(accountId);
    setTransferModalVisible(true);
  };

  const closeTransferModal = () => {
    setTransferModalVisible(false);
    setTransferSourceId(undefined);
  };

  const renderAccount = ({item}: {item: Account}) => {
    const recentTransaction = latestTransactions[item.id];

    return (
      <TouchableOpacity
        onPress={() => navigateToAccountDetails(item.id)}
        onLongPress={canTransfer ? () => openTransferModal(item.id) : undefined}
        activeOpacity={0.8}
        delayLongPress={250}>
        <View style={styles.accountItem}>
          <View style={styles.accountInfo}>
            <Text style={styles.accountName}>{item.name}</Text>
            <Text style={styles.accountType}>{t(`accounts.accountTypes.${item.type}`)}</Text>
            {recentTransaction ? (
              <View style={styles.activityContainer}>
                <Text style={styles.activityDescription} numberOfLines={1}>
                  {recentTransaction.description || t('accounts.transferActivityLabel')}
                </Text>
                <Text
                  style={[
                    styles.activityMeta,
                    recentTransaction.type === 'income'
                      ? styles.incomeAmount
                      : styles.expenseAmount,
                  ]}>
                  {formatCurrency(recentTransaction.amount, item.currency)} ·{' '}
                  {new Date(recentTransaction.date).toLocaleDateString()}
                </Text>
              </View>
            ) : (
              <Text style={styles.activityDescription}>{t('accounts.noRecentActivity')}</Text>
            )}
          </View>
          <View style={styles.accountRight}>
            <Text
              style={[
                styles.accountBalance,
                item.balance < 0 ? styles.negativeBalance : styles.positiveBalance,
              ]}>
              {formatCurrency(item.balance, item.currency)}
            </Text>
            {canTransfer && (
              <TouchableOpacity
                style={styles.transferLink}
                onPress={() => openTransferModal(item.id)}
                activeOpacity={0.7}>
                <Text style={styles.transferLinkText}>{t('accounts.transfer')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = ({item}: {item: AccountSection}) => (
    <Card style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t(`accounts.accountTypes.${item.type}`)} {t('accounts.sectionTitleSuffix', 'Accounts')}
        </Text>
        <Text
          style={[
            styles.sectionTotal,
            item.total < 0 ? styles.negativeBalance : styles.positiveBalance,
          ]}>
          {formatCurrency(item.total, item.currency)}
        </Text>
      </View>
      <FlatList
        data={item.accounts}
        renderItem={renderAccount}
        keyExtractor={account => account.id}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.accountSeparator} />}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('accounts.title')}</Text>
        <View style={styles.headerActions}>
          <Button
            title={t('accounts.transfer')}
            onPress={() => openTransferModal()}
            variant="secondary"
            size="small"
            disabled={!canTransfer}
            style={styles.headerButton}
          />
          <Button
            title={t('accounts.addAccount')}
            onPress={() => openAccountModal()}
            size="small"
            style={styles.headerButton}
          />
        </View>
      </View>

      <FlatList
        data={accountSections}
        renderItem={renderSection}
        keyExtractor={item => item.type}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContainer, accounts.length === 0 && styles.listEmpty]}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>{t('accounts.emptyTitle')}</Text>
            <Text style={styles.emptySubtitle}>{t('accounts.emptySubtitle')}</Text>
            <Button
              title={t('accounts.addAccount')}
              onPress={() => openAccountModal()}
              size="small"
              style={styles.emptyButton}
            />
          </View>
        )}
      />

      <AccountFormModal
        visible={accountModalVisible}
        account={editingAccount}
        onClose={closeAccountModal}
      />

      <TransferModal
        visible={transferModalVisible}
        onClose={closeTransferModal}
        sourceAccountId={transferSourceId}
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    minWidth: 120,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  sectionCard: {
    marginBottom: 16,
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
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  accountSeparator: {
    height: 1,
    backgroundColor: '#F2F2F7',
  },
  accountInfo: {
    flex: 1,
    marginRight: 12,
  },
  accountRight: {
    alignItems: 'flex-end',
    minWidth: 120,
  },
  accountName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  accountType: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  activityContainer: {
    marginTop: 6,
  },
  activityDescription: {
    fontSize: 13,
    color: '#666',
  },
  activityMeta: {
    fontSize: 13,
    marginTop: 2,
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
  incomeAmount: {
    color: '#34C759',
  },
  expenseAmount: {
    color: '#FF3B30',
  },
  transferLink: {
    marginTop: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    backgroundColor: '#E6F0FF',
  },
  transferLinkText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 160,
  },
});

export default AccountsScreen;
