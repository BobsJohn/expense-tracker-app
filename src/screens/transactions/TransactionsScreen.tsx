import React, {useState, useMemo} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {useAppSelector} from '@/hooks/useAppSelector';
import {
  selectFilteredTransactions,
  selectFilteredTransactionsSummary,
  TransactionFilters,
} from '@/store/selectors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorState from '@/components/common/ErrorState';
import {formatCurrency} from '@/utils/currency';
import {Transaction} from '@/types';
import TransactionFormModal from './components/TransactionFormModal';
import FilterPanel from './components/FilterPanel';
import TransactionItem from './components/TransactionItem';
import EmptyState from './components/EmptyState';

const TransactionsScreen: React.FC = () => {
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [filterPanelVisible, setFilterPanelVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const transactions = useAppSelector(state => selectFilteredTransactions(state, filters));
  const summary = useAppSelector(state => selectFilteredTransactionsSummary(state, filters));
  const isLoading = useAppSelector(state => state.transactions.loading);
  const error = useAppSelector(state => state.transactions.error);

  const hasActiveFilters = useMemo(() => {
    return Boolean(
      filters.keyword ||
        filters.category ||
        filters.accountId ||
        filters.type ||
        filters.startDate ||
        filters.endDate,
    );
  }, [filters]);

  const openFormModal = (transaction?: Transaction) => {
    setEditingTransaction(transaction ?? null);
    setFormModalVisible(true);
  };

  const closeFormModal = () => {
    setFormModalVisible(false);
    setEditingTransaction(null);
  };

  const openFilterPanel = () => {
    setFilterPanelVisible(true);
  };

  const closeFilterPanel = () => {
    setFilterPanelVisible(false);
  };

  const handleApplyFilters = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
  };

  const renderHeader = () => (
    <Card style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>交易摘要</Text>
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>收入</Text>
          <Text style={[styles.summaryValue, styles.incomeValue]}>
            {formatCurrency(summary.totalIncome, 'USD')}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>支出</Text>
          <Text style={[styles.summaryValue, styles.expenseValue]}>
            {formatCurrency(-summary.totalExpense, 'USD')}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>净额</Text>
          <Text
            style={[
              styles.summaryValue,
              summary.netBalance >= 0 ? styles.incomeValue : styles.expenseValue,
            ]}>
            {formatCurrency(summary.netBalance, 'USD')}
          </Text>
        </View>
      </View>
    </Card>
  );

  const renderTransaction = ({item}: {item: Transaction}) => (
    <TransactionItem transaction={item} onEdit={openFormModal} />
  );

  if (isLoading && transactions.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorState
        title="加载失败"
        message={error}
        onRetry={() => {
          /* TODO: implement retry */
        }}
      />
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>交易</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
            onPress={openFilterPanel}>
            <Text
              style={[styles.filterButtonText, hasActiveFilters && styles.filterButtonTextActive]}>
              {hasActiveFilters ? '🔍 已筛选' : '🔍 筛选'}
            </Text>
          </TouchableOpacity>
          <Button title="添加" onPress={() => openFormModal()} size="small" />
        </View>
      </View>

      {renderHeader()}

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.listContainer,
          transactions.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            hasActiveFilters={hasActiveFilters}
            onAddTransaction={() => openFormModal()}
            onClearFilters={() => setFilters({})}
          />
        }
      />

      <TransactionFormModal
        visible={formModalVisible}
        onClose={closeFormModal}
        transaction={editingTransaction}
      />

      <FilterPanel
        visible={filterPanelVisible}
        onClose={closeFilterPanel}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </GestureHandlerRootView>
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
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  filterButtonActive: {
    backgroundColor: '#E6F0FF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#007AFF',
  },
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5EA',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  incomeValue: {
    color: '#34C759',
  },
  expenseValue: {
    color: '#FF3B30',
  },
  listContainer: {
    paddingBottom: 24,
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default TransactionsScreen;
