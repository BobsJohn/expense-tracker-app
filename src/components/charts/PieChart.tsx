/**
 * 饼图组件
 * 基于 victory-native 封装
 */

import React from 'react';
import {View, StyleSheet, AccessibilityProps} from 'react-native';
import {VictoryPie, VictoryLabel} from 'victory-native';
import {useTheme} from '@/theme';
import ChartContainer from './ChartContainer';

export interface PieChartDataPoint {
  x: string;
  y: number;
  color?: string;
}

export interface PieChartProps extends AccessibilityProps {
  data: PieChartDataPoint[];
  title?: string;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  height?: number;
  innerRadius?: number;
  showLabels?: boolean;
  testID?: string;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  loading = false,
  error,
  onRetry,
  height = 300,
  innerRadius = 0,
  showLabels = true,
  testID,
  accessibilityLabel,
  ...accessibilityProps
}) => {
  const {theme} = useTheme();

  const chartColors = data.map(
    (d, i) => d.color || theme.colors.chart[Object.keys(theme.colors.chart)[i % 6] as keyof typeof theme.colors.chart]
  );

  const chartData = data.map((d) => ({
    x: d.x,
    y: d.y,
  }));

  const totalValue = data.reduce((sum, d) => sum + d.y, 0);

  const getAccessibilityDescription = () => {
    const descriptions = data.map((d) => {
      const percentage = ((d.y / totalValue) * 100).toFixed(1);
      return `${d.x}: ${d.y} (${percentage}%)`;
    });
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
      accessibilityLabel={accessibilityLabel || `饼图${title ? `: ${title}` : ''}`}
      accessibilityHint={getAccessibilityDescription()}
      {...accessibilityProps}>
      <View style={styles.chartWrapper}>
        <VictoryPie
          data={chartData}
          colorScale={chartColors}
          innerRadius={innerRadius}
          labels={showLabels ? ({datum}) => `${datum.x}\n${datum.y}` : () => ''}
          labelComponent={
            <VictoryLabel
              style={{
                fontSize: theme.typography.fontSize.xs,
                fill: theme.colors.textPrimary,
              }}
            />
          }
          style={{
            data: {
              stroke: theme.colors.background,
              strokeWidth: 2,
            },
            labels: {
              fontSize: theme.typography.fontSize.xs,
              fill: theme.colors.textPrimary,
            },
          }}
          padding={40}
          height={height - 60}
        />
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

export default PieChart;
