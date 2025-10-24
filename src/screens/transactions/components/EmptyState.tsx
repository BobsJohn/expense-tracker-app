import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Button from '@/components/ui/Button';

interface EmptyStateProps {
  hasActiveFilters: boolean;
  onAddTransaction: () => void;
  onClearFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  hasActiveFilters,
  onAddTransaction,
  onClearFilters,
}) => {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>💸</Text>
      <Text style={styles.emptyTitle}>{hasActiveFilters ? '未找到交易' : '还没有交易'}</Text>
      <Text style={styles.emptySubtitle}>
        {hasActiveFilters ? '尝试调整筛选条件' : '添加您的第一笔交易开始记账'}
      </Text>
      {!hasActiveFilters && (
        <Button
          title="添加交易"
          onPress={onAddTransaction}
          size="small"
          style={styles.emptyButton}
        />
      )}
      {hasActiveFilters && (
        <Button
          title="清除筛选"
          onPress={onClearFilters}
          variant="secondary"
          size="small"
          style={styles.emptyButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 160,
  },
});

export default EmptyState;
