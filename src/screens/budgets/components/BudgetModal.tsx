import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import Toast from 'react-native-toast-message';

import {addBudget, updateBudget} from '@/store/slices/budgetsSlice';
import Button from '@/components/ui/Button';
import {Budget} from '@/types';
import {triggerHapticFeedback} from '@/utils/haptics';

interface BudgetModalProps {
  visible: boolean;
  budget: Budget | null;
  onClose: () => void;
}

const categories = [
  'Food',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Shopping',
  'Other',
];

const periods = [
  {key: 'monthly', label: 'Monthly'},
  {key: 'yearly', label: 'Yearly'},
] as const;

const BudgetModal: React.FC<BudgetModalProps> = ({visible, budget, onClose}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const [category, setCategory] = useState('');
  const [budgetedAmount, setBudgetedAmount] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [alertThreshold, setAlertThreshold] = useState('80');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (budget) {
      setCategory(budget.category);
      setBudgetedAmount(budget.budgetedAmount.toString());
      setPeriod(budget.period);
      setAlertThreshold((budget.alertThreshold || 80).toString());
    } else {
      resetForm();
    }
  }, [budget, visible]);

  const resetForm = () => {
    setCategory('');
    setBudgetedAmount('');
    setPeriod('monthly');
    setAlertThreshold('80');
  };

  const validateForm = () => {
    if (!category) {
      Alert.alert(t('errors.validation'), t('budgets.selectCategory', 'Please select a category'));
      return false;
    }

    const amount = parseFloat(budgetedAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert(t('errors.validation'), t('errors.invalidAmount'));
      return false;
    }

    const threshold = parseFloat(alertThreshold);
    if (isNaN(threshold) || threshold < 1 || threshold > 100) {
      Alert.alert(
        t('errors.validation'),
        t('budgets.invalidThreshold', 'Alert threshold must be between 1-100%'),
      );
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    triggerHapticFeedback.light();

    try {
      const budgetData = {
        category,
        budgetedAmount: parseFloat(budgetedAmount),
        period,
        currency: 'USD', // TODO: Get from app settings
        alertThreshold: parseFloat(alertThreshold),
      };

      if (budget) {
        // Update existing budget
        dispatch(
          updateBudget({
            ...budget,
            ...budgetData,
          }),
        );
        Toast.show({
          type: 'success',
          text1: t('success.budgetUpdated'),
        });
      } else {
        // Add new budget
        dispatch(addBudget(budgetData));
        Toast.show({
          type: 'success',
          text1: t('success.budgetCreated'),
        });
      }

      onClose();
      resetForm();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('errors.budgetFailed', 'Failed to save budget'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeText}>{t('common.cancel')}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {budget ? t('budgets.editBudget') : t('budgets.addBudget')}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('budgets.category')}</Text>
            <View style={styles.categoryGrid}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryButton, category === cat && styles.selectedCategory]}
                  onPress={() => setCategory(cat)}>
                  <Text
                    style={[styles.categoryText, category === cat && styles.selectedCategoryText]}>
                    {t(`budgets.categories.${cat.toLowerCase()}`, cat)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Budget Amount */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('budgets.budgetAmount')}</Text>
            <TextInput
              style={styles.amountInput}
              value={budgetedAmount}
              onChangeText={setBudgetedAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
          </View>

          {/* Period Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('budgets.period')}</Text>
            <View style={styles.periodRow}>
              {periods.map(p => (
                <TouchableOpacity
                  key={p.key}
                  style={[styles.periodButton, period === p.key && styles.selectedPeriod]}
                  onPress={() => setPeriod(p.key)}>
                  <Text style={[styles.periodText, period === p.key && styles.selectedPeriodText]}>
                    {t(`budgets.periods.${p.key}`, p.label)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Alert Threshold */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('budgets.alertThreshold', 'Alert Threshold')}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {t(
                'budgets.alertThresholdDesc',
                'Get notified when spending reaches this percentage',
              )}
            </Text>
            <View style={styles.thresholdContainer}>
              <TextInput
                style={styles.thresholdInput}
                value={alertThreshold}
                onChangeText={setAlertThreshold}
                keyboardType="number-pad"
                returnKeyType="done"
                maxLength={3}
              />
              <Text style={styles.thresholdUnit}>%</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={budget ? t('common.save') : t('budgets.createBudget')}
            onPress={handleSave}
            loading={loading}
            disabled={!category || !budgetedAmount}
            style={styles.saveButton}
          />
        </View>
      </View>
    </Modal>
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
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    minWidth: 100,
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  selectedCategoryText: {
    color: '#FFF',
  },
  amountInput: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  periodRow: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    alignItems: 'center',
  },
  selectedPeriod: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  periodText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  selectedPeriodText: {
    color: '#FFF',
  },
  thresholdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thresholdInput: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    width: 80,
  },
  thresholdUnit: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  saveButton: {
    width: '100%',
  },
});

export default BudgetModal;
