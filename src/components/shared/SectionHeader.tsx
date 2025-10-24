/**
 * 区块标题组件
 * 用于分割和标识内容区块
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

export interface SectionHeaderProps extends AccessibilityProps {
  title: string;
  subtitle?: string;
  icon?: string;
  rightText?: string;
  onRightPress?: () => void;
  rightIcon?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  testID?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  rightText,
  onRightPress,
  rightIcon,
  style,
  titleStyle,
  subtitleStyle,
  testID,
  accessibilityLabel,
  ...accessibilityProps
}) => {
  const {theme} = useTheme();

  const handleRightPress = () => {
    if (onRightPress) {
      triggerHapticFeedback.light();
      onRightPress();
    }
  };

  return (
    <View
      style={[styles.container, style]}
      testID={testID}
      accessible={true}
      accessibilityRole="header"
      accessibilityLabel={accessibilityLabel || `${title}${subtitle ? `, ${subtitle}` : ''}`}
      {...accessibilityProps}>
      <View style={styles.leftContent}>
        {icon && (
          <Icon
            name={icon}
            size={theme.sizes.icon.md}
            color={theme.colors.textPrimary}
            style={styles.icon}
          />
        )}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.textPrimary,
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.semiBold,
              },
              titleStyle,
            ]}>
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.sm,
                },
                subtitleStyle,
              ]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {(rightText || rightIcon || onRightPress) && (
        <TouchableOpacity
          onPress={handleRightPress}
          disabled={!onRightPress}
          style={styles.rightContent}
          accessibilityRole="button"
          accessibilityLabel={rightText || '查看更多'}>
          {rightText && (
            <Text
              style={[
                styles.rightText,
                {
                  color: theme.colors.primary,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                },
              ]}>
              {rightText}
            </Text>
          )}
          {rightIcon && (
            <Icon
              name={rightIcon}
              size={theme.sizes.icon.sm}
              color={theme.colors.primary}
              style={styles.rightIcon}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {},
  subtitle: {
    marginTop: 2,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  rightText: {},
  rightIcon: {
    marginLeft: 4,
  },
});

export default SectionHeader;
