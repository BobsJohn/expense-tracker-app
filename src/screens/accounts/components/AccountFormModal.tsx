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
import {Account, Transaction} from '@/types';
import {useAppSelector} from '@/hooks/useAppSelector';
import {selectAccounts} from '@/store/selectors';
import {addAccount, updateAccount} from '@/store/slices/accountsSlice';
import {addTransaction} from '@/store/slices/transactionsSlice';
import {validateAccountName} from '@/utils/validation';
import {parseCurrencyInput} from '@/utils/currency';
import {triggerHapticFeedback} from '@/utils/haptics';
import {AppDispatch} from '@/store';

interface AccountFormModalProps {
  visible: boolean;
  onClose: () => void;
  account?: Account | null;
}

const ACCOUNT_TYPES: Account['type'][] = ['checking', 'savings', 'credit', 'investment'];
const AMOUNT_REGEX = /^-?\d+(?:[.,]\d{0,2})?$/;

const AccountFormModal: React.FC<AccountFormModalProps> = ({visible, onClose, account}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const accounts = useAppSelector(selectAccounts);
  const isEditing = Boolean(account);

  const defaultCurrency = useMemo(
    () => (t('common.currency', {defaultValue: 'USD'}) as string).toUpperCase(),
    [t],
  );

  const [name, setName] = useState('');
  const [type, setType] = useState<Account['type']>('checking');
  const [currency, setCurrency] = useState(defaultCurrency);
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (account) {
        setName(account.name);
        setType(account.type);
        setCurrency(account.currency.toUpperCase());
        setBalance(account.balance.toString());
      } else {
        resetForm();
      }
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, account]);

  useEffect(() => {
    if (!visible) {
      setCurrency(defaultCurrency);
    }
  }, [visible, defaultCurrency]);

  const resetForm = () => {
    setName('');
    setType('checking');
    setCurrency(defaultCurrency);
    setBalance('0');
    setLoading(false);
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  const validateBalanceInput = (value: string): boolean => {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return true;
    }

    return AMOUNT_REGEX.test(trimmed);
  };

  const saveAccount = async () => {
    const trimmedName = name.trim();
    if (!validateAccountName(trimmedName)) {
      Alert.alert(t('errors.validation', 'Validation Error'), t('errors.requiredField'));
      return;
    }

    const duplicateName = accounts
      .filter(existing => existing.id !== account?.id)
      .some(existing => existing.name.toLowerCase() === trimmedName.toLowerCase());

    if (duplicateName) {
      Alert.alert(t('errors.validation', 'Validation Error'), t('accounts.duplicateName'));
      return;
    }

    if (!validateBalanceInput(balance)) {
      Alert.alert(t('errors.validation', 'Validation Error'), t('accounts.invalidBalance'));
      return;
    }

    const normalizedBalanceInput = balance.trim().replace(/,/g, '.');
    const parsedBalance =
      normalizedBalanceInput.length === 0 ? 0 : parseCurrencyInput(normalizedBalanceInput);

    if (!Number.isFinite(parsedBalance)) {
      Alert.alert(t('errors.validation', 'Validation Error'), t('accounts.invalidBalance'));
      return;
    }

    const decimalsValid = Math.abs(parsedBalance * 100 - Math.round(parsedBalance * 100)) < 1e-6;
    if (!decimalsValid) {
      Alert.alert(t('errors.validation', 'Validation Error'), t('accounts.invalidBalance'));
      return;
    }

    const normalizedCurrency = (currency || defaultCurrency).trim().toUpperCase();
    const now = new Date().toISOString();

    try {
      setLoading(true);
      triggerHapticFeedback.light();

      if (isEditing && account) {
        const balanceDelta = parsedBalance - account.balance;
        const updatedAccount: Account = {
          ...account,
          name: trimmedName,
          type,
          currency: normalizedCurrency,
          balance: parsedBalance,
          updatedAt: now,
        };

        dispatch(updateAccount(updatedAccount));

        if (Math.abs(balanceDelta) > 0.009) {
          const adjustmentTransaction: Transaction = {
            id: `${account.id}-adjustment-${Date.now()}`,
            accountId: account.id,
            amount: balanceDelta,
            category: 'Adjustment',
            description:
              balanceDelta > 0
                ? t('accounts.balanceAdjustmentIncrease', 'Balance adjustment increase')
                : t('accounts.balanceAdjustmentDecrease', 'Balance adjustment decrease'),
            date: now,
            type: balanceDelta >= 0 ? 'income' : 'expense',
            memo: t('accounts.balanceAdjustmentMemo', 'Manual balance adjustment'),
          };

          dispatch(addTransaction(adjustmentTransaction));
        }

        Toast.show({
          type: 'success',
          text1: t('success.accountUpdated'),
        });
      } else {
        const newAccount: Account = {
          id: Date.now().toString(),
          name: trimmedName,
          type,
          balance: parsedBalance,
          currency: normalizedCurrency,
          createdAt: now,
          updatedAt: now,
        };

        dispatch(addAccount(newAccount));

        if (Math.abs(parsedBalance) > 0.009) {
          const initialTransaction: Transaction = {
            id: `${newAccount.id}-initial`,
            accountId: newAccount.id,
            amount: parsedBalance,
            category: 'Initial Balance',
            description: t('accounts.initialBalanceTransaction', 'Initial balance'),
            date: now,
            type: parsedBalance >= 0 ? 'income' : 'expense',
            memo: t('accounts.initialBalanceMemo', 'Opening balance'),
          };

          dispatch(addTransaction(initialTransaction));
        }

        Toast.show({
          type: 'success',
          text1: t('success.accountCreated'),
        });
      }

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
            <Text style={styles.title}>
              {isEditing ? t('accounts.editAccount') : t('accounts.addAccount')}
            </Text>
            <View style={styles.headerButton} />
          </View>

          <ScrollView style={styles.content} bounces={false} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.label}>{t('accounts.accountName')}</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t('accounts.accountNamePlaceholder', 'Checking Account')}
                style={styles.input}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>{t('accounts.accountTypeLabel', 'Account Type')}</Text>
              <View style={styles.typeGrid}>
                {ACCOUNT_TYPES.map(accountType => {
                  const selected = accountType === type;
                  return (
                    <TouchableOpacity
                      key={accountType}
                      style={[styles.typeButton, selected && styles.typeButtonSelected]}
                      onPress={() => setType(accountType)}>
                      <Text
                        style={[styles.typeButtonText, selected && styles.typeButtonTextSelected]}>
                        {t(`accounts.accountTypes.${accountType}`)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>{t('accounts.currency')}</Text>
              <TextInput
                value={currency}
                onChangeText={text => setCurrency(text.toUpperCase().slice(0, 3))}
                placeholder={defaultCurrency}
                style={styles.input}
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={3}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>
                {isEditing ? t('accounts.currentBalance') : t('accounts.initialBalance')}
              </Text>
              <TextInput
                value={balance}
                onChangeText={setBalance}
                keyboardType="decimal-pad"
                style={styles.input}
                placeholder="0.00"
              />
              <Text style={styles.helperText}>
                {t('accounts.balanceHelper', 'Use up to two decimal places (e.g. 1234.56)')}
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title={isEditing ? t('common.save') : t('accounts.createAccount')}
              onPress={saveAccount}
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
  helperText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 6,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFF',
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

export default AccountFormModal;
