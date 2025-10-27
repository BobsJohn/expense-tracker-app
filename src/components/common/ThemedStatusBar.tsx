/**
 * ThemedStatusBar 组件
 * 根据当前主题自动调整状态栏样式
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {useTheme} from '@/theme';

const ThemedStatusBar: React.FC = () => {
  const {themeMode, theme} = useTheme();

  return (
    <StatusBar
      barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
      backgroundColor={theme.colors.background}
    />
  );
};

export default ThemedStatusBar;
