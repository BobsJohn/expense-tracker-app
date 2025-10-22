import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/hooks/useAppSelector';
import {
  selectTotalBalance,
  selectMonthlyIncome,
  selectMonthlyExpenses,
  selectRecentTransactions,
  selectBudgetProgress,
} from '@/store/selectors';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatCurrency } from '@/utils/currency';
import { Transaction, Budget } from '@/types';

const DashboardScreen: React.FC = () => {
  const { t } = useTranslation();
  
  const totalBalance = useAppSelector(selectTotalBalance);
  const monthlyIncome = useAppSelector(selectMonthlyIncome);
  const monthlyExpenses = useAppSelector(selectMonthlyExpenses);
  const recentTransactions = useAppSelector(selectRecentTransactions);
  const budgetProgress = useAppSelector(selectBudgetProgress);
  const isLoading = useAppSelector(state => 
    state.accounts.loading || state.transactions.loading || state.budgets.loading
  );

  const limitedTransactions = useMemo(() => 
    recentTransactions.slice(0, 5), [recentTransactions]
  );

  const limitedBudgets = useMemo(() => 
    budgetProgress.slice(0, 3), [budgetProgress]
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionCategory}>{item.category}</Text>
      </View>
      <Text style={[
        styles.transactionAmount,
        item.type === 'income' ? styles.incomeAmount : styles.expenseAmount
      ]}>
        {item.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(item.amount))}
      </Text>
    </View>
  );

  const renderBudget = ({ item }: { item: Budget & { progressPercentage: number; isOverBudget: boolean } }) => (
    <View style={styles.budgetItem}>
      <View style={styles.budgetHeader}>
        <Text style={styles.budgetCategory}>{item.category}</Text>
        <Text style={[
          styles.budgetPercentage,
          item.isOverBudget && styles.overBudgetText
        ]}>
          {Math.round(item.progressPercentage)}%
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill,
            { width: `${Math.min(item.progressPercentage, 100)}%` },
            item.isOverBudget && styles.overBudgetBar
          ]} 
        />
      </View>
      <Text style={styles.budgetAmount}>
        {formatCurrency(item.spentAmount)} / {formatCurrency(item.budgetedAmount)}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('dashboard.title')}</Text>
      
      {/* Balance Overview */}
      <Card>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>{t('dashboard.totalBalance')}</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(totalBalance)}</Text>
        </View>
      </Card>

      {/* Monthly Summary */}
      <Card>
        <View style={styles.monthlyContainer}>
          <View style={styles.monthlyItem}>
            <Text style={styles.monthlyLabel}>{t('dashboard.monthlyIncome')}</Text>
            <Text style={[styles.monthlyAmount, styles.incomeAmount]}>
              {formatCurrency(monthlyIncome)}
            </Text>
          </View>
          <View style={styles.monthlyDivider} />
          <View style={styles.monthlyItem}>
            <Text style={styles.monthlyLabel}>{t('dashboard.monthlyExpenses')}</Text>
            <Text style={[styles.monthlyAmount, styles.expenseAmount]}>
              {formatCurrency(monthlyExpenses)}
            </Text>
          </View>
        </View>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <Text style={styles.sectionTitle}>{t('dashboard.recentTransactions')}</Text>
        {limitedTransactions.length > 0 ? (
          <FlatList
            data={limitedTransactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text style={styles.emptyText}>{t('dashboard.noTransactions')}</Text>
        )}
      </Card>

      {/* Budget Overview */}
      <Card style={styles.lastCard}>
        <Text style={styles.sectionTitle}>{t('dashboard.budgetOverview')}</Text>
        {limitedBudgets.length > 0 ? (
          <FlatList
            data={limitedBudgets}
            renderItem={renderBudget}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text style={styles.emptyText}>No budgets set up</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    margin: 16,
  },
  balanceContainer: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  monthlyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  monthlyItem: {
    flex: 1,
    alignItems: 'center',
  },
  monthlyDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5EA',
  },
  monthlyLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  monthlyAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  incomeAmount: {
    color: '#34C759',
  },
  expenseAmount: {
    color: '#FF3B30',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
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
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  budgetItem: {
    marginBottom: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetCategory: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  budgetPercentage: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  overBudgetText: {
    color: '#FF3B30',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  overBudgetBar: {
    backgroundColor: '#FF3B30',
  },
  budgetAmount: {
    fontSize: 12,
    color: '#666',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  lastCard: {
    marginBottom: 20,
  },
});

export default DashboardScreen;