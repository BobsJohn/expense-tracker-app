/**
 * 折线图组件
 * 基于 victory-native 封装
 */

import React from 'react';
import {View, StyleSheet, AccessibilityProps} from 'react-native';
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryScatter,
} from 'victory-native';
import {useTheme} from '@/theme';
import ChartContainer from './ChartContainer';

export interface LineChartDataPoint {
  x: string | number;
  y: number;
}

export interface LineChartProps extends AccessibilityProps {
  data: LineChartDataPoint[];
  title?: string;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  height?: number;
  color?: string;
  showPoints?: boolean;
  curved?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  testID?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  loading = false,
  error,
  onRetry,
  height = 300,
  color,
  showPoints = true,
  curved = true,
  xAxisLabel,
  yAxisLabel,
  testID,
  accessibilityLabel,
  ...accessibilityProps
}) => {
  const {theme} = useTheme();

  const lineColor = color || theme.colors.primary;

  const getAccessibilityDescription = () => {
    const descriptions = data.map((d) => `${d.x}: ${d.y}`);
    return descriptions.join(', ');
  };

  return (
    <ChartContainer
      title={title}
      loading={loading}
      error={error}
      onRetry={onRetry}
      height={height}
      testID={testID}
      accessibilityLabel={accessibilityLabel || `折线图${title ? `: ${title}` : ''}`}
      accessibilityHint={getAccessibilityDescription()}
      {...accessibilityProps}>
      <View style={styles.chartWrapper}>
        <VictoryChart
          theme={VictoryTheme.material}
          height={height - 60}
          padding={{top: 20, bottom: 50, left: 60, right: 20}}>
          <VictoryAxis
            style={{
              axis: {stroke: theme.colors.border},
              axisLabel: {
                fontSize: theme.typography.fontSize.sm,
                fill: theme.colors.textSecondary,
                padding: 35,
              },
              tickLabels: {
                fontSize: theme.typography.fontSize.xs,
                fill: theme.colors.textSecondary,
                padding: 5,
              },
              grid: {stroke: 'transparent'},
            }}
            label={xAxisLabel}
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: {stroke: theme.colors.border},
              axisLabel: {
                fontSize: theme.typography.fontSize.sm,
                fill: theme.colors.textSecondary,
                padding: 40,
              },
              tickLabels: {
                fontSize: theme.typography.fontSize.xs,
                fill: theme.colors.textSecondary,
                padding: 5,
              },
              grid: {
                stroke: theme.colors.borderLight,
                strokeDasharray: '4,4',
              },
            }}
            label={yAxisLabel}
          />
          <VictoryLine
            data={data}
            style={{
              data: {
                stroke: lineColor,
                strokeWidth: 2,
              },
            }}
            interpolation={curved ? 'natural' : 'linear'}
          />
          {showPoints && (
            <VictoryScatter
              data={data}
              style={{
                data: {
                  fill: lineColor,
                },
              }}
              size={4}
            />
          )}
        </VictoryChart>
      </View>
    </ChartContainer>
  );
};

const styles = StyleSheet.create({
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LineChart;
