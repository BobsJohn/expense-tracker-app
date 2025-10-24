# 共享UI组件库和工具模块文档

## 概述

本项目包含一套完整的共享UI组件库、图表组件和实用工具模块，所有组件都支持：
- 🎨 主题定制
- 🌍 国际化（i18n）
- ♿ 无障碍访问（VoiceOver/TalkBack）
- 📱 响应式设计
- ⚡ 性能优化

## 目录

- [主题系统](#主题系统)
- [共享UI组件](#共享UI组件)
- [图表组件](#图表组件)
- [表单工具](#表单工具)
- [格式化工具](#格式化工具)
- [演练场](#演练场)

## 主题系统

### 使用方法

```typescript
import {ThemeProvider, useTheme} from '@/theme';

// 在应用根部包裹 ThemeProvider
function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}

// 在组件中使用主题
function MyComponent() {
  const {theme} = useTheme();
  
  return (
    <View style={{backgroundColor: theme.colors.primary}}>
      <Text style={{color: theme.colors.textOnPrimary}}>
        Hello World
      </Text>
    </View>
  );
}
```

### 主题配置

主题包含以下配置：
- `colors` - 颜色配置（主色、辅助色、文本色、背景色等）
- `typography` - 字体配置（字体家族、大小、粗细）
- `spacing` - 间距配置
- `borderRadius` - 圆角配置
- `shadows` - 阴影配置
- `sizes` - 尺寸配置（图标、按钮、输入框）
- `animation` - 动画配置

## 共享UI组件

### PrimaryButton - 主按钮

支持多种变体、尺寸和加载状态的按钮组件。

```typescript
import {PrimaryButton} from '@/components/shared';

<PrimaryButton
  title="提交"
  onPress={handleSubmit}
  variant="primary"  // primary | secondary | danger | success
  size="medium"      // small | medium | large
  loading={isLoading}
  disabled={false}
  fullWidth={false}
  accessibilityLabel="提交表单"
/>
```

### IconButton - 图标按钮

圆形图标按钮，适用于工具栏和操作按钮。

```typescript
import {IconButton} from '@/components/shared';

<IconButton
  icon="add"
  onPress={handleAdd}
  size="medium"      // small | medium | large
  color={theme.colors.primary}
  backgroundColor="transparent"
  accessibilityLabel="添加项目"
/>
```

### TextInputField - 文本输入框

支持标签、错误提示、辅助文本和图标的输入框组件。

```typescript
import {TextInputField} from '@/components/shared';

<TextInputField
  label="用户名"
  value={username}
  onChangeText={setUsername}
  placeholder="请输入用户名"
  error={errors.username}
  helperText="至少3个字符"
  leftIcon="person"
  rightIcon="clear"
  onRightIconPress={handleClear}
  required
  accessibilityLabel="用户名输入框"
/>
```

### SelectPicker - 选择器

模态选择器组件，支持图标和禁用选项。

```typescript
import {SelectPicker} from '@/components/shared';

const options = [
  {label: '选项1', value: '1', icon: 'check'},
  {label: '选项2', value: '2', disabled: true},
];

<SelectPicker
  label="选择类别"
  placeholder="请选择"
  value={selectedValue}
  options={options}
  onChange={setSelectedValue}
  error={errors.category}
  required
  accessibilityLabel="类别选择器"
/>
```

### AmountInput - 金额输入

专门用于货币金额输入的组件，带自动格式化。

```typescript
import {AmountInput} from '@/components/shared';

<AmountInput
  label="金额"
  value={amount}
  onChange={setAmount}
  currency="$"
  placeholder="0.00"
  error={errors.amount}
  minValue={0}
  maxValue={10000}
  required
  accessibilityLabel="金额输入"
/>
```

### DatePickerField - 日期选择器

封装原生日期选择器的组件。

```typescript
import {DatePickerField} from '@/components/shared';

<DatePickerField
  label="日期"
  value={date}
  onChange={setDate}
  mode="date"        // date | time | datetime
  minimumDate={new Date()}
  error={errors.date}
  required
  accessibilityLabel="日期选择"
/>
```

### Card - 卡片容器

通用卡片容器组件。

```typescript
import {Card} from '@/components/shared';

<Card
  variant="elevated"  // default | outlined | elevated
  padding="md"        // none | sm | md | lg
  onPress={handlePress}
  accessibilityLabel="卡片内容"
>
  <Text>卡片内容</Text>
</Card>
```

### Chip - 芯片/标签

用于标签、过滤器等的芯片组件。

```typescript
import {Chip} from '@/components/shared';

<Chip
  label="食品"
  icon="restaurant"
  variant="filled"    // filled | outlined
  selected={isSelected}
  onPress={handleSelect}
  onDelete={handleDelete}
  size="medium"       // small | medium
  accessibilityLabel="食品标签"
/>
```

### ProgressBar - 进度条

动画进度条组件。

```typescript
import {ProgressBar} from '@/components/shared';

<ProgressBar
  progress={65}
  total={100}
  label="预算使用"
  showPercentage
  showLabel
  height={8}
  color={theme.colors.primary}
  animated
  accessibilityLabel="预算使用进度"
/>
```

### SectionHeader - 区块标题

用于分割和标识内容区块的标题组件。

```typescript
import {SectionHeader} from '@/components/shared';

<SectionHeader
  title="最近交易"
  subtitle="过去7天"
  icon="receipt"
  rightText="查看全部"
  rightIcon="arrow-forward"
  onRightPress={handleViewAll}
  accessibilityLabel="最近交易区块"
/>
```

### EmptyState - 空状态

显示无数据、无结果等空状态的组件。

```typescript
import {EmptyState} from '@/components/shared';

<EmptyState
  icon="inbox"
  title="暂无数据"
  description="还没有任何记录"
  actionLabel="添加记录"
  onAction={handleAdd}
  accessibilityLabel="空状态提示"
/>
```

### LoadingOverlay - 加载遮罩

全屏或局部加载遮罩组件。

```typescript
import {LoadingOverlay} from '@/components/shared';

<LoadingOverlay
  visible={isLoading}
  message="加载中..."
  fullscreen
  transparent
  accessibilityLabel="加载中"
/>
```

## 图表组件

所有图表组件都基于 `victory-native` 封装，提供统一的样式和错误处理。

### PieChart - 饼图

```typescript
import {PieChart} from '@/components/charts';

const data = [
  {x: '食品', y: 350, color: '#007AFF'},
  {x: '交通', y: 200, color: '#5856D6'},
  {x: '娱乐', y: 150, color: '#34C759'},
];

<PieChart
  data={data}
  title="支出分类"
  height={300}
  innerRadius={50}  // 0 为饼图，>0 为环形图
  showLabels
  loading={isLoading}
  error={error}
  onRetry={handleRetry}
  accessibilityLabel="支出分类饼图"
/>
```

### BarChart - 柱状图

```typescript
import {BarChart} from '@/components/charts';

const data = [
  {x: '周一', y: 120},
  {x: '周二', y: 200},
  {x: '周三', y: 150},
];

<BarChart
  data={data}
  title="每日支出"
  height={300}
  color={theme.colors.primary}
  xAxisLabel="日期"
  yAxisLabel="金额"
  loading={isLoading}
  error={error}
  onRetry={handleRetry}
  accessibilityLabel="每日支出柱状图"
/>
```

### LineChart - 折线图

```typescript
import {LineChart} from '@/components/charts';

const data = [
  {x: '1月', y: 1000},
  {x: '2月', y: 1500},
  {x: '3月', y: 1200},
];

<LineChart
  data={data}
  title="月度趋势"
  height={300}
  color={theme.colors.primary}
  curved           // 曲线或直线
  showPoints       // 显示数据点
  xAxisLabel="月份"
  yAxisLabel="金额"
  loading={isLoading}
  error={error}
  onRetry={handleRetry}
  accessibilityLabel="月度趋势折线图"
/>
```

## 表单工具

### Yup 验证模式

```typescript
import {schemas, commonValidations, createSchema} from '@/utils/form';

// 使用预定义模式
const transactionSchema = schemas.transaction;

// 使用通用验证规则
const customSchema = createSchema({
  email: commonValidations.email(),
  amount: commonValidations.positiveNumber('金额'),
  date: commonValidations.date('日期'),
});
```

### React Hook Form 集成

```typescript
import {useForm} from 'react-hook-form';
import {createFormResolver, getFieldError} from '@/utils/form';
import {schemas} from '@/utils/form';

function MyForm() {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: createFormResolver(schemas.transaction),
  });

  return (
    <TextInputField
      label="金额"
      error={getFieldError(errors.amount)}
      {...control.register('amount')}
    />
  );
}
```

## 格式化工具

### 货币格式化

```typescript
import {
  formatCurrency,
  formatCompactCurrency,
  parseCurrencyInput,
  getCurrencySymbol,
} from '@/utils/formatting';

formatCurrency(1234.56, 'USD', 'en-US');           // "$1,234.56"
formatCompactCurrency(1500000, 'USD', 'en-US');    // "$1.5M"
parseCurrencyInput('$1,234.56');                   // 1234.56
getCurrencySymbol('USD', 'en-US');                 // "$"
```

### 日期格式化

```typescript
import {
  formatDate,
  formatShortDate,
  formatLongDate,
  formatDateTime,
  formatRelativeTime,
} from '@/utils/formatting';

const date = new Date();

formatDate(date, 'en-US');              // "Jan 15, 2024"
formatShortDate(date, 'en-US');         // "01/15/2024"
formatLongDate(date, 'en-US');          // "January 15, 2024"
formatDateTime(date, 'en-US');          // "Jan 15, 2024, 10:30 AM"
formatRelativeTime(date, 'en-US');      // "2 hours ago"
```

### 数字格式化

```typescript
import {
  formatNumber,
  formatDecimal,
  formatPercentage,
  formatCompactNumber,
  calculatePercentage,
  roundToDecimals,
} from '@/utils/formatting';

formatNumber(1234.56, 'en-US');                    // "1,234.56"
formatDecimal(123.456, 2, 'en-US');                // "123.46"
formatPercentage(75.5, 1, 'en-US');                // "75.5%"
formatCompactNumber(1500000, 'en-US');             // "1.5M"
calculatePercentage(50, 100);                      // 50
roundToDecimals(123.456, 2);                       // 123.46
```

## 演练场

运行应用并导航到 `ComponentPlaygroundScreen` 查看所有组件的实时演示。

```typescript
import ComponentPlaygroundScreen from '@/screens/ComponentPlaygroundScreen';

// 在导航配置中添加
<Stack.Screen 
  name="ComponentPlayground" 
  component={ComponentPlaygroundScreen} 
/>
```

## 无障碍访问

所有组件都实现了完整的无障碍访问支持：
- 正确的 `accessibilityRole` 和 `accessibilityLabel`
- 键盘导航支持
- 屏幕阅读器支持（VoiceOver/TalkBack）
- 高对比度和大字体支持
- 动态内容的 `accessibilityLiveRegion`

## 测试

运行单元测试：

```bash
npm test
```

运行格式化工具测试：

```bash
npm test -- formatting.test
```

## 许可证

MIT
