import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

import Card from '@/components/ui/Card';
import ProgressBar from '@/components/common/ProgressBar';

interface BudgetSummaryProps {
  summary: {
    totalBudgeted: number;
    totalSpent: number;
    totalRemaining: number;
    overspentCount: number;
    totalOverspent: number;
    progressPercentage: number;
  };
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({summary}) => {
  const {t} = useTranslation();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD', // TODO: Get from app settings
    }).format(amount);
  };

  const getProgressColor = () => {
    if (summary.overspentCount > 0) {
      return '#FF3B30';
    }
    if (summary.progressPercentage >= 80) {
      return '#FF9500';
    }
    return '#34C759';
  };

  const getSummaryStatus = () => {
    if (summary.overspentCount > 0) {
      return {
        text: t('budgets.overBudgetSummary', `${summary.overspentCount} budgets over limit`),
        color: '#FF3B30',
      };
    }
    if (summary.progressPercentage >= 80) {
      return {
        text: t('budgets.nearLimitSummary', 'Approaching budget limits'),
        color: '#FF9500',
      };
    }
    return {
      text: t('budgets.onTrackSummary', 'All budgets on track'),
      color: '#34C759',
    };
  };

  const status = getSummaryStatus();

  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('budgets.overview')}</Text>
          <View style={[styles.statusBadge, {backgroundColor: status.color}]}>
            <Text style={styles.statusText}>{status.text}</Text>
          </View>
        </View>

        <View style={styles.amountGrid}>
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>{t('budgets.totalBudgeted')}</Text>
            <Text style={styles.amountValue}>{formatCurrency(summary.totalBudgeted)}</Text>
          </View>

          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>{t('budgets.totalSpent')}</Text>
            <Text style={[styles.amountValue, summary.overspentCount > 0 && styles.overspentText]}>
              {formatCurrency(summary.totalSpent)}
            </Text>
          </View>

          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>
              {summary.totalRemaining >= 0
                ? t('budgets.totalRemaining')
                : t('budgets.totalOverspent')}
            </Text>
            <Text style={[styles.amountValue, summary.totalRemaining < 0 && styles.overspentText]}>
              {formatCurrency(Math.abs(summary.totalRemaining))}
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>{t('budgets.overallProgress')}</Text>
            <Text style={styles.progressPercentage}>{Math.round(summary.progressPercentage)}%</Text>
          </View>

          <ProgressBar
            progress={summary.progressPercentage}
            progressColor={getProgressColor()}
            height={16}
            style={styles.progressBar}
          />

          {summary.totalOverspent > 0 && (
            <Text style={styles.overspentNote}>
              {t('budgets.overspentBy', `Overspent by ${formatCurrency(summary.totalOverspent)}`)}
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
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  amountGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  amountCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  overspentText: {
    color: '#FF3B30',
  },
  progressSection: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  progressBar: {
    marginBottom: 8,
  },
  overspentNote: {
    fontSize: 12,
    color: '#FF3B30',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default BudgetSummary;
