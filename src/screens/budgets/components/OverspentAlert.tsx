import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';

import Card from '@/components/ui/Card';
import {Budget} from '@/types';

interface OverspentAlertProps {
  budgets: (Budget & {
    progressPercentage: number;
    remainingAmount: number;
    isOverBudget: boolean;
    isNearThreshold: boolean;
    progressColor: string;
  })[];
}

const OverspentAlert: React.FC<OverspentAlertProps> = ({budgets}) => {
  const {t} = useTranslation();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD', // TODO: Get from app settings
    }).format(amount);
  };

  const totalOverspent = budgets.reduce(
    (sum, budget) => sum + Math.max(0, budget.spentAmount - budget.budgetedAmount),
    0,
  );

  return (
    <Card style={styles.alertCard}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.alertIcon}>⚠️</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{t('budgets.budgetAlert', 'Budget Alert')}</Text>
            <Text style={styles.subtitle}>
              {budgets.length === 1
                ? t('budgets.oneBudgetOver', '1 budget is over limit')
                : t('budgets.multipleBudgetsOver', `${budgets.length} budgets are over limit`)}
            </Text>
          </View>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {t('budgets.totalOverspent', `Total overspent: ${formatCurrency(totalOverspent)}`)}
          </Text>
        </View>

        <View style={styles.budgetList}>
          {budgets.slice(0, 3).map((budget, index) => (
            <View key={budget.id} style={styles.budgetRow}>
              <Text style={styles.budgetCategory}>
                {t(`budgets.categories.${budget.category.toLowerCase()}`, budget.category)}
              </Text>
              <Text style={styles.overspentAmount}>
                +{formatCurrency(budget.spentAmount - budget.budgetedAmount)}
              </Text>
            </View>
          ))}
          {budgets.length > 3 && (
            <Text style={styles.moreText}>
              {t('budgets.andMore', `and ${budgets.length - 3} more...`)}
            </Text>
          )}
        </View>

        <View style={styles.actions}>
          <Text style={styles.actionText}>
            {t(
              'budgets.reviewBudgets',
              'Review your budgets to adjust spending or increase limits.',
            )}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  alertCard: {
    backgroundColor: '#FFF5F5',
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
    marginTop: 8,
  },
  container: {
    padding: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertIcon: {
    fontSize: 16,
    color: '#FFF',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF3B30',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  summary: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
    textAlign: 'center',
  },
  budgetList: {
    marginBottom: 12,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#FFEBEE',
  },
  budgetCategory: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    flex: 1,
  },
  overspentAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
  },
  moreText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  actions: {
    borderTopWidth: 1,
    borderTopColor: '#FFEBEE',
    paddingTop: 12,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default OverspentAlert;
