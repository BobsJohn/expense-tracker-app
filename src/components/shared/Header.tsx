/**
 * Header 组件
 * 提供一致的屏幕标题头部，支持主题化
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle} from 'react-native';
import {useTheme} from '@/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: {
    icon?: string;
    text?: string;
    onPress: () => void;
  };
  rightAction?: {
    icon?: string;
    text?: string;
    onPress: () => void;
  };
  style?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({title, subtitle, leftAction, rightAction, style}) => {
  const {theme} = useTheme();

  const titleStyle: TextStyle = {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  };

  const subtitleStyle: TextStyle = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  };

  const actionTextStyle: TextStyle = {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}, style]}>
      <View style={styles.header}>
        <View style={styles.leftAction}>
          {leftAction && (
            <TouchableOpacity onPress={leftAction.onPress} style={styles.actionButton}>
              <Text style={actionTextStyle}>{leftAction.text || leftAction.icon}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text style={titleStyle}>{title}</Text>
          {subtitle && <Text style={subtitleStyle}>{subtitle}</Text>}
        </View>

        <View style={styles.rightAction}>
          {rightAction && (
            <TouchableOpacity onPress={rightAction.onPress} style={styles.actionButton}>
              <Text style={actionTextStyle}>{rightAction.text || rightAction.icon}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  leftAction: {
    width: 60,
    alignItems: 'flex-start',
  },
  rightAction: {
    width: 60,
    alignItems: 'flex-end',
  },
  actionButton: {
    padding: 8,
  },
});

export default Header;
