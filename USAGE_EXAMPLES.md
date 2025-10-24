# 组件库使用示例

## 快速开始

### 1. 设置主题提供者

在应用的根组件中包裹 `ThemeProvider`：

```typescript
import React from 'react';
import {ThemeProvider} from '@/theme';
import App from './App';

export default function Root() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
```

### 2. 使用共享组件

```typescript
import React, {useState} from 'react';
import {View} from 'react-native';
import {
  PrimaryButton,
  TextInputField,
  SelectPicker,
  AmountInput,
  Card,
} from '@/components/shared';
import {useTheme} from '@/theme';

function MyForm() {
  const {theme} = useTheme();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const categories = [
    {label: '食品', value: 'food'},
    {label: '交通', value: 'transport'},
    {label: '娱乐', value: 'entertainment'},
  ];

  const handleSubmit = async () => {
    setLoading(true);
    // 提交逻辑...
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Card padding="lg">
      <TextInputField
        label="名称"
        value={name}
        onChangeText={setName}
        placeholder="请输入名称"
        required
      />

      <SelectPicker
        label="类别"
        value={category}
        options={categories}
        onChange={setCategory}
        required
      />

      <AmountInput
        label="金额"
        value={amount}
        onChange={setAmount}
        currency="$"
        required
      />

      <PrimaryButton
        title="提交"
        onPress={handleSubmit}
        loading={loading}
        fullWidth
      />
    </Card>
  );
}
```

### 3. 使用图表组件

```typescript
import React from 'react';
import {ScrollView} from 'react-native';
import {PieChart, BarChart, LineChart} from '@/components/charts';

function MyCharts() {
  const pieData = [
    {x: '食品', y: 350},
    {x: '交通', y: 200},
    {x: '娱乐', y: 150},
  ];

  const barData = [
    {x: '周一', y: 120},
    {x: '周二', y: 200},
    {x: '周三', y: 150},
  ];

  const lineData = [
    {x: '1月', y: 1000},
    {x: '2月', y: 1500},
    {x: '3月', y: 1200},
  ];

  return (
    <ScrollView>
      <PieChart
        data={pieData}
        title="支出分类"
        height={300}
      />

      <BarChart
        data={barData}
        title="每日支出"
        height={300}
      />

      <LineChart
        data={lineData}
        title="月度趋势"
        height={300}
        curved
        showPoints
      />
    </ScrollView>
  );
}
```

### 4. 使用格式化工具

```typescript
import {
  formatCurrency,
  formatDate,
  formatPercentage,
  calculatePercentage,
} from '@/utils/formatting';

function MyComponent() {
  const amount = 1234.56;
  const date = new Date();
  const spent = 750;
  const budget = 1000;

  return (
    <View>
      <Text>金额：{formatCurrency(amount, 'USD')}</Text>
      <Text>日期：{formatDate(date)}</Text>
      <Text>
        使用：{formatPercentage(calculatePercentage(spent, budget))}
      </Text>
    </View>
  );
}
```

### 5. 使用表单验证

```typescript
import React from 'react';
import {useForm, Controller} from 'react-hook-form';
import {
  TextInputField,
  AmountInput,
  PrimaryButton,
} from '@/components/shared';
import {
  schemas,
  createFormResolver,
  getFieldError,
} from '@/utils/form';

interface TransactionForm {
  description: string;
  amount: number;
  category: string;
}

function TransactionForm() {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<TransactionForm>({
    resolver: createFormResolver(schemas.transaction),
    defaultValues: {
      description: '',
      amount: 0,
      category: '',
    },
  });

  const onSubmit = (data: TransactionForm) => {
    console.log('提交数据：', data);
  };

  return (
    <View>
      <Controller
        control={control}
        name="description"
        render={({field: {onChange, onBlur, value}}) => (
          <TextInputField
            label="描述"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={getFieldError(errors.description)}
          />
        )}
      />

      <Controller
        control={control}
        name="amount"
        render={({field: {onChange, value}}) => (
          <AmountInput
            label="金额"
            value={value}
            onChange={onChange}
            error={getFieldError(errors.amount)}
          />
        )}
      />

      <PrimaryButton
        title="保存"
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
}
```

### 6. 响应主题变化

```typescript
import React from 'react';
import {View, Text} from 'react-native';
import {useTheme} from '@/theme';

function ThemedComponent() {
  const {theme} = useTheme();

  return (
    <View style={{backgroundColor: theme.colors.background}}>
      <Text style={{
        color: theme.colors.textPrimary,
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.semiBold,
      }}>
        主题化文本
      </Text>
    </View>
  );
}
```

### 7. 显示空状态

```typescript
import React from 'react';
import {EmptyState} from '@/components/shared';

function MyList({items, onAdd}) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon="inbox"
        title="暂无数据"
        description="还没有任何记录，点击下方按钮添加"
        actionLabel="添加记录"
        onAction={onAdd}
      />
    );
  }

  return (
    // 渲染列表...
  );
}
```

### 8. 显示加载状态

```typescript
import React, {useState} from 'react';
import {View} from 'react-native';
import {LoadingOverlay, PrimaryButton} from '@/components/shared';

function MyComponent() {
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    try {
      // 执行异步操作...
      await someAsyncOperation();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <PrimaryButton
        title="执行操作"
        onPress={handleAction}
      />

      <LoadingOverlay
        visible={loading}
        message="处理中，请稍候..."
      />
    </View>
  );
}
```

### 9. 使用芯片组件

```typescript
import React, {useState} from 'react';
import {View} from 'react-native';
import {Chip} from '@/components/shared';

function FilterChips() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleChip = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  return (
    <View style={{flexDirection: 'row', gap: 8}}>
      <Chip
        label="全部"
        selected={selected.has('all')}
        onPress={() => toggleChip('all')}
      />
      <Chip
        label="食品"
        icon="restaurant"
        selected={selected.has('food')}
        onPress={() => toggleChip('food')}
      />
      <Chip
        label="交通"
        icon="directions-car"
        selected={selected.has('transport')}
        onPress={() => toggleChip('transport')}
      />
    </View>
  );
}
```

### 10. 使用进度条

```typescript
import React from 'react';
import {View} from 'react-native';
import {ProgressBar, Card} from '@/components/shared';

function BudgetProgress({spent, total}) {
  return (
    <Card>
      <ProgressBar
        progress={spent}
        total={total}
        label="预算使用"
        showPercentage
        animated
      />
    </Card>
  );
}
```

## 完整示例

查看 `/src/screens/ComponentPlaygroundScreen.tsx` 获取所有组件的完整示例。

要查看演练场，在应用中导航到 ComponentPlayground 屏幕。
