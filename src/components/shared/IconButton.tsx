/**
 * 图标按钮组件
 * 支持主题、无障碍访问和国际化
 */

import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  AccessibilityProps,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '@/theme';
import {triggerHapticFeedback} from '@/utils/haptics';

export interface IconButtonProps extends AccessibilityProps {
  icon: string;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  backgroundColor?: string;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 'medium',
  color,
  backgroundColor,
  disabled = false,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
  ...accessibilityProps
}) => {
  const {theme} = useTheme();

  const handlePress = () => {
    if (!disabled) {
      triggerHapticFeedback.light();
      onPress();
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return theme.sizes.icon.sm;
      case 'medium':
        return theme.sizes.icon.md;
      case 'large':
        return theme.sizes.icon.lg;
      default:
        return theme.sizes.icon.md;
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return 32;
      case 'medium':
        return 44;
      case 'large':
        return 56;
      default:
        return 44;
    }
  };

  const buttonSize = getButtonSize();
  const iconSize = getIconSize();
  const iconColor = color || theme.colors.textPrimary;
  const bgColor = backgroundColor || 'transparent';

  const buttonStyle: ViewStyle = {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    backgroundColor: bgColor,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.5 : 1,
    ...style,
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      testID={testID}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || `${icon}按钮`}
      accessibilityHint={accessibilityHint}
      accessibilityState={{disabled}}
      {...accessibilityProps}>
      <Icon name={icon} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

export default IconButton;
