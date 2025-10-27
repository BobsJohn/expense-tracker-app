import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

import {RootState} from '@/store';
import {selectBudgetProgress, selectBudgetSummary, selectOverspentBudgets} from '@/store/selectors';
import {setLoading} from '@/store/slices/budgetsSlice';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import BudgetItem from './components/BudgetItem';
import BudgetSummary from './components/BudgetSummary';
import BudgetModal from './components/BudgetModal';
import OverspentAlert from './components/OverspentAlert';
import {Budget} from '@/types';
import {useTheme} from '@/theme';

const BudgetsScreen: React.FC = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {theme} = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const budgets = useSelector(selectBudgetProgress);
  const budgetSummary = useSelector(selectBudgetSummary);
  const overspentBudgets = useSelector(selectOverspentBudgets);
  const loading = useSelector((state: RootState) => state.budgets.loading);

  const handleAddBudget = () => {
    setEditingBudget(null);
    setModalVisible(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setModalVisible(true);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    dispatch(setLoading(true));

    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
      dispatch(setLoading(false));
    }, 1000);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingBudget(null);
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.backgroundSecondary}]}>
      <View
        style={[
          styles.header,
          {backgroundColor: theme.colors.background, borderBottomColor: theme.colors.borderLight},
        ]}>
        <Text style={[styles.title, {color: theme.colors.textPrimary}]}>{t('budgets.title')}</Text>
        <Button
          title={t('budgets.addBudget')}
          onPress={handleAddBudget}
          size="small"
          style={styles.addButton}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}>
        {/* Overspent Alerts */}
        {overspentBudgets.length > 0 && <OverspentAlert budgets={overspentBudgets} />}

        {/* Budget Summary */}
        <BudgetSummary summary={budgetSummary} />

        {/* Budget List */}
        <View style={styles.budgetList}>
          <Text style={[styles.sectionTitle, {color: theme.colors.textPrimary}]}>
            {t('budgets.title')}
          </Text>
          {budgets.length > 0 ? (
            budgets.map(budget => (
              <BudgetItem key={budget.id} budget={budget} onEdit={() => handleEditBudget(budget)} />
            ))
          ) : (
            <Card>
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, {color: theme.colors.textSecondary}]}>
                  {t('budgets.noBudgets', 'No budgets created yet')}
                </Text>
                <Text style={[styles.emptySubtext, {color: theme.colors.textSecondary}]}>
                  {t(
                    'budgets.createFirst',
                    'Create your first budget to start tracking your spending',
                  )}
                </Text>
                <Button
                  title={t('budgets.addBudget')}
                  onPress={handleAddBudget}
                  style={styles.emptyButton}
                />
              </View>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Budget Modal */}
      <BudgetModal visible={modalVisible} budget={editingBudget} onClose={handleModalClose} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  budgetList: {
    paddingBottom: 32,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  emptyButton: {
    marginTop: 8,
  },
});

export default BudgetsScreen;
