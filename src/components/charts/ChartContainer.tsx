/**
 * 图表容器组件
 * 提供统一的加载和错误状态处理
 */

import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  AccessibilityProps,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '@/theme';
import PrimaryButton from '../shared/PrimaryButton';

export interface ChartContainerProps extends AccessibilityProps {
  children: React.ReactNode;
  title?: string;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  height?: number;
  style?: ViewStyle;
  testID?: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  title,
  loading = false,
  error,
  onRetry,
  height = 300,
  style,
  testID,
  accessibilityLabel,
  ...accessibilityProps
}) => {
  const {theme} = useTheme();

  const containerStyle: ViewStyle = {
    height,
    ...style,
  };

  if (loading) {
    return (
      <View
        style={[styles.container, containerStyle, styles.centerContent]}
        testID={`${testID}-loading`}
        accessible={true}
        accessibilityLabel={accessibilityLabel || '图表加载中'}
        accessibilityRole="progressbar"
        {...accessibilityProps}>
        {title && (
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.textPrimary,
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.semiBold,
              },
            ]}>
            {title}
          </Text>
        )}
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            accessibilityLabel="加载中"
          />
          <Text
            style={[
              styles.loadingText,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.sm,
              },
            ]}>
            加载图表数据...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[styles.container, containerStyle, styles.centerContent]}
        testID={`${testID}-error`}
        accessible={true}
        accessibilityLabel={accessibilityLabel || `图表加载失败：${error}`}
        {...accessibilityProps}>
        {title && (
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.textPrimary,
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.semiBold,
              },
            ]}>
            {title}
          </Text>
        )}
        <View style={styles.errorContainer}>
          <Icon
            name="error-outline"
            size={48}
            color={theme.colors.error}
            style={styles.errorIcon}
          />
          <Text
            style={[
              styles.errorText,
              {
                color: theme.colors.textPrimary,
                fontSize: theme.typography.fontSize.md,
              },
            ]}>
            图表加载失败
          </Text>
          <Text
            style={[
              styles.errorMessage,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.sm,
              },
            ]}>
            {error}
          </Text>
          {onRetry && (
            <PrimaryButton
              title="重试"
              onPress={onRetry}
              variant="primary"
              size="small"
              style={styles.retryButton}
            />
          )}
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, containerStyle]}
      testID={testID}
      accessible={true}
      accessibilityLabel={accessibilityLabel || title || '图表'}
      {...accessibilityProps}>
      {title && (
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.textPrimary,
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semiBold,
            },
          ]}>
          {title}
        </Text>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorIcon: {
    marginBottom: 12,
  },
  errorText: {
    marginBottom: 8,
  },
  errorMessage: {
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    minWidth: 120,
  },
});

export default ChartContainer;
