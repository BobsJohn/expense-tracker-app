/**
 * 组件演练场屏幕
 * 展示所有共享UI组件和图表组件
 */

import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {useTheme} from '@/theme';
import {
  PrimaryButton,
  IconButton,
  TextInputField,
  SelectPicker,
  AmountInput,
  DatePickerField,
  Card,
  Chip,
  ProgressBar,
  SectionHeader,
  EmptyState,
  LoadingOverlay,
  SelectOption,
} from '@/components/shared';
import {
  PieChart,
  BarChart,
  LineChart,
} from '@/components/charts';

const ComponentPlaygroundScreen: React.FC = () => {
  const {theme} = useTheme();

  // 按钮状态
  const [buttonLoading, setButtonLoading] = useState(false);

  // 输入框状态
  const [textValue, setTextValue] = useState('');
  const [textError, setTextError] = useState('');

  // 选择器状态
  const categoryOptions: SelectOption[] = [
    {label: '食品', value: 'food', icon: 'restaurant'},
    {label: '交通', value: 'transport', icon: 'directions-car'},
    {label: '娱乐', value: 'entertainment', icon: 'movie'},
    {label: '购物', value: 'shopping', icon: 'shopping-cart'},
  ];
  const [selectedCategory, setSelectedCategory] = useState<string>();

  // 金额输入状态
  const [amount, setAmount] = useState(0);

  // 日期选择器状态
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 芯片状态
  const [selectedChips, setSelectedChips] = useState<Set<string>>(new Set());

  // 进度条状态
  const [progress, setProgress] = useState(65);

  // 加载遮罩状态
  const [showOverlay, setShowOverlay] = useState(false);

  // 图表数据
  const pieChartData = [
    {x: '食品', y: 350, color: theme.colors.chart.primary},
    {x: '交通', y: 200, color: theme.colors.chart.secondary},
    {x: '娱乐', y: 150, color: theme.colors.chart.tertiary},
    {x: '购物', y: 300, color: theme.colors.chart.quaternary},
  ];

  const barChartData = [
    {x: '周一', y: 120},
    {x: '周二', y: 200},
    {x: '周三', y: 150},
    {x: '周四', y: 300},
    {x: '周五', y: 250},
  ];

  const lineChartData = [
    {x: '1月', y: 1000},
    {x: '2月', y: 1500},
    {x: '3月', y: 1200},
    {x: '4月', y: 1800},
    {x: '5月', y: 2200},
    {x: '6月', y: 2500},
  ];

  const handleButtonPress = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 2000);
  };

  const handleTextChange = (value: string) => {
    setTextValue(value);
    if (value.length > 0 && value.length < 3) {
      setTextError('至少需要3个字符');
    } else {
      setTextError('');
    }
  };

  const toggleChip = (chipId: string) => {
    const newSelected = new Set(selectedChips);
    if (newSelected.has(chipId)) {
      newSelected.delete(chipId);
    } else {
      newSelected.add(chipId);
    }
    setSelectedChips(newSelected);
  };

  const handleShowOverlay = () => {
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={[styles.container, {backgroundColor: theme.colors.backgroundSecondary}]}
        contentContainerStyle={styles.contentContainer}>
        
        {/* 标题 */}
        <Text style={[styles.pageTitle, {color: theme.colors.textPrimary}]}>
          组件演练场
        </Text>
        <Text style={[styles.pageSubtitle, {color: theme.colors.textSecondary}]}>
          展示所有共享UI组件和图表组件
        </Text>

        {/* 按钮部分 */}
        <SectionHeader title="按钮组件" icon="touch-app" />
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.colors.textPrimary}]}>
            主按钮
          </Text>
          <View style={styles.buttonRow}>
            <PrimaryButton
              title="主要按钮"
              onPress={handleButtonPress}
              variant="primary"
              size="medium"
              loading={buttonLoading}
              style={styles.button}
            />
            <PrimaryButton
              title="次要按钮"
              onPress={() => {}}
              variant="secondary"
              size="medium"
              style={styles.button}
            />
          </View>
          <View style={styles.buttonRow}>
            <PrimaryButton
              title="成功"
              onPress={() => {}}
              variant="success"
              size="small"
              style={styles.button}
            />
            <PrimaryButton
              title="危险"
              onPress={() => {}}
              variant="danger"
              size="small"
              style={styles.button}
            />
          </View>

          <Text style={[styles.sectionTitle, {color: theme.colors.textPrimary, marginTop: 16}]}>
            图标按钮
          </Text>
          <View style={styles.buttonRow}>
            <IconButton icon="add" onPress={() => {}} />
            <IconButton icon="edit" onPress={() => {}} />
            <IconButton icon="delete" onPress={() => {}} color={theme.colors.danger} />
            <IconButton icon="share" onPress={() => {}} />
          </View>
        </Card>

        {/* 表单输入部分 */}
        <SectionHeader title="表单组件" icon="edit" />
        <Card style={styles.section}>
          <TextInputField
            label="文本输入"
            value={textValue}
            onChangeText={handleTextChange}
            placeholder="请输入文本"
            error={textError}
            helperText="至少需要3个字符"
            leftIcon="person"
            required
          />

          <SelectPicker
            label="选择类别"
            placeholder="请选择类别"
            value={selectedCategory}
            options={categoryOptions}
            onChange={setSelectedCategory}
            required
          />

          <AmountInput
            label="金额输入"
            value={amount}
            onChange={setAmount}
            currency="$"
            placeholder="0.00"
            required
          />

          <DatePickerField
            label="日期选择"
            value={selectedDate}
            onChange={setSelectedDate}
            required
          />
        </Card>

        {/* 展示组件部分 */}
        <SectionHeader title="展示组件" icon="visibility" />
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.colors.textPrimary}]}>
            芯片/标签
          </Text>
          <View style={styles.chipRow}>
            <Chip
              label="食品"
              icon="restaurant"
              selected={selectedChips.has('food')}
              onPress={() => toggleChip('food')}
              style={styles.chip}
            />
            <Chip
              label="交通"
              icon="directions-car"
              selected={selectedChips.has('transport')}
              onPress={() => toggleChip('transport')}
              style={styles.chip}
            />
            <Chip
              label="娱乐"
              icon="movie"
              selected={selectedChips.has('entertainment')}
              onPress={() => toggleChip('entertainment')}
              style={styles.chip}
            />
          </View>

          <Text style={[styles.sectionTitle, {color: theme.colors.textPrimary, marginTop: 16}]}>
            进度条
          </Text>
          <ProgressBar
            progress={progress}
            total={100}
            showPercentage
            label="预算使用"
            style={styles.progressBar}
          />
          <View style={styles.buttonRow}>
            <PrimaryButton
              title="-10"
              onPress={() => setProgress(Math.max(0, progress - 10))}
              size="small"
              variant="secondary"
              style={styles.button}
            />
            <PrimaryButton
              title="+10"
              onPress={() => setProgress(Math.min(100, progress + 10))}
              size="small"
              variant="secondary"
              style={styles.button}
            />
          </View>
        </Card>

        {/* 状态组件部分 */}
        <SectionHeader title="状态组件" icon="info" />
        <Card style={styles.section}>
          <EmptyState
            icon="inbox"
            title="暂无数据"
            description="还没有任何记录，点击下方按钮添加"
            actionLabel="添加记录"
            onAction={() => {}}
          />
        </Card>

        <Card style={styles.section}>
          <PrimaryButton
            title="显示加载遮罩"
            onPress={handleShowOverlay}
            variant="primary"
            fullWidth
          />
        </Card>

        {/* 图表部分 */}
        <SectionHeader title="图表组件" icon="bar-chart" />
        
        <Card style={styles.section}>
          <PieChart
            data={pieChartData}
            title="支出分类饼图"
            height={300}
            showLabels={false}
          />
        </Card>

        <Card style={styles.section}>
          <BarChart
            data={barChartData}
            title="每日支出柱状图"
            height={300}
            xAxisLabel="日期"
            yAxisLabel="金额"
          />
        </Card>

        <Card style={styles.section}>
          <LineChart
            data={lineChartData}
            title="月度支出趋势"
            height={300}
            xAxisLabel="月份"
            yAxisLabel="金额"
            curved
            showPoints
          />
        </Card>

        {/* 底部间距 */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <LoadingOverlay
        visible={showOverlay}
        message="加载中，请稍候..."
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
  progressBar: {
    marginBottom: 16,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default ComponentPlaygroundScreen;
