/**
 * 加载指示器组件
 * 
 * 功能说明：
 * - 显示加载动画和提示文字
 * - 支持自定义加载提示信息
 * - 支持小号和大号两种尺寸
 * - 集成国际化支持
 * 
 * 使用场景：
 * - 应用初始化加载
 * - 数据获取等待
 * - 异步操作进行中
 * 
 * @module components/common/LoadingSpinner
 */
import React from 'react';
import {View, ActivityIndicator, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

/**
 * 组件属性接口
 */
interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

/**
 * 加载指示器组件
 * 
 * @param message - 自定义加载提示信息（可选，默认使用国际化文本）
 * @param size - 指示器尺寸，可选 'small' 或 'large'（默认 'large'）
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({message, size = 'large'}) => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#007AFF" />
      <Text style={styles.message}>{message || t('common.loading')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default LoadingSpinner;
