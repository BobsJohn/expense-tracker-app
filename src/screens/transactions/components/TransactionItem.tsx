import React, {useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Animated, Alert} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';

import {Transaction} from '@/types';
import {formatCurrency} from '@/utils/currency';
import {deleteTransactionThunk} from '@/store/thunks/transactionThunks';
import {useAppSelector} from '@/hooks/useAppSelector';
import {selectAccountById} from '@/store/selectors';
import {AppDispatch} from '@/store';
import {triggerHapticFeedback} from '@/utils/haptics';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({transaction, onEdit}) => {
  const dispatch = useDispatch<AppDispatch>();
  const swipeableRef = useRef<Swipeable>(null);

  const account = useAppSelector(state => selectAccountById(state, transaction.accountId));

  const handleDelete = () => {
    Alert.alert('删除交易', '确定要删除此交易吗？此操作无法撤销。', [
      {
        text: '取消',
        style: 'cancel',
      },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          triggerHapticFeedback.light();
          await dispatch(deleteTransactionThunk(transaction.id));
          swipeableRef.current?.close();
        },
      },
    ]);
  };

  const handleEdit = () => {
    triggerHapticFeedback.light();
    swipeableRef.current?.close();
    onEdit(transaction);
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const editTranslate = dragX.interpolate({
      inputRange: [-128, 0],
      outputRange: [0, 128],
      extrapolate: 'clamp',
    });

    const deleteTranslate = dragX.interpolate({
      inputRange: [-128, 0],
      outputRange: [0, 64],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.actionsContainer}>
        <Animated.View style={[styles.actionButton, {transform: [{translateX: editTranslate}]}]}>
          <TouchableOpacity
            style={[styles.actionTouchable, styles.editAction]}
            onPress={handleEdit}>
            <Text style={styles.actionText}>编辑</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.actionButton, {transform: [{translateX: deleteTranslate}]}]}>
          <TouchableOpacity
            style={[styles.actionTouchable, styles.deleteAction]}
            onPress={handleDelete}>
            <Text style={styles.actionText}>删除</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const transactionDate = new Date(transaction.date);
  const isIncome = transaction.type === 'income';

  return (
    <Swipeable ref={swipeableRef} renderRightActions={renderRightActions} overshootRight={false}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <View
            style={[
              styles.categoryIndicator,
              isIncome ? styles.categoryIndicatorIncome : styles.categoryIndicatorExpense,
            ]}
          />
          <View style={styles.info}>
            <Text style={styles.description} numberOfLines={1}>
              {transaction.description}
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.category}>{transaction.category}</Text>
              {account && (
                <>
                  <Text style={styles.metaSeparator}>·</Text>
                  <Text style={styles.account}>{account.name}</Text>
                </>
              )}
            </View>
            <Text style={styles.date}>{transactionDate.toLocaleDateString()}</Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <Text style={[styles.amount, isIncome ? styles.incomeAmount : styles.expenseAmount]}>
            {isIncome ? '+' : ''}
            {formatCurrency(transaction.amount, account?.currency || 'USD')}
          </Text>
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  categoryIndicatorIncome: {
    backgroundColor: '#34C759',
  },
  categoryIndicatorExpense: {
    backgroundColor: '#FF3B30',
  },
  info: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  category: {
    fontSize: 13,
    color: '#666',
  },
  metaSeparator: {
    fontSize: 13,
    color: '#999',
    marginHorizontal: 6,
  },
  account: {
    fontSize: 13,
    color: '#666',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  incomeAmount: {
    color: '#34C759',
  },
  expenseAmount: {
    color: '#FF3B30',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    justifyContent: 'center',
  },
  actionTouchable: {
    width: 64,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAction: {
    backgroundColor: '#007AFF',
  },
  deleteAction: {
    backgroundColor: '#FF3B30',
  },
  actionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TransactionItem;
