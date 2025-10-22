import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  FlatList,
} from 'react-native';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import {useTranslation} from 'react-i18next';
import {
  VictoryArea,
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLine,
  VictoryPie,
  VictoryScatter,
  VictoryStack,
  VictoryTheme,
} from 'victory-native';

import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import {useAppSelector} from '@/hooks/useAppSelector';
import {formatCurrency, formatNumber} from '@/utils/currency';
import {
  AccountReportDatum,
  CategoryReportDatum,
  ReportFilters,
  TimeGranularity,
  Transaction,
} from '@/types';
import {
  selectAccountReports,
  selectCategoryDistributionReport,
  selectIncomeExpenseByPeriod,
  selectIsLoading,
  selectReportSummary,
  selectSpendingTrendReport,
} from '@/store/selectors';

const timeRanges: TimeGranularity[] = ['daily', 'weekly', 'monthly', 'yearly'];

type DrilldownState =
  | {type: 'period' | 'trend'; label: string; transactions: Transaction[]}
  | {type: 'category'; label: string; transactions: Transaction[]}
  | {type: 'account'; label: string; transactions: Transaction[]}
  | null;

const startOfDay = (date: Date): Date => {
  const result = new Date(date.getTime());
  result.setHours(0, 0, 0, 0);
  return result;
};

const rangeForGranularity = (
  granularity: TimeGranularity,
  referenceDate: Date = new Date(),
): {startDate: Date; endDate: Date} => {
  const reference = startOfDay(referenceDate);
  let startDate = startOfDay(reference);
  let endDate = startOfDay(reference);

  switch (granularity) {
    case 'weekly': {
      const diff = (reference.getDay() + 6) % 7; // Monday
      startDate.setDate(reference.getDate() - diff);
      const weekEnd = new Date(startDate.getTime());
      weekEnd.setDate(startDate.getDate() + 6);
      endDate = weekEnd;
      break;
    }
    case 'monthly': {
      startDate.setDate(1);
      endDate = startOfDay(new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0));
      break;
    }
    case 'yearly': {
      startDate.setMonth(0, 1);
      endDate = startOfDay(new Date(startDate.getFullYear(), 11, 31));
      break;
    }
    case 'daily':
    default:
      startDate = reference;
      endDate = reference;
      break;
  }

  return {
    startDate,
    endDate,
  };
};

const ensureValidRange = (start: Date, end: Date) => {
  const normalizedStart = startOfDay(start);
  const normalizedEnd = startOfDay(end);

  if (normalizedStart > normalizedEnd) {
    return {startDate: normalizedStart, endDate: normalizedStart};
  }

  return {startDate: normalizedStart, endDate: normalizedEnd};
};

const formatDateDisplay = (date: Date) =>
  date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const ReportsScreen: React.FC = () => {
  const {t} = useTranslation();

  const [filters, setFilters] = useState<ReportFilters>(() => {
    const {startDate, endDate} = rangeForGranularity('monthly');
    return {
      granularity: 'monthly',
      startDate,
      endDate,
    };
  });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [drilldown, setDrilldown] = useState<DrilldownState>(null);

  const isLoading = useAppSelector(selectIsLoading);
  const incomeExpenseByPeriod = useAppSelector(state =>
    selectIncomeExpenseByPeriod(state, filters),
  );
  const spendingTrend = useAppSelector(state => selectSpendingTrendReport(state, filters));
  const categoryDistribution = useAppSelector(state =>
    selectCategoryDistributionReport(state, filters),
  );
  const accountReports = useAppSelector(state => selectAccountReports(state, filters));
  const summary = useAppSelector(state => selectReportSummary(state, filters));

  const hasChartData =
    incomeExpenseByPeriod.length > 0 ||
    categoryDistribution.length > 0 ||
    accountReports.length > 0 ||
    spendingTrend.length > 0;

  useEffect(() => {
    if (!drilldown) {
      return;
    }

    const stillValid = (() => {
      switch (drilldown.type) {
        case 'period':
          return incomeExpenseByPeriod.some(item => item.label === drilldown.label);
        case 'trend':
          return spendingTrend.some(item => item.label === drilldown.label);
        case 'category':
          return categoryDistribution.some(item => item.category === drilldown.label);
        case 'account':
          return accountReports.some(item => item.accountName === drilldown.label);
        default:
          return false;
      }
    })();

    if (!stillValid) {
      setDrilldown(null);
    }
  }, [drilldown, incomeExpenseByPeriod, spendingTrend, categoryDistribution, accountReports]);

  const incomeSeries = useMemo(
    () =>
      incomeExpenseByPeriod.map(period => ({
        x: period.label,
        y: period.income,
        periodKey: period.periodKey,
      })),
    [incomeExpenseByPeriod],
  );

  const expenseSeries = useMemo(
    () =>
      incomeExpenseByPeriod.map(period => ({
        x: period.label,
        y: period.expense,
        periodKey: period.periodKey,
      })),
    [incomeExpenseByPeriod],
  );

  const trendSeries = useMemo(
    () =>
      spendingTrend.map(period => ({
        x: period.label,
        y: period.value,
        periodKey: period.periodKey,
      })),
    [spendingTrend],
  );

  const categorySeries = useMemo(
    () =>
      categoryDistribution.map(category => ({
        x: category.category,
        y: category.total,
        label: `${category.category}\n${formatNumber(category.total)}`,
      })),
    [categoryDistribution],
  );

  const accountSeries = useMemo(
    () =>
      accountReports.map(account => ({
        x: account.accountName,
        y: account.balance,
        accountId: account.accountId,
      })),
    [accountReports],
  );

  const accountAxisStyle = useMemo(
    () => ({
      ...axisStyles,
      tickLabels: {
        ...axisStyles.tickLabels,
        angle: accountSeries.length > 3 ? -30 : 0,
        textAnchor: accountSeries.length > 3 ? 'end' : 'middle',
        padding: accountSeries.length > 3 ? 12 : axisStyles.tickLabels.padding,
      },
    }),
    [accountSeries.length],
  );

  const handleGranularityChange = (granularity: TimeGranularity) => {
    setFilters(prev => {
      if (prev.granularity === granularity) {
        return prev;
      }

      const {startDate, endDate} = rangeForGranularity(granularity, prev.endDate);
      return {
        granularity,
        startDate,
        endDate,
      };
    });
    setDrilldown(null);
  };

  const handleStartDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS !== 'ios') {
      setShowStartPicker(false);
    }

    if (event.type === 'dismissed' || !selected) {
      return;
    }

    const normalized = startOfDay(selected);

    setFilters(prev => {
      const {startDate, endDate} = ensureValidRange(normalized, prev.endDate);
      return {
        ...prev,
        startDate,
        endDate,
      };
    });
  };

  const handleEndDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS !== 'ios') {
      setShowEndPicker(false);
    }

    if (event.type === 'dismissed' || !selected) {
      return;
    }

    const normalized = startOfDay(selected);

    setFilters(prev => {
      const {startDate, endDate} = ensureValidRange(prev.startDate, normalized);
      return {
        ...prev,
        startDate,
        endDate,
      };
    });
  };

  const handlePeriodSelect = (periodKey: string, type: 'period' | 'trend') => {
    if (type === 'period') {
      const match = incomeExpenseByPeriod.find(item => item.periodKey === periodKey);
      if (match) {
        setDrilldown({
          type,
          label: match.label,
          transactions: match.transactions,
        });
      }
      return;
    }

    const match = spendingTrend.find(item => item.periodKey === periodKey);
    if (match) {
      setDrilldown({
        type,
        label: match.label,
        transactions: match.transactions,
      });
    }
  };

  const handleCategorySelect = (category: CategoryReportDatum) => {
    setDrilldown({
      type: 'category',
      label: category.category,
      transactions: category.transactions,
    });
  };

  const handleAccountSelect = (account: AccountReportDatum) => {
    setDrilldown({
      type: 'account',
      label: account.accountName,
      transactions: account.transactions,
    });
  };

  const renderTransaction = ({item}: {item: Transaction}) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionCategory}>{item.category}</Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          item.type === 'income' ? styles.incomeText : styles.expenseText,
        ]}>
        {item.type === 'income' ? '+' : '-'}
        {formatCurrency(Math.abs(item.amount))}
      </Text>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>{t('reports.title')}</Text>

      <Card>
        <Text style={styles.sectionTitle}>{t('reports.filtersTitle')}</Text>
        <View style={styles.rangeSelector}>
          {timeRanges.map(range => (
            <TouchableOpacity
              key={range}
              style={[
                styles.rangeButton,
                filters.granularity === range && styles.activeRangeButton,
              ]}
              onPress={() => handleGranularityChange(range)}>
              <Text
                style={[
                  styles.rangeButtonText,
                  filters.granularity === range && styles.activeRangeButtonText,
                ]}>
                {t(`reports.ranges.${range}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.datePickerRow}>
          <View style={styles.datePickerColumn}>
            <Text style={styles.filterLabel}>{t('reports.startDate')}</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartPicker(prev => !prev)}>
              <Text style={styles.dateButtonText}>{formatDateDisplay(filters.startDate)}</Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={filters.startDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                maximumDate={filters.endDate}
                onChange={handleStartDateChange}
              />
            )}
          </View>
          <View style={styles.datePickerColumn}>
            <Text style={styles.filterLabel}>{t('reports.endDate')}</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndPicker(prev => !prev)}>
              <Text style={styles.dateButtonText}>{formatDateDisplay(filters.endDate)}</Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={filters.endDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                minimumDate={filters.startDate}
                onChange={handleEndDateChange}
              />
            )}
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>{t('reports.summaryTitle')}</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{t('reports.totalIncome')}</Text>
            <Text style={[styles.summaryValue, styles.incomeText]}>
              {formatCurrency(summary.totalIncome)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{t('reports.totalExpense')}</Text>
            <Text style={[styles.summaryValue, styles.expenseText]}>
              {formatCurrency(summary.totalExpense)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{t('reports.netBalance')}</Text>
            <Text
              style={[
                styles.summaryValue,
                summary.netBalance >= 0 ? styles.incomeText : styles.expenseText,
              ]}>
              {formatCurrency(summary.netBalance)}
            </Text>
          </View>
        </View>
        <View style={styles.topCategories}>
          <Text style={styles.filterLabel}>{t('reports.topCategories')}</Text>
          {summary.topCategories.length > 0 ? (
            summary.topCategories.map(category => (
              <View key={category.category} style={styles.categoryRow}>
                <Text style={styles.categoryName}>{category.category}</Text>
                <Text style={styles.categoryAmount}>{formatCurrency(category.total)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>{t('reports.empty')}</Text>
          )}
        </View>
      </Card>

      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>{t('reports.incomeVsExpense')}</Text>
        </View>
        {incomeExpenseByPeriod.length > 0 ? (
          <VictoryChart theme={VictoryTheme.material} domainPadding={{x: 30, y: 20}}>
            <VictoryAxis style={axisStyles} tickFormat={tick => `${tick}`} />
            <VictoryAxis dependentAxis style={axisStyles} tickFormat={tick => formatNumber(tick)} />
            <VictoryStack colorScale={['#34C759', '#FF3B30']}>
              <VictoryBar
                data={incomeSeries}
                barWidth={16}
                events={[
                  {
                    target: 'data',
                    eventHandlers: {
                      onPressIn: (_evt, props) => {
                        handlePeriodSelect(props.datum.periodKey, 'period');
                        return [];
                      },
                    },
                  },
                ]}
              />
              <VictoryBar
                data={expenseSeries}
                barWidth={16}
                events={[
                  {
                    target: 'data',
                    eventHandlers: {
                      onPressIn: (_evt, props) => {
                        handlePeriodSelect(props.datum.periodKey, 'period');
                        return [];
                      },
                    },
                  },
                ]}
              />
            </VictoryStack>
          </VictoryChart>
        ) : (
          <Text style={styles.emptyText}>{t('reports.empty')}</Text>
        )}
      </Card>

      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>{t('reports.spendingTrend')}</Text>
        </View>
        {trendSeries.length > 0 ? (
          <VictoryChart theme={VictoryTheme.material} domainPadding={{x: 25, y: 20}}>
            <VictoryAxis style={axisStyles} tickFormat={tick => `${tick}`} />
            <VictoryAxis dependentAxis style={axisStyles} tickFormat={tick => formatNumber(tick)} />
            <VictoryLine data={trendSeries} style={{data: {stroke: '#5856D6', strokeWidth: 2}}} />
            <VictoryScatter
              data={trendSeries}
              size={5}
              style={{data: {fill: '#5856D6'}}}
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onPressIn: (_evt, props) => {
                      handlePeriodSelect(props.datum.periodKey, 'trend');
                      return [];
                    },
                  },
                },
              ]}
            />
          </VictoryChart>
        ) : (
          <Text style={styles.emptyText}>{t('reports.empty')}</Text>
        )}
      </Card>

      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>{t('reports.categoryDistribution')}</Text>
        </View>
        {categorySeries.length > 0 ? (
          <VictoryPie
            data={categorySeries}
            innerRadius={60}
            padAngle={2}
            labels={({datum}) => datum.label}
            labelRadius={({radius}) => radius - 30}
            colorScale={['#007AFF', '#FF9500', '#34C759', '#FF3B30', '#5856D6', '#5AC8FA']}
            style={{
              labels: {
                fill: '#1C1C1E',
                fontSize: 12,
                lineHeight: 16,
              },
            }}
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onPressIn: (_evt, props) => {
                    const match = categoryDistribution[props.index];
                    if (match) {
                      handleCategorySelect(match);
                    }
                    return [];
                  },
                },
              },
            ]}
          />
        ) : (
          <Text style={styles.emptyText}>{t('reports.empty')}</Text>
        )}
      </Card>

      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>{t('reports.accountOverview')}</Text>
        </View>
        {accountSeries.length > 0 ? (
          <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={{x: 25, y: 20}}
            categories={{x: accountSeries.map(item => item.x)}}>
            <VictoryAxis style={accountAxisStyle} />
            <VictoryAxis dependentAxis style={axisStyles} tickFormat={tick => formatNumber(tick)} />
            <VictoryGroup>
              <VictoryArea
                data={accountSeries}
                style={{data: {fill: 'rgba(52, 199, 89, 0.2)', stroke: '#34C759'}}}
              />
              <VictoryBar
                data={accountSeries}
                barWidth={18}
                style={{data: {fill: '#34C759'}}}
                events={[
                  {
                    target: 'data',
                    eventHandlers: {
                      onPressIn: (_evt, props) => {
                        const match = accountReports[props.index];
                        if (match) {
                          handleAccountSelect(match);
                        }
                        return [];
                      },
                    },
                  },
                ]}
              />
            </VictoryGroup>
          </VictoryChart>
        ) : (
          <Text style={styles.emptyText}>{t('reports.empty')}</Text>
        )}
      </Card>

      {drilldown && (
        <Card style={styles.lastCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>
              {t('reports.drilldownTitle', {label: drilldown.label})}
            </Text>
            <TouchableOpacity onPress={() => setDrilldown(null)}>
              <Text style={styles.clearText}>{t('reports.clearDrilldown')}</Text>
            </TouchableOpacity>
          </View>
          {drilldown.transactions.length > 0 ? (
            <FlatList
              data={drilldown.transactions}
              renderItem={renderTransaction}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyText}>{t('reports.empty')}</Text>
          )}
        </Card>
      )}

      {!hasChartData && <Text style={styles.emptyTextCentered}>{t('reports.empty')}</Text>}
    </ScrollView>
  );
};

const axisStyles = {
  axis: {stroke: '#E5E5EA'},
  tickLabels: {
    fill: '#3A3A3C',
    fontSize: 12,
    padding: 6,
  },
  grid: {stroke: '#E5E5EA', strokeDasharray: '4,4'},
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  contentContainer: {
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  rangeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  rangeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeRangeButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  rangeButtonText: {
    color: '#1C1C1E',
    fontWeight: '500',
  },
  activeRangeButtonText: {
    color: '#FFF',
  },
  datePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  filterLabel: {
    fontSize: 14,
    color: '#636366',
    marginBottom: 8,
  },
  dateButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#636366',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  incomeText: {
    color: '#34C759',
  },
  expenseText: {
    color: '#FF3B30',
  },
  topCategories: {
    marginTop: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  categoryName: {
    fontSize: 14,
    color: '#1C1C1E',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#636366',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyTextCentered: {
    fontSize: 16,
    color: '#636366',
    textAlign: 'center',
    marginTop: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  transactionInfo: {
    flex: 1,
    marginRight: 12,
  },
  transactionDescription: {
    fontSize: 16,
    color: '#1C1C1E',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#636366',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  clearText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  lastCard: {
    marginBottom: 24,
  },
});

export default ReportsScreen;
