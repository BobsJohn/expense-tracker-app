/**
 * 空状态组件
 * 用于显示无数据、无结果等空状态
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  AccessibilityProps,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '@/theme';
import PrimaryButton from './PrimaryButton';

export interface EmptyStateProps extends AccessibilityProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
  iconColor?: string;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  testID?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  actionLabel,
  onAction,
  style,
  iconColor,
  titleStyle,
  descriptionStyle,
  testID,
  accessibilityLabel,
  ...accessibilityProps
}) => {
  const {theme} = useTheme();

  const emptyIconColor = iconColor || theme.colors.textTertiary;

  return (
    <View
      style={[styles.container, style]}
      testID={testID}
      accessible={true}
      accessibilityLabel={accessibilityLabel || `${title}${description ? `, ${description}` : ''}`}
      {...accessibilityProps}>
      <Icon
        name={icon}
        size={64}
        color={emptyIconColor}
        style={styles.icon}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.textPrimary,
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semiBold,
          },
          titleStyle,
        ]}>
        {title}
      </Text>

      {description && (
        <Text
          style={[
            styles.description,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.md,
            },
            descriptionStyle,
          ]}>
          {description}
        </Text>
      )}

      {actionLabel && onAction && (
        <PrimaryButton
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          size="medium"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    minWidth: 150,
  },
});

export default EmptyState;
