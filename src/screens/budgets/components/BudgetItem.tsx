import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import Toast from 'react-native-toast-message';

import Card from '@/components/ui/Card';
import ProgressBar from '@/components/common/ProgressBar';
import {deleteBudget} from '@/store/slices/budgetsSlice';
import {Budget} from '@/types';
import {triggerHapticFeedback} from '@/utils/haptics';

interface BudgetItemProps {
  budget: Budget & {
    progressPercentage: number;
    remainingAmount: number;
    isOverBudget: boolean;
    isNearThreshold: boolean;
    progressColor: string;
  };
  onEdit: () => void;
}

const BudgetItem: React.FC<BudgetItemProps> = ({budget, onEdit}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const handleDelete = () => {
    triggerHapticFeedback.light();
    dispatch(deleteBudget(budget.id));
    Toast.show({
      type: 'success',
      text1: t('success.budgetDeleted'),
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: budget.currency,
    }).format(amount);
  };

  const getStatusText = () => {
    if (budget.isOverBudget) {
      return t('budgets.overBudget');
    }
    if (budget.isNearThreshold) {
      return t('budgets.nearLimit', `Near limit (${budget.alertThreshold}%)`);
    }
    return t('budgets.onTrack', 'On track');
  };

  const getStatusColor = () => {
    if (budget.isOverBudget) {
      return '#FF3B30';
    }
    if (budget.isNearThreshold) {
      return '#FF9500';
    }
    return '#34C759';
  };

  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.category}>
              {t(`budgets.categories.${budget.category.toLowerCase()}`, budget.category)}
            </Text>
            <View style={[styles.statusBadge, {backgroundColor: getStatusColor()}]}>
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
              <Text style={styles.editText}>{t('common.edit')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
              <Text style={styles.deleteText}>{t('common.delete')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.amountRow}>
          <View style={styles.amountInfo}>
            <Text style={styles.amountLabel}>{t('budgets.spent')}</Text>
            <Text style={[styles.amountValue, budget.isOverBudget && styles.overspentAmount]}>
              {formatCurrency(budget.spentAmount)}
            </Text>
          </View>
          <View style={styles.amountInfo}>
            <Text style={styles.amountLabel}>{t('budgets.budgeted')}</Text>
            <Text style={styles.amountValue}>{formatCurrency(budget.budgetedAmount)}</Text>
          </View>
          <View style={styles.amountInfo}>
            <Text style={styles.amountLabel}>
              {budget.remainingAmount >= 0 ? t('budgets.remaining') : t('budgets.overspent')}
            </Text>
            <Text
              style={[styles.amountValue, budget.remainingAmount < 0 && styles.overspentAmount]}>
              {formatCurrency(Math.abs(budget.remainingAmount))}
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <ProgressBar
            progress={budget.progressPercentage}
            progressColor={budget.progressColor}
            height={12}
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>{Math.round(budget.progressPercentage)}%</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.periodText}>
            {t(`budgets.periods.${budget.period}`, budget.period)}
          </Text>
          {budget.alertThreshold && (
            <Text style={styles.thresholdText}>
              {t('budgets.alertAt', `Alert at ${budget.alertThreshold}%`)}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  category: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  editText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  deleteText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '500',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  amountInfo: {
    flex: 1,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  overspentAmount: {
    color: '#FF3B30',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    marginRight: 12,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    minWidth: 40,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodText: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  thresholdText: {
    fontSize: 12,
    color: '#666',
  },
});

export default BudgetItem;
