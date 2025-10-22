import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {RootState} from '@/store';
import exportService, {ExportOptions} from '@/services/exportService';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const ExportScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  const {accounts, transactions, budgets} = useSelector((state: RootState) => ({
    accounts: state.accounts.accounts,
    transactions: state.transactions.transactions,
    budgets: state.budgets.budgets,
  }));

  // State for export options
  const [format, setFormat] = useState<'csv' | 'xlsx'>('csv');
  const [includeTransactions, setIncludeTransactions] = useState(true);
  const [includeBudgets, setIncludeBudgets] = useState(true);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  // Get unique categories from transactions and budgets
  const availableCategories = useMemo(() => {
    const transactionCategories = transactions.map(t => t.category);
    const budgetCategories = budgets.map(b => b.category);
    return Array.from(new Set([...transactionCategories, ...budgetCategories])).sort();
  }, [transactions, budgets]);

  const handleAccountToggle = (accountId: string) => {
    setSelectedAccountIds(prev =>
      prev.includes(accountId) ? prev.filter(id => id !== accountId) : [...prev, accountId],
    );
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category],
    );
  };

  const handleSelectAllAccounts = () => {
    if (selectedAccountIds.length === accounts.length) {
      setSelectedAccountIds([]);
    } else {
      setSelectedAccountIds(accounts.map(a => a.id));
    }
  };

  const handleSelectAllCategories = () => {
    if (selectedCategories.length === availableCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(availableCategories);
    }
  };

  const handleExport = async () => {
    if (!includeTransactions && !includeBudgets) {
      Alert.alert(t('export.error'), t('export.selectDataTypeError'));
      return;
    }

    setIsExporting(true);

    try {
      const options: ExportOptions = {
        format,
        dateRange: {startDate, endDate},
        includeTransactions,
        includeBudgets,
        selectedAccountIds: selectedAccountIds.length > 0 ? selectedAccountIds : undefined,
        selectedCategories: selectedCategories.length > 0 ? selectedCategories : undefined,
      };

      const result = await exportService.exportData(transactions, budgets, accounts, options);

      if (result.success && result.filePath) {
        // Show success message and ask if user wants to share
        Alert.alert(t('export.success'), t('export.exportSuccessMessage'), [
          {
            text: t('common.cancel'),
            style: 'cancel',
          },
          {
            text: t('export.share'),
            onPress: async () => {
              const shareResult = await exportService.shareFile(
                result.filePath!,
                t('export.shareTitle'),
              );
              if (!shareResult.success && shareResult.error) {
                Alert.alert(t('export.error'), shareResult.error);
              }
            },
          },
        ]);

        // Cleanup old files
        await exportService.cleanupTempFiles();
      } else {
        Alert.alert(t('export.error'), result.error || t('export.unknownError'));
      }
    } catch (error) {
      Alert.alert(t('export.error'), t('export.exportFailedMessage'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>{t('export.format')}</Text>
        <View style={styles.formatContainer}>
          <TouchableOpacity
            style={[styles.formatButton, format === 'csv' && styles.formatButtonActive]}
            onPress={() => setFormat('csv')}>
            <Text
              style={[styles.formatButtonText, format === 'csv' && styles.formatButtonTextActive]}>
              CSV
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.formatButton, format === 'xlsx' && styles.formatButtonActive]}
            onPress={() => setFormat('xlsx')}>
            <Text
              style={[styles.formatButtonText, format === 'xlsx' && styles.formatButtonTextActive]}>
              Excel (XLSX)
            </Text>
          </TouchableOpacity>
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>{t('export.dataTypes')}</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{t('export.includeTransactions')}</Text>
          <Switch
            value={includeTransactions}
            onValueChange={setIncludeTransactions}
            trackColor={{false: '#E5E5EA', true: '#34C759'}}
            thumbColor="#FFF"
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{t('export.includeBudgets')}</Text>
          <Switch
            value={includeBudgets}
            onValueChange={setIncludeBudgets}
            trackColor={{false: '#E5E5EA', true: '#34C759'}}
            thumbColor="#FFF"
          />
        </View>
      </Card>

      {includeTransactions && (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>{t('export.dateRange')}</Text>
          <View style={styles.dateRow}>
            <View style={styles.dateInput}>
              <Text style={styles.dateLabel}>{t('export.startDate')}</Text>
              <TextInput
                style={styles.dateInputField}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="YYYY-MM-DD"
                keyboardType="default"
              />
            </View>
            <View style={styles.dateInput}>
              <Text style={styles.dateLabel}>{t('export.endDate')}</Text>
              <TextInput
                style={styles.dateInputField}
                value={endDate}
                onChangeText={setEndDate}
                placeholder="YYYY-MM-DD"
                keyboardType="default"
              />
            </View>
          </View>
        </Card>
      )}

      {accounts.length > 0 && (
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('export.accounts')}</Text>
            <TouchableOpacity onPress={handleSelectAllAccounts}>
              <Text style={styles.selectAllText}>
                {selectedAccountIds.length === accounts.length
                  ? t('export.deselectAll')
                  : t('export.selectAll')}
              </Text>
            </TouchableOpacity>
          </View>
          {accounts.map(account => (
            <TouchableOpacity
              key={account.id}
              style={styles.checkboxRow}
              onPress={() => handleAccountToggle(account.id)}>
              <View
                style={[
                  styles.checkbox,
                  selectedAccountIds.includes(account.id) && styles.checkboxChecked,
                ]}>
                {selectedAccountIds.includes(account.id) && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>{account.name}</Text>
            </TouchableOpacity>
          ))}
        </Card>
      )}

      {availableCategories.length > 0 && (
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('export.categories')}</Text>
            <TouchableOpacity onPress={handleSelectAllCategories}>
              <Text style={styles.selectAllText}>
                {selectedCategories.length === availableCategories.length
                  ? t('export.deselectAll')
                  : t('export.selectAll')}
              </Text>
            </TouchableOpacity>
          </View>
          {availableCategories.map(category => (
            <TouchableOpacity
              key={category}
              style={styles.checkboxRow}
              onPress={() => handleCategoryToggle(category)}>
              <View
                style={[
                  styles.checkbox,
                  selectedCategories.includes(category) && styles.checkboxChecked,
                ]}>
                {selectedCategories.includes(category) && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>{category}</Text>
            </TouchableOpacity>
          ))}
        </Card>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title={isExporting ? t('export.exporting') : t('export.exportData')}
          onPress={handleExport}
          disabled={isExporting}
          style={styles.exportButton}
        />
        {isExporting && (
          <ActivityIndicator size="small" color="#007AFF" style={styles.loadingIndicator} />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1C1C1E',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  formatContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  formatButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    alignItems: 'center',
  },
  formatButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  formatButtonText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  formatButtonTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  dateInputField: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFF',
    fontSize: 16,
    color: '#1C1C1E',
  },
  selectAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#1C1C1E',
    flex: 1,
  },
  buttonContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  exportButton: {
    width: '100%',
  },
  loadingIndicator: {
    marginTop: 12,
  },
});

export default ExportScreen;
