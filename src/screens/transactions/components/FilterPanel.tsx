import React, {useState} from 'react';
import {Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Platform} from 'react-native';

import Button from '@/components/ui/Button';
import {useAppSelector} from '@/hooks/useAppSelector';
import {selectAccounts, selectCategories} from '@/store/selectors';
import {TransactionFilters} from '@/store/selectors';

interface FilterPanelProps {
  visible: boolean;
  onClose: () => void;
  filters: TransactionFilters;
  onApplyFilters: (filters: TransactionFilters) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({visible, onClose, filters, onApplyFilters}) => {
  const accounts = useAppSelector(selectAccounts);
  const categories = useAppSelector(selectCategories);

  const [keyword, setKeyword] = useState(filters.keyword || '');
  const [category, setCategory] = useState(filters.category || '');
  const [accountId, setAccountId] = useState(filters.accountId || '');
  const [type, setType] = useState<'income' | 'expense' | undefined>(filters.type);
  const [startDate, setStartDate] = useState<Date | undefined>(
    filters.startDate ? new Date(filters.startDate) : undefined,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    filters.endDate ? new Date(filters.endDate) : undefined,
  );
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleApply = () => {
    const newFilters: TransactionFilters = {
      keyword: keyword.trim() || undefined,
      category: category || undefined,
      accountId: accountId || undefined,
      type: type || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };
    onApplyFilters(newFilters);
    onClose();
  };

  const handleClear = () => {
    setKeyword('');
    setCategory('');
    setAccountId('');
    setType(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
    onApplyFilters({});
    onClose();
  };

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>取消</Text>
          </TouchableOpacity>
          <Text style={styles.title}>筛选交易</Text>
          <TouchableOpacity onPress={handleClear} style={styles.headerButton}>
            <Text style={styles.clearButtonText}>清除</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.label}>关键词搜索</Text>
            <TextInput
              value={keyword}
              onChangeText={setKeyword}
              placeholder="搜索描述、分类或备注"
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>交易类型</Text>
            <View style={styles.typeRow}>
              <TouchableOpacity
                style={[styles.typeButton, type === undefined && styles.typeButtonSelected]}
                onPress={() => setType(undefined)}>
                <Text
                  style={[
                    styles.typeButtonText,
                    type === undefined && styles.typeButtonTextSelected,
                  ]}>
                  全部
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, type === 'income' && styles.typeButtonSelected]}
                onPress={() => setType('income')}>
                <Text
                  style={[
                    styles.typeButtonText,
                    type === 'income' && styles.typeButtonTextSelected,
                  ]}>
                  收入
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, type === 'expense' && styles.typeButtonSelected]}
                onPress={() => setType('expense')}>
                <Text
                  style={[
                    styles.typeButtonText,
                    type === 'expense' && styles.typeButtonTextSelected,
                  ]}>
                  支出
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>分类</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={[styles.pickerItem, !category && styles.pickerItemSelected]}
                onPress={() => setCategory('')}>
                <Text style={[styles.pickerItemText, !category && styles.pickerItemTextSelected]}>
                  全部分类
                </Text>
              </TouchableOpacity>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.pickerItem, category === cat.name && styles.pickerItemSelected]}
                  onPress={() => setCategory(cat.name)}>
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.pickerItemText,
                      category === cat.name && styles.pickerItemTextSelected,
                    ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>账户</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={[styles.pickerItem, !accountId && styles.pickerItemSelected]}
                onPress={() => setAccountId('')}>
                <Text style={[styles.pickerItemText, !accountId && styles.pickerItemTextSelected]}>
                  全部账户
                </Text>
              </TouchableOpacity>
              {accounts.map(acc => (
                <TouchableOpacity
                  key={acc.id}
                  style={[styles.pickerItem, accountId === acc.id && styles.pickerItemSelected]}
                  onPress={() => setAccountId(acc.id)}>
                  <Text
                    style={[
                      styles.pickerItemText,
                      accountId === acc.id && styles.pickerItemTextSelected,
                    ]}>
                    {acc.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>日期范围</Text>
            <View style={styles.dateRow}>
              <View style={styles.dateColumn}>
                <Text style={styles.dateLabel}>开始日期</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowStartDatePicker(true)}>
                  <Text style={styles.dateButtonText}>
                    {startDate ? startDate.toLocaleDateString() : '选择日期'}
                  </Text>
                </TouchableOpacity>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={startDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onStartDateChange}
                    maximumDate={endDate || new Date()}
                  />
                )}
              </View>
              <View style={styles.dateColumn}>
                <Text style={styles.dateLabel}>结束日期</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowEndDatePicker(true)}>
                  <Text style={styles.dateButtonText}>
                    {endDate ? endDate.toLocaleDateString() : '选择日期'}
                  </Text>
                </TouchableOpacity>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={endDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onEndDateChange}
                    minimumDate={startDate}
                    maximumDate={new Date()}
                  />
                )}
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button title="应用筛选" onPress={handleApply} style={styles.applyButton} />
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
  headerButton: {
    width: 72,
  },
  headerButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  clearButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  typeButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E6F0FF',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  typeButtonTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  pickerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  pickerItemSelected: {
    backgroundColor: '#E6F0FF',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#333',
  },
  pickerItemTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateColumn: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  dateButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#000',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  applyButton: {
    width: '100%',
  },
});

export default FilterPanel;
