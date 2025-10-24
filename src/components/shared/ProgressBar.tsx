/**
 * 进度条组件
 * 支持主题、动画和无障碍访问
 */

import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  AccessibilityProps,
} from 'react-native';
import {useTheme} from '@/theme';

export interface ProgressBarProps extends AccessibilityProps {
  progress: number;
  total?: number;
  showLabel?: boolean;
  showPercentage?: boolean;
  height?: number;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
  label?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  testID?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  total = 100,
  showLabel = false,
  showPercentage = false,
  height = 8,
  color,
  backgroundColor,
  animated = true,
  label,
  style,
  labelStyle,
  testID,
  accessibilityLabel,
  accessibilityHint,
  ...accessibilityProps
}) => {
  const {theme} = useTheme();
  const animatedWidth = useRef(new Animated.Value(0)).current;

  const percentage = Math.min(Math.max((progress / total) * 100, 0), 100);

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: percentage,
        duration: theme.animation.duration.normal,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(percentage);
    }
  }, [percentage, animated, animatedWidth, theme.animation.duration.normal]);

  const barColor = color || theme.colors.primary;
  const barBackgroundColor = backgroundColor || theme.colors.backgroundSecondary;

  const getProgressColor = () => {
    if (percentage >= 100) {
      return theme.colors.success;
    }
    if (percentage >= 75) {
      return barColor;
    }
    if (percentage >= 50) {
      return theme.colors.warning;
    }
    return theme.colors.danger;
  };

  const progressColor = color || getProgressColor();

  const containerStyle: ViewStyle = {
    ...style,
  };

  const backgroundBarStyle: ViewStyle = {
    height,
    backgroundColor: barBackgroundColor,
    borderRadius: height / 2,
    overflow: 'hidden',
  };

  const progressBarStyle = {
    height: height,
    backgroundColor: progressColor,
    borderRadius: height / 2,
    width: animatedWidth.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    }),
  };

  const progressText = `${progress.toFixed(0)} / ${total}`;
  const percentageText = `${percentage.toFixed(0)}%`;

  return (
    <View
      style={containerStyle}
      testID={testID}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel || label || '进度'}
      accessibilityHint={accessibilityHint}
      accessibilityValue={{
        min: 0,
        max: total,
        now: progress,
        text: `${percentageText}完成`,
      }}
      {...accessibilityProps}>
      {(showLabel || label) && (
        <View style={styles.labelContainer}>
          {label && (
            <Text
              style={[
                styles.label,
                {
                  color: theme.colors.textPrimary,
                  fontSize: theme.typography.fontSize.sm,
                },
                labelStyle,
              ]}>
              {label}
            </Text>
          )}
          {showPercentage && (
            <Text
              style={[
                styles.percentage,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.sm,
                },
              ]}>
              {percentageText}
            </Text>
          )}
        </View>
      )}

      <View style={backgroundBarStyle}>
        <Animated.View style={progressBarStyle} />
      </View>

      {showLabel && !showPercentage && (
        <Text
          style={[
            styles.progressText,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.xs,
            },
          ]}>
          {progressText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {},
  percentage: {},
  progressText: {
    marginTop: 4,
    textAlign: 'right',
  },
});

export default ProgressBar;
