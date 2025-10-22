import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ViewStyle, Animated } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  animated?: boolean;
  style?: ViewStyle;
}

const ProgressBar: React.FC<ProgressBarProps> = React.memo(({
  progress,
  height = 8,
  backgroundColor = '#E5E5EA',
  progressColor = '#007AFF',
  animated = true,
  style,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: clampedProgress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(clampedProgress);
    }
  }, [clampedProgress, animated, animatedWidth]);

  return (
    <View
      style={[
        styles.container,
        { height, backgroundColor },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.progress,
          {
            height,
            backgroundColor: progressColor,
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: 4,
  },
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;