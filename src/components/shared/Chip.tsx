/**
 * 芯片/标签组件
 * 用于显示标签、过滤器等
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  AccessibilityProps,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '@/theme';
import {triggerHapticFeedback} from '@/utils/haptics';

export interface ChipProps extends AccessibilityProps {
  label: string;
  onPress?: () => void;
  onDelete?: () => void;
  variant?: 'filled' | 'outlined';
  color?: string;
  icon?: string;
  selected?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const Chip: React.FC<ChipProps> = ({
  label,
  onPress,
  onDelete,
  variant = 'filled',
  color,
  icon,
  selected = false,
  disabled = false,
  size = 'medium',
  style,
  textStyle,
  testID,
  accessibilityLabel,
  accessibilityHint,
  ...accessibilityProps
}) => {
  const {theme} = useTheme();

  const handlePress = () => {
    if (onPress && !disabled) {
      triggerHapticFeedback.light();
      onPress();
    }
  };

  const handleDelete = () => {
    if (onDelete && !disabled) {
      triggerHapticFeedback.light();
      onDelete();
    }
  };

  const chipColor = color || theme.colors.primary;
  const isSmall = size === 'small';

  const getBackgroundColor = () => {
    if (variant === 'outlined') {
      return selected ? `${chipColor}20` : 'transparent';
    }
    return selected ? chipColor : `${chipColor}20`;
  };

  const getTextColor = () => {
    if (variant === 'outlined') {
      return chipColor;
    }
    return selected ? theme.colors.textOnPrimary : chipColor;
  };

  const getBorderColor = () => {
    return variant === 'outlined' ? chipColor : 'transparent';
  };

  const chipStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderColor: getBorderColor(),
    borderWidth: variant === 'outlined' ? 1 : 0,
    borderRadius: theme.borderRadius.full,
    paddingVertical: isSmall ? theme.spacing.xs : theme.spacing.sm,
    paddingHorizontal: isSmall ? theme.spacing.sm : theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    opacity: disabled ? 0.5 : 1,
    ...style,
  };

  const chipTextStyle: TextStyle = {
    color: getTextColor(),
    fontSize: isSmall ? theme.typography.fontSize.xs : theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    ...textStyle,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={chipStyle}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
        testID={testID}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{disabled, selected}}
        {...accessibilityProps}>
        {icon && (
          <Icon
            name={icon}
            size={isSmall ? theme.sizes.icon.xs : theme.sizes.icon.sm}
            color={getTextColor()}
            style={styles.icon}
          />
        )}
        <Text style={chipTextStyle}>{label}</Text>
        {onDelete && (
          <TouchableOpacity
            onPress={handleDelete}
            disabled={disabled}
            hitSlop={{top: 8, right: 8, bottom: 8, left: 8}}
            accessibilityRole="button"
            accessibilityLabel={`删除 ${label}`}>
            <Icon
              name="close"
              size={isSmall ? theme.sizes.icon.xs : theme.sizes.icon.sm}
              color={getTextColor()}
              style={styles.deleteIcon}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={chipStyle}
      testID={testID}
      accessible={true}
      accessibilityLabel={accessibilityLabel || label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{disabled, selected}}
      {...accessibilityProps}>
      {icon && (
        <Icon
          name={icon}
          size={isSmall ? theme.sizes.icon.xs : theme.sizes.icon.sm}
          color={getTextColor()}
          style={styles.icon}
        />
      )}
      <Text style={chipTextStyle}>{label}</Text>
      {onDelete && (
        <TouchableOpacity
          onPress={handleDelete}
          disabled={disabled}
          hitSlop={{top: 8, right: 8, bottom: 8, left: 8}}
          accessibilityRole="button"
          accessibilityLabel={`删除 ${label}`}>
          <Icon
            name="close"
            size={isSmall ? theme.sizes.icon.xs : theme.sizes.icon.sm}
            color={getTextColor()}
            style={styles.deleteIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 4,
  },
  deleteIcon: {
    marginLeft: 4,
  },
});

export default Chip;
