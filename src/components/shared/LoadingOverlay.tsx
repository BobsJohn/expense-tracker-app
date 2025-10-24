/**
 * 加载遮罩层组件
 * 用于显示全屏或局部加载状态
 */

import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  Modal,
  StyleSheet,
  ViewStyle,
  TextStyle,
  AccessibilityProps,
} from 'react-native';
import {useTheme} from '@/theme';

export interface LoadingOverlayProps extends AccessibilityProps {
  visible: boolean;
  message?: string;
  fullscreen?: boolean;
  transparent?: boolean;
  style?: ViewStyle;
  messageStyle?: TextStyle;
  testID?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = '加载中...',
  fullscreen = true,
  transparent = true,
  style,
  messageStyle,
  testID,
  accessibilityLabel,
  ...accessibilityProps
}) => {
  const {theme} = useTheme();

  const overlayStyle: ViewStyle = {
    backgroundColor: transparent
      ? theme.colors.overlay
      : theme.colors.background,
    ...style,
  };

  const content = (
    <View
      style={styles.content}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel || message}
      accessibilityLiveRegion="polite"
      {...accessibilityProps}>
      <ActivityIndicator
        size="large"
        color={theme.colors.primary}
        accessibilityLabel="正在加载"
      />
      {message && (
        <Text
          style={[
            styles.message,
            {
              color: transparent ? theme.colors.textOnPrimary : theme.colors.textPrimary,
              fontSize: theme.typography.fontSize.md,
            },
            messageStyle,
          ]}>
          {message}
        </Text>
      )}
    </View>
  );

  if (!visible) {
    return null;
  }

  if (fullscreen) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        testID={testID}
        accessibilityViewIsModal>
        <View style={[styles.overlay, overlayStyle]}>
          {content}
        </View>
      </Modal>
    );
  }

  return (
    <View
      style={[styles.overlay, overlayStyle]}
      testID={testID}
      pointerEvents="box-only">
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
  },
});

export default LoadingOverlay;
