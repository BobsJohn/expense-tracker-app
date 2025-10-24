/**
 * 主按钮组件
 * 支持主题、无障碍访问和国际化
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  AccessibilityProps,
} from 'react-native';
import {useTheme} from '@/theme';
import {triggerHapticFeedback} from '@/utils/haptics';

export interface PrimaryButtonProps extends AccessibilityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  testID,
  accessibilityLabel,
  accessibilityHint,
  ...accessibilityProps
}) => {
  const {theme} = useTheme();

  const handlePress = () => {
    if (!disabled && !loading) {
      triggerHapticFeedback.light();
      onPress();
    }
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.backgroundSecondary;
      case 'danger':
        return theme.colors.danger;
      case 'success':
        return theme.colors.success;
      default:
        return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    return variant === 'secondary' 
      ? theme.colors.textPrimary 
      : theme.colors.textOnPrimary;
  };

  const getHeight = () => {
    switch (size) {
      case 'small':
        return theme.sizes.button.height.sm;
      case 'medium':
        return theme.sizes.button.height.md;
      case 'large':
        return theme.sizes.button.height.lg;
      default:
        return theme.sizes.button.height.md;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return theme.typography.fontSize.sm;
      case 'medium':
        return theme.typography.fontSize.md;
      case 'large':
        return theme.typography.fontSize.lg;
      default:
        return theme.typography.fontSize.md;
    }
  };

  const buttonStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    height: getHeight(),
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    opacity: disabled || loading ? 0.6 : 1,
    ...(fullWidth && {width: '100%'}),
    ...style,
  };

  const textStyleCombined: TextStyle = {
    color: getTextColor(),
    fontSize: getFontSize(),
    fontWeight: theme.typography.fontWeight.semiBold,
    ...textStyle,
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      testID={testID}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
      {...accessibilityProps}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
          accessibilityLabel="加载中"
        />
      ) : (
        <Text style={textStyleCombined}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;
