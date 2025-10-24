/**
 * 柱状图组件
 * 基于 victory-native 封装
 */

import React from 'react';
import {View, StyleSheet, AccessibilityProps} from 'react-native';
import {VictoryBar, VictoryChart, VictoryAxis, VictoryTheme} from 'victory-native';
import {useTheme} from '@/theme';
import ChartContainer from './ChartContainer';

export interface BarChartDataPoint {
  x: string | number;
  y: number;
}

export interface BarChartProps extends AccessibilityProps {
  data: BarChartDataPoint[];
  title?: string;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  height?: number;
  color?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  testID?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  loading = false,
  error,
  onRetry,
  height = 300,
  color,
  xAxisLabel,
  yAxisLabel,
  testID,
  accessibilityLabel,
  ...accessibilityProps
}) => {
  const {theme} = useTheme();

  const barColor = color || theme.colors.primary;

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
      accessibilityLabel={accessibilityLabel || `柱状图${title ? `: ${title}` : ''}`}
      accessibilityHint={getAccessibilityDescription()}
      {...accessibilityProps}>
      <View style={styles.chartWrapper}>
        <VictoryChart
          theme={VictoryTheme.material}
          height={height - 60}
          padding={{top: 20, bottom: 50, left: 60, right: 20}}
          domainPadding={{x: 20}}>
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
          <VictoryBar
            data={data}
            style={{
              data: {
                fill: barColor,
              },
            }}
            cornerRadius={{top: 4}}
            barRatio={0.8}
          />
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

export default BarChart;
