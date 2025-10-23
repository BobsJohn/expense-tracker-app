import React, {useEffect, useMemo, useState} from 'react';
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
import Toast from 'react-native-toast-message';

import Button from '@/components/ui/Button';
import {useAppSelector} from '@/hooks/useAppSelector';
import {selectAccounts} from '@/store/selectors';
import {executeTransfer} from '@/store/actions/transfers';
import {Account} from '@/types';
import {parseCurrencyInput, formatCurrency} from '@/utils/currency';
import {triggerHapticFeedback} from '@/utils/haptics';
import {AppDispatch} from '@/store';

interface TransferModalProps {
  visible: boolean;
  onClose: () => void;
  sourceAccountId?: string;
}

const AMOUNT_REGEX = /^\d+(?:[.,]\d{0,2})?$/;

const TransferModal: React.FC<TransferModalProps> = ({visible, onClose, sourceAccountId}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const accounts = useAppSelector(selectAccounts);

  const [sourceId, setSourceId] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      const defaultSource = sourceAccountId || accounts[0]?.id || '';
      setSourceId(defaultSource);

      const firstDestination = accounts.find(acc => acc.id !== defaultSource)?.id || '';
      setDestinationId(firstDestination);
      setAmount('');
      setMemo('');
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, sourceAccountId, accounts.length]);

  useEffect(() => {
    if (destinationId === sourceId) {
      const alternative = accounts.find(acc => acc.id !== sourceId)?.id || '';
      setDestinationId(alternative);
    }
  }, [sourceId, destinationId, accounts]);

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const sourceAccount = useMemo(
    () => accounts.find(acc => acc.id === sourceId),
    [accounts, sourceId],
  );

  const destinationAccount = useMemo(
    () => accounts.find(acc => acc.id === destinationId),
    [accounts, destinationId],
  );

  const availableDestinationAccounts = useMemo(
    () => accounts.filter(acc => acc.id !== sourceId),
    [accounts, sourceId],
  );

  const hasEnoughAccounts = accounts.length >= 2;

  const validateAmount = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return false;
    }
    return AMOUNT_REGEX.test(trimmed.replace(/,/g, '.'));
  };

  const handleSubmit = async () => {
    if (!hasEnoughAccounts) {
      Alert.alert(t('errors.validation', 'Validation Error'), t('accounts.transferUnavailable'));
      return;
    }

    if (!sourceAccount || !destinationAccount) {
      Alert.alert(t('errors.validation', 'Validation Error'), t('accounts.transferAccountRequired'));
      return;
    }

    if (sourceAccount.id === destinationAccount.id) {
      Alert.alert(t('errors.validation', 'Validation Error'), t('accounts.transferUniqueAccounts'));
      return;
    }

    if (!validateAmount(amount)) {
      Alert.alert(t('errors.validation', 'Validation Error'), t('accounts.invalidTransferAmount'));
      return;
    }

    const normalizedAmountInput = amount.trim().replace(/,/g, '.');
    const parsedAmount = parseCurrencyInput(normalizedAmountInput);

    if (parsedAmount <= 0) {
      Alert.alert(t('errors.validation', 'Validation Error'), t('accounts.invalidTransferAmount'));
      return;
    }

    const decimalsValid = Math.abs(parsedAmount * 100 - Math.round(parsedAmount * 100)) < 1e-6;
    if (!decimalsValid) {
      Alert.alert(t('errors.validation', 'Validation Error'), t('accounts.invalidTransferAmount'));
      return;
    }

    const isSourceCredit = sourceAccount.type === 'credit';
    if (!isSourceCredit && parsedAmount > sourceAccount.balance) {
      Alert.alert(
        t('errors.validation', 'Validation Error'),
        t('accounts.transferInsufficientFunds'),
      );
      return;
    }

    try {
      setLoading(true);
      triggerHapticFeedback.light();

      const transferId = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
      const timestamp = new Date().toISOString();

      dispatch(
        executeTransfer({
          transferId,
          sourceAccountId: sourceAccount.id,
          sourceAccountName: sourceAccount.name,
          destinationAccountId: destinationAccount.id,
          destinationAccountName: destinationAccount.name,
          amount: parsedAmount,
          timestamp,
          memo: memo.trim() ? memo.trim() : undefined,
        }),
      );

      Toast.show({
        type: 'success',
        text1: t('accounts.transferSuccess'),
      });

      handleClose();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('errors.transactionFailed'),
      });
    } finally {
      setLoading(false);
    }
  };

  const renderAccountOption = (
    item: Account,
    selected: boolean,
    onSelect: (accountId: string) => void,
  ) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.accountButton, selected && styles.accountButtonSelected]}
      onPress={() => onSelect(item.id)}>
      <Text style={[styles.accountName, selected && styles.accountNameSelected]}>{item.name}</Text>
      <Text style={[styles.accountBalance, selected && styles.accountBalanceSelected]}>
        {formatCurrency(item.balance, item.currency)}
      </Text>
      <Text style={styles.accountType}>{t(`accounts.accountTypes.${item.type}`)}</Text>
    </TouchableOpacity>
  );

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
              <Text style={styles.headerButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{t('accounts.transferTitle')}</Text>
            <View style={styles.headerButton} />
          </View>

          <ScrollView style={styles.content} bounces={false} showsVerticalScrollIndicator={false}>
            {!hasEnoughAccounts && (
              <View style={styles.alertCard}>
                <Text style={styles.alertText}>{t('accounts.transferUnavailable')}</Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('accounts.transferSource')}</Text>
              <View style={styles.accountGrid}>
                {accounts.map(acc => renderAccountOption(acc, acc.id === sourceId, setSourceId))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('accounts.transferDestination')}</Text>
              <View style={styles.accountGrid}>
                {availableDestinationAccounts.length > 0 ? (
                  availableDestinationAccounts.map(acc =>
                    renderAccountOption(acc, acc.id === destinationId, setDestinationId),
                  )
                ) : (
                  <Text style={styles.helperText}>{t('accounts.transferNoDestination')}</Text>
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('accounts.transferAmount')}</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                style={styles.input}
                placeholder="0.00"
              />
              <Text style={styles.helperText}>
                {sourceAccount
                  ? t('accounts.transferBalanceHelp', {
                      balance: formatCurrency(sourceAccount.balance, sourceAccount.currency),
                    })
                  : t('accounts.balanceHelper')}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('accounts.transferMemo')}</Text>
              <TextInput
                value={memo}
                onChangeText={setMemo}
                style={[styles.input, styles.memoInput]}
                placeholder={t('accounts.transferMemoPlaceholder', 'Optional note')}
                multiline
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title={t('accounts.transferAction')}
              onPress={handleSubmit}
              loading={loading}
              disabled={loading || !hasEnoughAccounts}
              style={styles.submitButton}
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  accountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  accountButton: {
    flexBasis: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  accountButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E6F0FF',
  },
  accountName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  accountNameSelected: {
    color: '#007AFF',
  },
  accountBalance: {
    marginTop: 6,
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  accountBalanceSelected: {
    color: '#007AFF',
  },
  accountType: {
    marginTop: 4,
    fontSize: 12,
    color: '#8E8E93',
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
  memoInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 6,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  submitButton: {
    width: '100%',
  },
  alertCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD1D1',
    padding: 16,
    marginTop: 24,
  },
  alertText: {
    color: '#D0021B',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TransferModal;
