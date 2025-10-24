import React, {useEffect, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

import Button from '@/components/ui/Button';
import {Transaction} from '@/types';
import {useAppSelector} from '@/hooks/useAppSelector';
import {selectAccounts, selectCategories} from '@/store/selectors';
import {addTransactionThunk, updateTransactionThunk} from '@/store/thunks/transactionThunks';
import {parseCurrencyInput} from '@/utils/currency';
import {triggerHapticFeedback} from '@/utils/haptics';
import {AppDispatch} from '@/store';

interface TransactionFormModalProps {
  visible: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
  accountId?: string;
}

const AMOUNT_REGEX = /^-?\d+(?:[.,]\d{0,2})?$/;

const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  visible,
  onClose,
  transaction,
  accountId,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const accounts = useAppSelector(selectAccounts);
  const categories = useAppSelector(selectCategories);
  const isEditing = Boolean(transaction);

  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [memo, setMemo] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredCategories = categories.filter(cat => cat.type === type);

  useEffect(() => {
    if (visible) {
      if (transaction) {
        setAmount(Math.abs(transaction.amount).toString());
        setType(transaction.type);
        setCategory(transaction.category);
        setSelectedAccountId(transaction.accountId);
        setDescription(transaction.description);
        setDate(new Date(transaction.date));
        setMemo(transaction.memo || '');
      } else {
        resetForm();
        if (accountId) {
          setSelectedAccountId(accountId);
        } else if (accounts.length > 0) {
          setSelectedAccountId(accounts[0].id);
        }
        if (filteredCategories.length > 0) {
          setCategory(filteredCategories[0].name);
        }
      }
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, transaction, accountId]);

  useEffect(() => {
    if (filteredCategories.length > 0 && !category) {
      setCategory(filteredCategories[0].name);
    } else if (
      filteredCategories.length > 0 &&
      !filteredCategories.find(c => c.name === category)
    ) {
      setCategory(filteredCategories[0].name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const resetForm = () => {
    setAmount('');
    setType('expense');
    setCategory('');
    setSelectedAccountId('');
    setDescription('');
    setDate(new Date());
    setMemo('');
    setLoading(false);
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  const validateAmountInput = (value: string): boolean => {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return false;
    }
    return AMOUNT_REGEX.test(trimmed);
  };

  const saveTransaction = async () => {
    if (!validateAmountInput(amount)) {
      Alert.alert('验证错误', '请输入有效的金额');
      return;
    }

    const normalizedAmountInput = amount.trim().replace(/,/g, '.');
    const parsedAmount = parseCurrencyInput(normalizedAmountInput);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('验证错误', '金额必须大于0');
      return;
    }

    if (!category) {
      Alert.alert('验证错误', '请选择分类');
      return;
    }

    if (!selectedAccountId) {
      Alert.alert('验证错误', '请选择账户');
      return;
    }

    if (!description.trim()) {
      Alert.alert('验证错误', '请输入交易描述');
      return;
    }

    try {
      setLoading(true);
      triggerHapticFeedback.light();

      const transactionAmount = type === 'income' ? parsedAmount : -parsedAmount;

      if (isEditing && transaction) {
        const updatedTransaction: Transaction = {
          ...transaction,
          accountId: selectedAccountId,
          amount: transactionAmount,
          category,
          description: description.trim(),
          date: date.toISOString(),
          type,
          memo: memo.trim() || undefined,
        };

        await dispatch(updateTransactionThunk(updatedTransaction)).unwrap();
      } else {
        const newTransaction: Transaction = {
          id: `tx-${Date.now()}`,
          accountId: selectedAccountId,
          amount: transactionAmount,
          category,
          description: description.trim(),
          date: date.toISOString(),
          type,
          memo: memo.trim() || undefined,
        };

        await dispatch(addTransactionThunk(newTransaction)).unwrap();
      }

      handleClose();
    } catch (error) {
      console.error('Failed to save transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>取消</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{isEditing ? '编辑交易' : '添加交易'}</Text>
            <View style={styles.headerButton} />
          </View>

          <ScrollView style={styles.content} bounces={false} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.label}>类型</Text>
              <View style={styles.typeRow}>
                <TouchableOpacity
                  style={[styles.typeButton, type === 'income' && styles.typeButtonIncome]}
                  onPress={() => setType('income')}>
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === 'income' && styles.typeButtonTextIncome,
                    ]}>
                    收入
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeButton, type === 'expense' && styles.typeButtonExpense]}
                  onPress={() => setType('expense')}>
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === 'expense' && styles.typeButtonTextExpense,
                    ]}>
                    支出
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>金额</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                style={styles.input}
                placeholder="0.00"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>分类</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoryRow}>
                  {filteredCategories.map(cat => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryButton,
                        category === cat.name && styles.categoryButtonSelected,
                        {borderColor: cat.color},
                      ]}
                      onPress={() => setCategory(cat.name)}>
                      <Text style={styles.categoryIcon}>{cat.icon}</Text>
                      <Text
                        style={[
                          styles.categoryButtonText,
                          category === cat.name && styles.categoryButtonTextSelected,
                        ]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>账户</Text>
              <View style={styles.pickerContainer}>
                {accounts.map(acc => (
                  <TouchableOpacity
                    key={acc.id}
                    style={[
                      styles.accountButton,
                      selectedAccountId === acc.id && styles.accountButtonSelected,
                    ]}
                    onPress={() => setSelectedAccountId(acc.id)}>
                    <Text
                      style={[
                        styles.accountButtonText,
                        selectedAccountId === acc.id && styles.accountButtonTextSelected,
                      ]}>
                      {acc.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>描述</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="输入交易描述"
                style={styles.input}
                autoCapitalize="sentences"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>日期</Text>
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateButtonText}>{date.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>备注 (可选)</Text>
              <TextInput
                value={memo}
                onChangeText={setMemo}
                placeholder="添加备注"
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>收据附件 (即将推出)</Text>
              <View style={styles.placeholderBox}>
                <Text style={styles.placeholderText}>📎 附件功能即将推出</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title={isEditing ? '保存' : '添加交易'}
              onPress={saveTransaction}
              loading={loading}
              disabled={loading}
              style={styles.saveButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
  textArea: {
    minHeight: 80,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
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
  typeButtonIncome: {
    borderColor: '#34C759',
    backgroundColor: '#E8F8EC',
  },
  typeButtonExpense: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFE8E8',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  typeButtonTextIncome: {
    color: '#34C759',
  },
  typeButtonTextExpense: {
    color: '#FF3B30',
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFF',
    alignItems: 'center',
    minWidth: 80,
  },
  categoryButtonSelected: {
    backgroundColor: '#E6F0FF',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  categoryButtonTextSelected: {
    fontWeight: '600',
  },
  pickerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
  },
  accountButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  accountButtonSelected: {
    backgroundColor: '#E6F0FF',
  },
  accountButtonText: {
    fontSize: 16,
    color: '#333',
  },
  accountButtonTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  dateButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderBox: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderStyle: 'dashed',
    paddingVertical: 32,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#8E8E93',
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

export default TransactionFormModal;
