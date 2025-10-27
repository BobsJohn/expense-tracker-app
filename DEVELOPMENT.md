# 开发规范文档

本文档规定项目的代码风格、开发规范、命名约定和最佳实践，确保代码库的一致性和可维护性。

## 目录

- [代码风格指南](#代码风格指南)
- [TypeScript 规范](#typescript-规范)
- [组件开发规范](#组件开发规范)
- [命名规范](#命名规范)
- [Git 提交规范](#git-提交规范)
- [测试规范](#测试规范)
- [代码审查清单](#代码审查清单)
- [性能最佳实践](#性能最佳实践)
- [安全最佳实践](#安全最佳实践)

## 代码风格指南

### Prettier 配置

项目使用 Prettier 进行代码格式化，配置如下：

```javascript
// .prettierrc.js
module.exports = {
  arrowParens: 'avoid',           // 箭头函数参数省略括号
  bracketSameLine: true,          // JSX 标签闭合符号同行
  bracketSpacing: false,          // 对象花括号内无空格
  singleQuote: true,              // 使用单引号
  trailingComma: 'all',           // 所有可能的地方添加尾逗号
  tabWidth: 2,                    // 缩进 2 空格
  semi: true,                     // 语句末尾加分号
  printWidth: 100,                // 每行最大 100 字符
};
```

### ESLint 配置

项目使用 ESLint 进行代码质量检查：

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  extends: ['@react-native'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'error',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
    'react-hooks/exhaustive-deps': 'warn',
  },
};
```

### 代码格式化命令

```bash
# 格式化所有代码
npm run format

# 检查代码风格
npm run lint

# 自动修复可修复的问题
npm run lint -- --fix
```

## TypeScript 规范

### 类型定义

#### 1. 优先使用接口（Interface）

✅ 推荐：
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}
```

❌ 避免（简单对象）：
```typescript
type User = {
  id: string;
  name: string;
  email: string;
};
```

**例外**：使用 `type` 定义联合类型、交叉类型或工具类型：
```typescript
type Status = 'pending' | 'approved' | 'rejected';
type UserWithTimestamps = User & Timestamps;
```

#### 2. 显式类型注解

✅ 推荐：
```typescript
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};
```

❌ 避免：
```typescript
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};
```

#### 3. 避免使用 any

✅ 推荐：
```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
}

const fetchData = async <T>(): Promise<ApiResponse<T>> => {
  // ...
};
```

❌ 避免：
```typescript
const fetchData = async (): Promise<any> => {
  // ...
};
```

#### 4. 使用枚举或联合类型

✅ 推荐：
```typescript
type TransactionType = 'income' | 'expense';

// 或使用枚举
enum TransactionType {
  Income = 'income',
  Expense = 'expense',
}
```

❌ 避免：
```typescript
const type = 'income'; // 字符串字面量，无类型检查
```

#### 5. 非空断言谨慎使用

✅ 推荐：
```typescript
const account = accounts.find(a => a.id === id);
if (account) {
  processAccount(account);
}
```

❌ 避免（除非确定不为 null）：
```typescript
const account = accounts.find(a => a.id === id)!;
processAccount(account);
```

### 类型导出

所有公共类型应在 `src/types/index.ts` 中集中导出：

```typescript
// src/types/index.ts
export interface Account {
  id: string;
  name: string;
  balance: number;
}

export type AccountType = 'checking' | 'savings' | 'credit' | 'investment';
```

使用时从统一入口导入：

```typescript
import { Account, AccountType } from '@/types';
```

## 组件开发规范

### 函数组件

#### 1. 使用函数组件和 Hooks

✅ 推荐：
```typescript
import React, { useState, useEffect } from 'react';

interface Props {
  accountId: string;
  onUpdate?: (account: Account) => void;
}

const AccountCard: React.FC<Props> = ({ accountId, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadAccount();
  }, [accountId]);
  
  return (
    <View>
      {/* ... */}
    </View>
  );
};

export default AccountCard;
```

#### 2. Props 接口命名

Props 接口应命名为 `{ComponentName}Props`：

```typescript
interface AccountCardProps {
  account: Account;
  onPress?: () => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onPress }) => {
  // ...
};
```

#### 3. 默认 Props

使用参数默认值而非 defaultProps：

✅ 推荐：
```typescript
interface Props {
  title: string;
  showIcon?: boolean;
}

const Header: React.FC<Props> = ({ 
  title, 
  showIcon = true 
}) => {
  // ...
};
```

❌ 避免：
```typescript
Header.defaultProps = {
  showIcon: true,
};
```

#### 4. 组件记忆化

对于纯组件使用 React.memo：

```typescript
const AccountCard = React.memo<AccountCardProps>(({ account }) => {
  return (
    <Card>
      <Text>{account.name}</Text>
      <Text>{account.balance}</Text>
    </Card>
  );
});

AccountCard.displayName = 'AccountCard';

export default AccountCard;
```

#### 5. Hooks 顺序

Hooks 调用应遵循以下顺序：

1. useState
2. useReducer
3. useContext
4. useRef
5. useCallback
6. useMemo
7. useEffect
8. 自定义 Hooks

```typescript
const MyComponent: React.FC = () => {
  // 1. State
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  // 2. Context
  const theme = useContext(ThemeContext);
  
  // 3. Refs
  const inputRef = useRef<TextInput>(null);
  
  // 4. Callbacks
  const handlePress = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  // 5. Memos
  const expensiveValue = useMemo(() => {
    return computeExpensiveValue(count);
  }, [count]);
  
  // 6. Effects
  useEffect(() => {
    loadData();
  }, []);
  
  // 7. 自定义 Hooks
  const { data, loading } = useData();
  
  return <View>{/* ... */}</View>;
};
```

### 样式规范

#### 1. 使用 StyleSheet

✅ 推荐：
```typescript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

// 使用
<View style={styles.container}>
  <Text style={styles.title}>Title</Text>
</View>
```

❌ 避免内联样式：
```typescript
<View style={{flex: 1, padding: 16}}>
  <Text style={{fontSize: 18, fontWeight: 'bold'}}>Title</Text>
</View>
```

#### 2. 使用主题系统

从主题获取颜色和尺寸：

```typescript
import { useTheme } from '@/theme';

const MyComponent = () => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={{color: theme.colors.textPrimary}}>
        Hello
      </Text>
    </View>
  );
};
```

#### 3. 样式组合

```typescript
<View style={[styles.base, styles.primary, customStyle]} />
```

### 无障碍访问

为所有交互元素添加无障碍属性：

```typescript
<TouchableOpacity
  accessibilityLabel="删除账户"
  accessibilityRole="button"
  accessibilityHint="点击删除此账户"
  onPress={handleDelete}>
  <Icon name="delete" />
</TouchableOpacity>
```

## 命名规范

### 文件命名

#### 组件文件
使用 PascalCase（大驼峰）：
```
AccountCard.tsx
TransactionList.tsx
DashboardScreen.tsx
```

#### 工具文件
使用 camelCase（小驼峰）：
```
formatting.ts
validation.ts
dateUtils.ts
```

#### 类型文件
使用 camelCase，以 `.types.ts` 结尾：
```
account.types.ts
transaction.types.ts
```

或统一在 `types/index.ts` 中定义。

### 变量命名

#### 常量
使用 UPPER_SNAKE_CASE：
```typescript
const MAX_TRANSACTION_AMOUNT = 10000;
const DEFAULT_CURRENCY = 'USD';
const API_BASE_URL = 'https://api.example.com';
```

#### 变量和函数
使用 camelCase：
```typescript
const userName = 'John';
const totalBalance = 1000;

function calculateTotal(items: Item[]): number {
  // ...
}

const handleSubmit = () => {
  // ...
};
```

#### 布尔值
使用 is/has/should 前缀：
```typescript
const isLoading = true;
const hasError = false;
const shouldRender = true;
const canEdit = false;
```

#### 事件处理器
使用 handle 前缀：
```typescript
const handlePress = () => {};
const handleChange = (value: string) => {};
const handleSubmit = async () => {};
```

### 组件命名

#### React 组件
使用 PascalCase：
```typescript
const AccountCard: React.FC = () => {};
const TransactionList: React.FC = () => {};
```

#### 高阶组件
使用 with 前缀：
```typescript
const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  // ...
};
```

#### 自定义 Hooks
使用 use 前缀：
```typescript
const useAccount = (accountId: string) => {
  // ...
};

const useBudgetAlert = () => {
  // ...
};
```

### Redux 命名

#### Slice
使用小驼峰 + Slice 后缀：
```typescript
const accountsSlice = createSlice({
  name: 'accounts',
  // ...
});
```

#### Actions
使用动词开头，描述性命名：
```typescript
setAccounts
addAccount
updateAccount
removeAccount
loadAccounts
createAccount
```

#### Selectors
使用 select 前缀：
```typescript
selectAccounts
selectAccountById
selectTotalBalance
```

#### Thunks
使用动词开头，描述异步操作：
```typescript
loadAccounts
createAccount
updateAccount
deleteAccount
```

## Git 提交规范

### 提交信息格式

使用语义化提交信息（Conventional Commits）：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- **feat**: 新功能
- **fix**: 修复 bug
- **docs**: 文档更新
- **style**: 代码格式调整（不影响代码运行）
- **refactor**: 重构代码
- **perf**: 性能优化
- **test**: 测试相关
- **chore**: 构建过程或辅助工具的变动
- **ci**: CI 配置文件和脚本的变动
- **revert**: 回滚之前的提交

### 示例

```bash
# 添加新功能
git commit -m "feat(accounts): 添加账户余额显示功能"

# 修复 bug
git commit -m "fix(transactions): 修复交易日期排序错误"

# 文档更新
git commit -m "docs(readme): 更新安装说明"

# 重构
git commit -m "refactor(store): 重构 Redux selectors 使用 reselect"

# 性能优化
git commit -m "perf(list): 优化交易列表渲染性能"

# 多行提交信息
git commit -m "feat(budgets): 添加预算提醒功能

- 实现预算阈值检查
- 添加本地通知
- 更新预算屏幕 UI

Closes #123"
```

### 分支命名

```bash
# 功能分支
feature/account-management
feature/budget-alerts

# Bug 修复
fix/transaction-sorting
fix/balance-calculation

# 热修复
hotfix/critical-crash

# 发布分支
release/v1.0.0
```

## 测试规范

### 测试文件组织

测试文件应与源文件同目录，使用 `.test.ts` 或 `.test.tsx` 后缀：

```
src/
  components/
    AccountCard.tsx
    AccountCard.test.tsx
  utils/
    formatting.ts
    formatting.test.ts
```

### 测试结构

使用 describe 和 it 组织测试：

```typescript
describe('AccountCard', () => {
  describe('渲染', () => {
    it('应该显示账户名称', () => {
      // ...
    });
    
    it('应该显示账户余额', () => {
      // ...
    });
  });
  
  describe('交互', () => {
    it('点击时应该调用 onPress', () => {
      // ...
    });
  });
});
```

### 测试命名

使用描述性的测试名称，说明测试的行为：

✅ 推荐：
```typescript
it('当余额为负数时应该显示红色', () => {});
it('应该在加载时显示加载指示器', () => {});
it('验证失败时应该显示错误消息', () => {});
```

❌ 避免：
```typescript
it('测试 1', () => {});
it('正常工作', () => {});
```

### AAA 模式

遵循 Arrange-Act-Assert 模式：

```typescript
it('应该计算正确的总余额', () => {
  // Arrange - 准备测试数据
  const accounts = [
    { id: '1', balance: 100 },
    { id: '2', balance: 200 },
  ];
  
  // Act - 执行操作
  const total = calculateTotalBalance(accounts);
  
  // Assert - 断言结果
  expect(total).toBe(300);
});
```

### Mock 和 Stub

适当使用 mock 隔离测试：

```typescript
import { accountRepository } from '@/repositories';

jest.mock('@/repositories');

describe('loadAccounts', () => {
  it('应该从仓储加载账户', async () => {
    // Mock
    const mockAccounts = [{ id: '1', name: 'Test' }];
    (accountRepository.findAll as jest.Mock).mockResolvedValue(mockAccounts);
    
    // Test
    const result = await loadAccounts();
    
    // Assert
    expect(accountRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockAccounts);
  });
});
```

### 测试覆盖率

目标覆盖率：
- **工具函数**: ≥ 90%
- **Selectors**: ≥ 90%
- **组件**: ≥ 80%
- **Store 操作**: ≥ 70%

运行覆盖率报告：
```bash
npm run test:coverage
```

## 代码审查清单

### 功能性

- [ ] 功能符合需求规格
- [ ] 边界情况已处理
- [ ] 错误处理完善
- [ ] 用户体验流畅

### 代码质量

- [ ] 代码清晰易读
- [ ] 无重复代码
- [ ] 函数职责单一
- [ ] 适当的注释（复杂逻辑）
- [ ] 无调试代码（console.log 等）

### TypeScript

- [ ] 所有类型明确定义
- [ ] 无 any 类型（除非必要）
- [ ] 接口/类型正确使用
- [ ] 泛型使用恰当

### React/React Native

- [ ] 组件拆分合理
- [ ] Props 类型定义
- [ ] 使用正确的 Hooks
- [ ] 避免不必要的重渲染
- [ ] 无内联样式（除非必要）

### 性能

- [ ] 列表使用虚拟化
- [ ] 组件适当记忆化
- [ ] 选择器使用 reselect
- [ ] 避免昂贵的计算
- [ ] 图片优化

### 安全

- [ ] 用户输入已验证
- [ ] 敏感数据已加密
- [ ] SQL 查询使用参数化
- [ ] 无硬编码敏感信息

### 测试

- [ ] 单元测试覆盖关键逻辑
- [ ] 测试用例完整
- [ ] 所有测试通过
- [ ] 边界情况已测试

### 文档

- [ ] 代码注释适当
- [ ] README 已更新
- [ ] API 文档已更新
- [ ] CHANGELOG 已更新

### 无障碍

- [ ] 交互元素有 accessibilityLabel
- [ ] 正确的 accessibilityRole
- [ ] 支持屏幕阅读器
- [ ] 颜色对比度充足

## 性能最佳实践

### 1. 列表优化

```typescript
// 使用 FlatList 优化属性
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={item => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={10}
  getItemLayout={getItemLayout}  // 固定高度时使用
/>
```

### 2. 组件优化

```typescript
// 使用 React.memo
const ExpensiveComponent = React.memo<Props>(({ data }) => {
  return <View>{/* ... */}</View>;
}, (prevProps, nextProps) => {
  // 自定义比较函数
  return prevProps.data.id === nextProps.data.id;
});

// 使用 useCallback
const handlePress = useCallback(() => {
  doSomething(id);
}, [id]);

// 使用 useMemo
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.date.localeCompare(b.date));
}, [items]);
```

### 3. 图片优化

```typescript
// 使用合适的尺寸
<Image
  source={require('./icon.png')}
  style={{width: 24, height: 24}}
  resizeMode="contain"
/>

// 使用 FastImage（可选）
<FastImage
  source={{uri: imageUrl}}
  style={{width: 100, height: 100}}
  resizeMode={FastImage.resizeMode.cover}
/>
```

### 4. 避免匿名函数

❌ 避免：
```typescript
<Button onPress={() => handlePress(id)} />
```

✅ 推荐：
```typescript
const handlePressCallback = useCallback(() => {
  handlePress(id);
}, [id]);

<Button onPress={handlePressCallback} />
```

## 安全最佳实践

### 1. 输入验证

```typescript
// 使用 Yup 验证
const schema = yup.object({
  amount: yup.number()
    .required('金额必填')
    .positive('金额必须大于 0')
    .max(1000000, '金额不能超过 1,000,000'),
  email: yup.string()
    .email('邮箱格式不正确')
    .required('邮箱必填'),
});
```

### 2. 敏感数据

```typescript
// 避免在代码中硬编码敏感信息
// ❌ 避免
const API_KEY = 'sk_live_abc123xyz';

// ✅ 推荐：使用环境变量
import Config from 'react-native-config';
const API_KEY = Config.API_KEY;
```

### 3. SQL 注入防护

```typescript
// ✅ 使用参数化查询
await db.executeSql(
  'SELECT * FROM accounts WHERE id = ?',
  [accountId]
);

// ❌ 避免字符串拼接
await db.executeSql(
  `SELECT * FROM accounts WHERE id = '${accountId}'`
);
```

### 4. 数据加密

```typescript
// 敏感数据加密存储
import { encrypt, decrypt } from '@/utils/crypto';

const encryptedPassword = await encrypt(password);
await storage.setItem('password', encryptedPassword);

const decryptedPassword = await decrypt(encryptedPassword);
```

## 总结

遵循本开发规范可以确保：

1. **代码一致性**：统一的代码风格和命名约定
2. **可维护性**：清晰的代码结构和文档
3. **类型安全**：充分利用 TypeScript 类型系统
4. **高质量**：完善的测试和代码审查
5. **高性能**：优化的组件和数据处理
6. **安全性**：输入验证和数据保护

持续改进和学习是保持代码质量的关键。定期回顾和更新开发规范，确保团队始终遵循最佳实践。
