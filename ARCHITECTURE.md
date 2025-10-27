# 系统架构文档

本文档详细说明财务预算管理应用的整体架构设计、技术实现和设计决策。

## 目录

- [架构概览](#架构概览)
- [分层架构](#分层架构)
- [目录结构详解](#目录结构详解)
- [数据流和状态管理](#数据流和状态管理)
- [路由和导航设计](#路由和导航设计)
- [数据库设计](#数据库设计)
- [第三方库选型理由](#第三方库选型理由)
- [性能优化策略](#性能优化策略)
- [安全性设计](#安全性设计)
- [可扩展性设计](#可扩展性设计)

## 架构概览

### 整体架构

应用采用清晰的分层架构，遵循关注点分离原则：

```
┌──────────────────────────────────────────────────────┐
│                   展示层 (UI Layer)                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐     │
│  │  Screens   │  │ Components │  │Navigation  │     │
│  └────────────┘  └────────────┘  └────────────┘     │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│              状态管理层 (State Layer)                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐     │
│  │  Slices    │  │ Selectors  │  │  Thunks    │     │
│  └────────────┘  └────────────┘  └────────────┘     │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│                业务逻辑层 (Business Layer)            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐     │
│  │Repositories│  │  Services  │  │   Utils    │     │
│  └────────────┘  └────────────┘  └────────────┘     │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│             数据持久化层 (Data Layer)                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐     │
│  │  Database  │  │ Migrations │  │  Mappers   │     │
│  └────────────┘  └────────────┘  └────────────┘     │
└──────────────────────────────────────────────────────┘
```

### 设计原则

1. **单一职责原则**：每个模块只负责一个功能领域
2. **依赖倒置原则**：高层模块不依赖低层模块，都依赖抽象
3. **开放封闭原则**：对扩展开放，对修改封闭
4. **接口隔离原则**：使用小而专注的接口
5. **DRY 原则**：避免重复代码，提取共享逻辑

## 分层架构

### 1. 展示层（UI Layer）

**职责**：
- 渲染用户界面
- 处理用户交互
- 显示应用状态

**主要组件**：
- **Screens**：完整的页面组件
- **Components**：可复用的 UI 组件
- **Navigation**：路由和导航配置

**技术实现**：
```typescript
// 屏幕组件示例
const DashboardScreen: React.FC = () => {
  const dispatch = useDispatch();
  const totalBalance = useSelector(selectTotalBalance);
  
  useEffect(() => {
    dispatch(loadAccounts());
  }, [dispatch]);
  
  return (
    <ScreenContainer>
      <Header title={t('dashboard.title')} />
      <BalanceCard balance={totalBalance} />
    </ScreenContainer>
  );
};
```

### 2. 状态管理层（State Layer）

**职责**：
- 管理应用全局状态
- 处理异步操作
- 计算派生数据

**核心概念**：
- **Slices**：状态定义和 reducers
- **Selectors**：从 store 中提取和计算数据
- **Thunks**：异步操作的编排

**Redux Store 结构**：
```typescript
{
  accounts: AccountsState,      // 账户数据
  transactions: TransactionsState, // 交易数据
  budgets: BudgetsState,        // 预算数据
  categories: CategoriesState,  // 分类数据
  app: AppState                 // 应用全局状态
}
```

### 3. 业务逻辑层（Business Layer）

**职责**：
- 封装业务规则
- 数据验证和转换
- 与数据层交互

**主要模块**：
- **Repositories**：数据访问模式
- **Services**：业务服务
- **Utils**：工具函数

### 4. 数据持久化层（Data Layer）

**职责**：
- 管理数据库连接
- 执行 CRUD 操作
- 数据迁移管理

**技术实现**：
- SQLite 数据库
- 数据库迁移系统
- DTO 与领域模型映射

## 目录结构详解

```
src/
├── components/              # UI 组件
│   ├── common/             # 通用组件
│   │   ├── ErrorBoundary.tsx       # 错误边界
│   │   ├── LoadingSpinner.tsx      # 加载指示器
│   │   ├── ThemedStatusBar.tsx     # 主题状态栏
│   │   └── BudgetAlertProvider.tsx # 预算提醒
│   ├── shared/             # 共享 UI 组件
│   │   ├── buttons/        # 按钮组件
│   │   ├── forms/          # 表单组件
│   │   ├── layout/         # 布局组件
│   │   └── feedback/       # 反馈组件
│   └── charts/             # 图表组件
│       ├── PieChart.tsx
│       ├── BarChart.tsx
│       └── LineChart.tsx
│
├── screens/                # 屏幕组件
│   ├── dashboard/          # 面板
│   │   └── DashboardScreen.tsx
│   ├── accounts/           # 账户
│   │   ├── AccountsScreen.tsx
│   │   └── AccountDetailsScreen.tsx
│   ├── transactions/       # 交易
│   │   ├── TransactionsScreen.tsx
│   │   └── AddTransactionScreen.tsx
│   ├── budgets/            # 预算
│   │   ├── BudgetsScreen.tsx
│   │   └── AddBudgetScreen.tsx
│   ├── reports/            # 报表
│   │   └── ReportsScreen.tsx
│   ├── settings/           # 设置
│   │   ├── SettingsScreen.tsx
│   │   ├── CategoryManagementScreen.tsx
│   │   └── ExportScreen.tsx
│   └── auth/               # 认证
│       └── LoginScreen.tsx
│
├── store/                  # Redux 状态管理
│   ├── slices/             # Redux Slices
│   │   ├── accountsSlice.ts
│   │   ├── transactionsSlice.ts
│   │   ├── budgetsSlice.ts
│   │   ├── categoriesSlice.ts
│   │   └── appSlice.ts
│   ├── thunks/             # 异步操作
│   │   ├── accountThunks.ts
│   │   ├── transactionThunks.ts
│   │   ├── budgetThunks.ts
│   │   ├── categoryThunks.ts
│   │   └── initThunks.ts
│   ├── actions/            # Action 创建器
│   ├── selectors.ts        # 记忆化选择器
│   └── index.ts            # Store 配置
│
├── database/               # 数据库层
│   ├── database.ts         # 数据库初始化
│   ├── schema.ts           # 表结构定义
│   ├── migrations.ts       # 数据库迁移
│   ├── mappers.ts          # 数据映射器
│   ├── types.ts            # 数据库类型
│   └── seedData.ts         # 初始数据
│
├── repositories/           # 仓储层
│   ├── accountRepository.ts
│   ├── transactionRepository.ts
│   ├── categoryRepository.ts
│   ├── budgetRepository.ts
│   └── settingsRepository.ts
│
├── services/               # 业务服务
│   ├── exportService.ts    # 导出服务
│   └── calculationService.ts # 计算服务
│
├── utils/                  # 工具函数
│   ├── formatting.ts       # 格式化工具
│   ├── validation.ts       # 验证工具
│   └── form.ts             # 表单工具
│
├── types/                  # 类型定义
│   └── index.ts            # 全局类型
│
├── localization/           # 国际化
│   ├── i18n.ts             # i18n 配置
│   └── locales/            # 翻译文件
│       ├── en.json
│       ├── zh.json
│       ├── es.json
│       └── fr.json
│
├── theme/                  # 主题系统
│   ├── theme.ts            # 主题配置
│   ├── ThemeContext.tsx    # 主题上下文
│   └── index.ts
│
├── navigation/             # 导航配置
│   └── AppNavigator.tsx
│
├── hooks/                  # 自定义 Hooks
│   └── useBudgetAlert.ts
│
└── App.tsx                 # 应用根组件
```

## 数据流和状态管理

### Redux 数据流

```
┌──────────────┐
│  UI Component │
└───────┬──────┘
        │ dispatch(action)
        ▼
┌───────────────┐
│  Redux Store  │
└───────┬───────┘
        │ thunk
        ▼
┌────────────────┐
│  Repository    │
└───────┬────────┘
        │ CRUD
        ▼
┌────────────────┐
│  SQLite DB     │
└───────┬────────┘
        │ result
        ▼
┌────────────────┐
│  Reducer       │
└───────┬────────┘
        │ new state
        ▼
┌────────────────┐
│  Selector      │
└───────┬────────┘
        │ derived data
        ▼
┌──────────────┐
│  UI Update   │
└──────────────┘
```

### State 管理规范

#### Slices 设计

每个 slice 遵循统一的结构：

```typescript
interface EntityState<T> {
  items: T[];           // 实体数组
  loading: boolean;     // 加载状态
  error: string | null; // 错误信息
}

// 示例：accountsSlice
const accountsSlice = createSlice({
  name: 'accounts',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // 同步 actions
    setAccounts: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    // 异步 actions
    builder
      .addCase(loadAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '加载失败';
      });
  },
});
```

#### Selectors 设计

使用 reselect 创建记忆化选择器：

```typescript
// 基础选择器
const selectAccounts = (state: RootState) => state.accounts.items;

// 派生选择器（记忆化）
export const selectTotalBalance = createSelector(
  [selectAccounts],
  (accounts) => accounts.reduce((sum, acc) => sum + acc.balance, 0)
);

// 参数化选择器
export const selectAccountById = createSelector(
  [selectAccounts, (state: RootState, accountId: string) => accountId],
  (accounts, accountId) => accounts.find(acc => acc.id === accountId)
);
```

#### Thunks 设计

异步操作封装在 thunks 中：

```typescript
export const createAccount = createAsyncThunk(
  'accounts/create',
  async (account: Account, {rejectWithValue}) => {
    try {
      await accountRepository.create(account);
      return account;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

## 路由和导航设计

### 导航架构

```
Root Navigator (Stack)
├── Auth Stack (条件渲染)
│   └── Login Screen
│
└── Main App (Tab Navigator)
    ├── Dashboard Tab
    ├── Transactions Tab
    ├── Accounts Tab
    │   └── Account Details (Stack)
    ├── Budgets Tab
    │   └── Add Budget (Stack)
    ├── Reports Tab
    └── Settings Tab
        ├── Category Management (Stack)
        └── Export (Stack)
```

### 导航配置

```typescript
// AppNavigator.tsx
const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  return (
    <NavigationContainer theme={navigationTheme}>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

// 主导航器（Tab）
const MainNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Transactions" component={TransactionsStack} />
    <Tab.Screen name="Accounts" component={AccountsStack} />
    <Tab.Screen name="Budgets" component={BudgetsStack} />
    <Tab.Screen name="Reports" component={ReportsScreen} />
    <Tab.Screen name="Settings" component={SettingsStack} />
  </Tab.Navigator>
);
```

### 路由参数类型安全

```typescript
// 定义路由参数类型
type RootStackParamList = {
  Dashboard: undefined;
  Accounts: undefined;
  AccountDetails: {accountId: string};
  AddTransaction: {accountId?: string};
  Settings: undefined;
};

// 使用类型化导航
type AccountDetailsScreenProps = StackScreenProps<
  RootStackParamList,
  'AccountDetails'
>;

const AccountDetailsScreen: React.FC<AccountDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const {accountId} = route.params;
  // ...
};
```

## 数据库设计

### 表结构

#### accounts（账户表）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | TEXT | 账户ID | PRIMARY KEY |
| name | TEXT | 账户名称 | NOT NULL |
| type | TEXT | 账户类型 | NOT NULL |
| balance | REAL | 余额 | NOT NULL, DEFAULT 0 |
| currency | TEXT | 货币类型 | NOT NULL, DEFAULT 'USD' |
| createdAt | TEXT | 创建时间 | NOT NULL |
| updatedAt | TEXT | 更新时间 | NOT NULL |

**索引**：
- `idx_accounts_type` ON `type`

#### transactions（交易表）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | TEXT | 交易ID | PRIMARY KEY |
| accountId | TEXT | 账户ID | NOT NULL, FOREIGN KEY |
| amount | REAL | 金额 | NOT NULL |
| category | TEXT | 分类 | NOT NULL |
| description | TEXT | 描述 | |
| date | TEXT | 交易日期 | NOT NULL |
| type | TEXT | 类型（income/expense） | NOT NULL |
| memo | TEXT | 备注 | |
| transferId | TEXT | 转账ID | |
| relatedAccountId | TEXT | 关联账户ID | |

**索引**：
- `idx_transactions_account` ON `accountId`
- `idx_transactions_date` ON `date`
- `idx_transactions_type` ON `type`
- `idx_transactions_category` ON `category`

#### categories（分类表）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | TEXT | 分类ID | PRIMARY KEY |
| name | TEXT | 分类名称 | NOT NULL |
| icon | TEXT | 图标 | |
| color | TEXT | 颜色 | |
| type | TEXT | 类型（income/expense） | NOT NULL |
| isDefault | INTEGER | 是否默认 | NOT NULL, DEFAULT 0 |

**索引**：
- `idx_categories_type` ON `type`

#### budgets（预算表）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | TEXT | 预算ID | PRIMARY KEY |
| category | TEXT | 分类 | NOT NULL |
| budgetedAmount | REAL | 预算金额 | NOT NULL |
| spentAmount | REAL | 已用金额 | NOT NULL, DEFAULT 0 |
| period | TEXT | 周期 | NOT NULL |
| currency | TEXT | 货币类型 | NOT NULL, DEFAULT 'USD' |
| alertThreshold | REAL | 提醒阈值 | DEFAULT 0.8 |
| createdAt | TEXT | 创建时间 | NOT NULL |
| updatedAt | TEXT | 更新时间 | NOT NULL |

**索引**：
- `idx_budgets_category` ON `category`
- `idx_budgets_period` ON `period`

#### settings（设置表）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| key | TEXT | 设置键 | PRIMARY KEY |
| value | TEXT | 设置值 | NOT NULL |

#### transfers（转账表）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | TEXT | 转账ID | PRIMARY KEY |
| sourceAccountId | TEXT | 源账户ID | NOT NULL |
| destinationAccountId | TEXT | 目标账户ID | NOT NULL |
| amount | REAL | 金额 | NOT NULL |
| date | TEXT | 转账日期 | NOT NULL |
| memo | TEXT | 备注 | |
| createdAt | TEXT | 创建时间 | NOT NULL |

### 数据库迁移

使用版本化迁移系统：

```typescript
// migrations.ts
export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    up: async (db: SQLiteDatabase) => {
      // 创建初始表结构
      await db.executeSql(CREATE_ACCOUNTS_TABLE);
      await db.executeSql(CREATE_TRANSACTIONS_TABLE);
      // ... 其他表
    },
  },
  {
    version: 2,
    up: async (db: SQLiteDatabase) => {
      // 添加新字段或表
      await db.executeSql('ALTER TABLE accounts ADD COLUMN icon TEXT');
    },
  },
];
```

### DTO 与领域模型映射

```typescript
// 数据库 DTO
interface AccountDTO {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

// 领域模型
interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

// 映射器
export const mapAccountDtoToAccount = (dto: AccountDTO): Account => ({
  id: dto.id,
  name: dto.name,
  type: dto.type as AccountType,
  balance: dto.balance,
  currency: dto.currency,
  createdAt: new Date(dto.createdAt),
  updatedAt: new Date(dto.updatedAt),
});
```

## 第三方库选型理由

### 状态管理：Redux Toolkit

**选择理由**：
- 官方推荐的 Redux 最佳实践
- 内置 Immer，简化不可变更新
- 集成 Redux Thunk，处理异步逻辑
- 强大的 TypeScript 支持
- 减少样板代码

### 导航：React Navigation

**选择理由**：
- React Native 生态系统事实标准
- 原生体验的导航动画
- 灵活的配置和自定义
- 完整的 TypeScript 支持
- 社区活跃，文档完善

### 数据库：React Native SQLite Storage

**选择理由**：
- 成熟稳定的本地数据库方案
- 支持 iOS 和 Android
- 完整的 SQL 功能
- 良好的性能
- 支持事务

### 国际化：i18next

**选择理由**：
- 功能最完整的国际化库
- 强大的插件系统
- 支持多种格式
- 完善的 React 集成
- 自动语言检测

### 表单：React Hook Form

**选择理由**：
- 性能优异（最小化重渲染）
- API 简洁易用
- 与 Yup 完美集成
- TypeScript 友好
- 体积小

### 验证：Yup

**选择理由**：
- 声明式验证模式
- 丰富的验证规则
- 易于复用和组合
- 与 React Hook Form 完美配合
- TypeScript 类型推导

### 图表：Victory Native

**选择理由**：
- React Native 原生支持
- 声明式 API
- 高度可定制
- 支持动画
- 响应式设计

## 性能优化策略

### 1. 渲染优化

#### 组件记忆化
```typescript
// 使用 React.memo 避免不必要的重渲染
export const AccountCard = React.memo<AccountCardProps>(({account}) => {
  return <Card>{/* ... */}</Card>;
});
```

#### 选择器记忆化
```typescript
// 使用 reselect 缓存计算结果
export const selectExpensesByCategory = createSelector(
  [selectTransactions],
  (transactions) => {
    // 昂贵的计算只在 transactions 变化时执行
    return calculateExpensesByCategory(transactions);
  }
);
```

### 2. 列表优化

#### 虚拟列表
```typescript
// 使用 FlatList 的优化 props
<FlatList
  data={transactions}
  renderItem={renderTransaction}
  keyExtractor={item => item.id}
  windowSize={10}              // 渲染窗口大小
  maxToRenderPerBatch={10}     // 每批渲染数量
  updateCellsBatchingPeriod={50} // 批处理周期
  removeClippedSubviews={true}  // 移除屏幕外视图
  getItemLayout={getItemLayout} // 固定高度优化
/>
```

### 3. 图片优化

```typescript
// 使用合适的图片格式和尺寸
<Image
  source={require('./icon.png')}
  resizeMode="contain"
  style={{width: 24, height: 24}}
/>
```

### 4. 数据库优化

#### 索引优化
- 为常用查询字段添加索引
- 复合索引优化多条件查询

#### 批量操作
```typescript
// 使用事务批量插入
await db.transaction(async (tx) => {
  for (const item of items) {
    await tx.executeSql(INSERT_SQL, [item.id, item.name]);
  }
});
```

### 5. Bundle 优化

#### 代码分割
```typescript
// 懒加载非关键模块
const ReportsScreen = React.lazy(() => import('./screens/ReportsScreen'));
```

#### 资源优化
- 压缩图片资源
- 移除未使用的依赖
- 启用 Hermes 引擎

## 安全性设计

### 1. 数据安全

- **本地数据加密**：敏感数据使用加密存储
- **SQL 注入防护**：使用参数化查询
- **输入验证**：前端和业务层双重验证

### 2. 认证授权

```typescript
// 认证状态管理
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
  },
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});
```

### 3. 错误处理

```typescript
// 全局错误边界
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误
    logError(error, errorInfo);
    // 显示友好错误页面
    this.setState({hasError: true});
  }
}
```

## 可扩展性设计

### 1. 插件化架构

支持通过插件扩展功能：

```typescript
// 插件接口
interface Plugin {
  name: string;
  initialize: () => void;
  onAccountCreated?: (account: Account) => void;
  onTransactionCreated?: (transaction: Transaction) => void;
}
```

### 2. 主题扩展

支持自定义主题：

```typescript
// 扩展主题
const customTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#FF6B6B',
  },
};
```

### 3. 国际化扩展

易于添加新语言：

```typescript
// 添加新语言只需添加翻译文件
resources: {
  de: {translation: require('./locales/de.json')},
}
```

### 4. 数据源扩展

支持多种数据源：

```typescript
// 数据源接口
interface DataSource {
  loadAccounts: () => Promise<Account[]>;
  saveAccount: (account: Account) => Promise<void>;
}

// 实现不同的数据源
class SQLiteDataSource implements DataSource { /* ... */ }
class CloudDataSource implements DataSource { /* ... */ }
```

## 总结

本架构设计遵循以下核心原则：

1. **清晰的分层**：每层职责明确，依赖关系清晰
2. **类型安全**：全面使用 TypeScript，减少运行时错误
3. **高性能**：多种优化策略确保流畅体验
4. **可维护**：模块化设计，易于理解和修改
5. **可扩展**：灵活的架构支持功能扩展
6. **可测试**：松耦合设计便于单元测试

这种架构设计确保应用在当前功能完善的同时，也为未来的功能扩展和性能优化提供了坚实的基础。
