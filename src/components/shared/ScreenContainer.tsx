/**
 * ScreenContainer 组件
 * 提供一致的屏幕容器，支持主题化
 */

import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@/theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  useSafeArea?: boolean;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({children, style, useSafeArea = true}) => {
  const {theme} = useTheme();

  const containerStyle = [
    styles.container,
    {backgroundColor: theme.colors.backgroundSecondary},
    style,
  ];

  if (useSafeArea) {
    return (
      <SafeAreaView style={containerStyle} edges={['bottom', 'left', 'right']}>
        {children}
      </SafeAreaView>
    );
  }

  return <View style={containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenContainer;
