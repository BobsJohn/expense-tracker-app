# API 文档

本文档详细说明应用中的 Redux Actions、Reducers、Selectors 和 Services 的使用方法。

## 目录

- [Redux Store 结构](#redux-store-结构)
- [Actions 和 Reducers](#actions-和-reducers)
- [Selectors（选择器）](#selectors选择器)
- [Thunks（异步操作）](#thunks异步操作)
- [Services（业务服务）](#services业务服务)
- [Repositories（数据仓储）](#repositories数据仓储)
- [工具函数](#工具函数)

## Redux Store 结构

### 全局 State 结构

```typescript
interface RootState {
  accounts: AccountsState;
  transactions: TransactionsState;
  budgets: BudgetsState;
  categories: CategoriesState;
  app: AppState;
}
```

### Accounts State

```typescript
interface AccountsState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
}

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Transactions State

```typescript
interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  memo?: string;
  transferId?: string;
  relatedAccountId?: string;
}
```

### Budgets State

```typescript
interface BudgetsState {
  budgets: Budget[];
  loading: boolean;
  error: string | null;
}

interface Budget {
  id: string;
  category: string;
  budgetedAmount: number;
  spentAmount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  currency: string;
  alertThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Categories State

```typescript
interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  type: 'income' | 'expense';
  isDefault: boolean;
}
```

### App State

```typescript
interface AppState {
  isInitialized: boolean;
  theme: 'light' | 'dark';
  language: 'en' | 'zh' | 'es' | 'fr';
}
```

## Actions 和 Reducers

### Accounts Slice

#### Actions

```typescript
// 同步 actions
accountsSlice.actions.setAccounts(accounts: Account[]): void
accountsSlice.actions.addAccount(account: Account): void
accountsSlice.actions.updateAccount(account: Account): void
accountsSlice.actions.removeAccount(accountId: string): void
accountsSlice.actions.updateAccountBalance(payload: {id: string, balance: number}): void
```

#### 使用示例

```typescript
import { useDispatch } from 'react-redux';
import { accountsSlice } from '@/store/slices/accountsSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  
  const handleUpdateBalance = (accountId: string, newBalance: number) => {
    dispatch(accountsSlice.actions.updateAccountBalance({
      id: accountId,
      balance: newBalance
    }));
  };
};
```

### Transactions Slice

#### Actions

```typescript
// 同步 actions
transactionsSlice.actions.setTransactions(transactions: Transaction[]): void
transactionsSlice.actions.addTransaction(transaction: Transaction): void
transactionsSlice.actions.updateTransaction(transaction: Transaction): void
transactionsSlice.actions.removeTransaction(transactionId: string): void
```

#### 使用示例

```typescript
import { transactionsSlice } from '@/store/slices/transactionsSlice';

dispatch(transactionsSlice.actions.addTransaction({
  id: '123',
  accountId: 'acc-1',
  amount: -50.00,
  category: 'Food',
  description: 'Groceries',
  date: new Date().toISOString(),
  type: 'expense'
}));
```

### Budgets Slice

#### Actions

```typescript
// 同步 actions
budgetsSlice.actions.setBudgets(budgets: Budget[]): void
budgetsSlice.actions.addBudget(budget: Budget): void
budgetsSlice.actions.updateBudget(budget: Budget): void
budgetsSlice.actions.removeBudget(budgetId: string): void
budgetsSlice.actions.updateBudgetSpent(payload: {id: string, spentAmount: number}): void
```

#### 使用示例

```typescript
import { budgetsSlice } from '@/store/slices/budgetsSlice';

dispatch(budgetsSlice.actions.addBudget({
  id: '123',
  category: 'Food',
  budgetedAmount: 500,
  spentAmount: 0,
  period: 'monthly',
  currency: 'USD',
  alertThreshold: 0.8,
  createdAt: new Date(),
  updatedAt: new Date()
}));
```

### Categories Slice

#### Actions

```typescript
// 同步 actions
categoriesSlice.actions.setCategories(categories: Category[]): void
categoriesSlice.actions.addCategory(category: Category): void
categoriesSlice.actions.updateCategory(category: Category): void
categoriesSlice.actions.removeCategory(categoryId: string): void
```

### App Slice

#### Actions

```typescript
// 应用状态 actions
appSlice.actions.setInitialized(initialized: boolean): void
appSlice.actions.setTheme(theme: 'light' | 'dark'): void
appSlice.actions.setLanguage(language: 'en' | 'zh' | 'es' | 'fr'): void
```

## Selectors（选择器）

### 基础选择器

```typescript
// 获取所有账户
selectAccounts(state: RootState): Account[]

// 获取所有交易
selectTransactions(state: RootState): Transaction[]

// 获取所有预算
selectBudgets(state: RootState): Budget[]

// 获取所有分类
selectCategories(state: RootState): Category[]
```

### 账户相关选择器

#### selectAccountById
根据 ID 获取账户

```typescript
selectAccountById(state: RootState, accountId: string): Account | undefined
```

**使用示例**：
```typescript
import { useSelector } from 'react-redux';
import { selectAccountById } from '@/store/selectors';

const account = useSelector((state) => 
  selectAccountById(state, 'account-id-123')
);
```

#### selectTotalBalance
计算所有账户总余额

```typescript
selectTotalBalance(state: RootState): number
```

**使用示例**：
```typescript
const totalBalance = useSelector(selectTotalBalance);
// 返回：5420.50
```

#### selectAccountsByType
按类型分组账户

```typescript
selectAccountsByType(state: RootState): Record<string, Account[]>
```

**返回示例**：
```typescript
{
  checking: [Account, Account],
  savings: [Account],
  credit: [Account]
}
```

### 交易相关选择器

#### selectTransactionsByAccount
获取指定账户的所有交易（按日期降序）

```typescript
selectTransactionsByAccount(
  state: RootState, 
  accountId: string
): Transaction[]
```

**使用示例**：
```typescript
const transactions = useSelector((state) => 
  selectTransactionsByAccount(state, accountId)
);
```

#### selectRecentTransactions
获取最近 10 条交易

```typescript
selectRecentTransactions(state: RootState): Transaction[]
```

#### selectTransactionsByCategory
按分类分组交易

```typescript
selectTransactionsByCategory(state: RootState): Record<string, Transaction[]>
```

#### selectTransactionsByDateRange
获取日期范围内的交易

```typescript
selectTransactionsByDateRange(
  state: RootState,
  startDate: Date,
  endDate: Date
): Transaction[]
```

**使用示例**：
```typescript
const lastMonthTransactions = useSelector((state) => 
  selectTransactionsByDateRange(
    state,
    new Date('2024-01-01'),
    new Date('2024-01-31')
  )
);
```

### 财务统计选择器

#### selectTotalIncome
计算总收入

```typescript
selectTotalIncome(state: RootState): number
```

#### selectTotalExpenses
计算总支出

```typescript
selectTotalExpenses(state: RootState): number
```

#### selectNetIncome
计算净收入（收入 - 支出）

```typescript
selectNetIncome(state: RootState): number
```

#### selectExpensesByCategory
按分类统计支出

```typescript
selectExpensesByCategory(state: RootState): Record<string, number>
```

**返回示例**：
```typescript
{
  Food: 450.00,
  Transport: 200.00,
  Entertainment: 150.00
}
```

#### selectIncomeByCategory
按分类统计收入

```typescript
selectIncomeByCategory(state: RootState): Record<string, number>
```

### 预算相关选择器

#### selectBudgetById
根据 ID 获取预算

```typescript
selectBudgetById(state: RootState, budgetId: string): Budget | undefined
```

#### selectBudgetProgress
计算预算使用进度

```typescript
selectBudgetProgress(state: RootState): Array<{
  budget: Budget;
  percentage: number;
  remaining: number;
}>
```

**返回示例**：
```typescript
[
  {
    budget: Budget,
    percentage: 75,      // 已使用 75%
    remaining: 125.00    // 剩余 125
  }
]
```

#### selectOverBudgetCategories
获取超预算的分类

```typescript
selectOverBudgetCategories(state: RootState): Budget[]
```

#### selectNearLimitBudgets
获取接近预算限额的预算（超过阈值）

```typescript
selectNearLimitBudgets(state: RootState): Budget[]
```

### 分类相关选择器

#### selectCategoriesByType
按类型分组分类

```typescript
selectCategoriesByType(state: RootState): {
  income: Category[];
  expense: Category[];
}
```

#### selectCategoryById
根据 ID 获取分类

```typescript
selectCategoryById(state: RootState, categoryId: string): Category | undefined
```

### 报表选择器

#### selectMonthlyReport
生成月度报表

```typescript
selectMonthlyReport(state: RootState, year: number, month: number): {
  income: number;
  expenses: number;
  net: number;
  byCategory: Record<string, number>;
}
```

#### selectYearlyReport
生成年度报表

```typescript
selectYearlyReport(state: RootState, year: number): {
  income: number;
  expenses: number;
  net: number;
  monthlyData: Array<{month: number, income: number, expenses: number}>;
}
```

## Thunks（异步操作）

### 账户 Thunks

#### loadAccounts
从数据库加载所有账户

```typescript
loadAccounts(): AsyncThunk
```

**使用示例**：
```typescript
import { loadAccounts } from '@/store/thunks/accountThunks';

useEffect(() => {
  dispatch(loadAccounts());
}, []);
```

#### createAccount
创建新账户

```typescript
createAccount(account: Account): AsyncThunk<Account>
```

**使用示例**：
```typescript
import { createAccount } from '@/store/thunks/accountThunks';

const handleCreate = async () => {
  try {
    await dispatch(createAccount(newAccount)).unwrap();
    // 成功
  } catch (error) {
    // 失败
  }
};
```

#### updateAccount
更新账户信息

```typescript
updateAccount(account: Account): AsyncThunk<Account>
```

#### deleteAccount
删除账户

```typescript
deleteAccount(accountId: string): AsyncThunk<string>
```

### 交易 Thunks

#### loadTransactions
加载所有交易

```typescript
loadTransactions(): AsyncThunk
```

#### createTransaction
创建新交易

```typescript
createTransaction(transaction: Transaction): AsyncThunk<Transaction>
```

**使用示例**：
```typescript
import { createTransaction } from '@/store/thunks/transactionThunks';

dispatch(createTransaction({
  id: Date.now().toString(),
  accountId: selectedAccount.id,
  amount: -50.00,
  category: 'Food',
  description: 'Groceries',
  date: new Date().toISOString(),
  type: 'expense'
}));
```

#### updateTransaction
更新交易

```typescript
updateTransaction(transaction: Transaction): AsyncThunk<Transaction>
```

#### deleteTransaction
删除交易

```typescript
deleteTransaction(transactionId: string): AsyncThunk<string>
```

### 预算 Thunks

#### loadBudgets
加载所有预算

```typescript
loadBudgets(): AsyncThunk
```

#### createBudget
创建新预算

```typescript
createBudget(budget: Budget): AsyncThunk<Budget>
```

#### updateBudget
更新预算

```typescript
updateBudget(budget: Budget): AsyncThunk<Budget>
```

#### deleteBudget
删除预算

```typescript
deleteBudget(budgetId: string): AsyncThunk<string>
```

### 分类 Thunks

#### loadCategories
加载所有分类

```typescript
loadCategories(): AsyncThunk
```

#### createCategory
创建新分类

```typescript
createCategory(category: Category): AsyncThunk<Category>
```

#### updateCategory
更新分类

```typescript
updateCategory(category: Category): AsyncThunk<Category>
```

#### deleteCategory
删除分类

```typescript
deleteCategory(categoryId: string): AsyncThunk<string>
```

### 初始化 Thunks

#### initializeApp
初始化应用（连接数据库、加载数据）

```typescript
initializeApp(): AsyncThunk
```

**使用示例**：
```typescript
import { initializeApp } from '@/store/thunks/initThunks';

useEffect(() => {
  const init = async () => {
    try {
      await dispatch(initializeApp()).unwrap();
      setIsReady(true);
    } catch (error) {
      console.error('初始化失败', error);
    }
  };
  init();
}, []);
```

## Services（业务服务）

### Export Service

导出数据服务，支持 CSV 和 Excel 格式。

#### exportTransactionsToCSV
导出交易到 CSV 文件

```typescript
exportTransactionsToCSV(
  transactions: Transaction[],
  accounts: Account[]
): Promise<string>
```

**返回**：文件路径

**使用示例**：
```typescript
import { exportTransactionsToCSV } from '@/services/exportService';

const handleExport = async () => {
  try {
    const filePath = await exportTransactionsToCSV(
      transactions,
      accounts
    );
    // 分享文件
    await Share.open({ url: `file://${filePath}` });
  } catch (error) {
    console.error('导出失败', error);
  }
};
```

#### exportTransactionsToExcel
导出交易到 Excel 文件

```typescript
exportTransactionsToExcel(
  transactions: Transaction[],
  accounts: Account[]
): Promise<string>
```

#### exportBudgetsToCSV
导出预算到 CSV 文件

```typescript
exportBudgetsToCSV(budgets: Budget[]): Promise<string>
```

#### exportBudgetsToExcel
导出预算到 Excel 文件

```typescript
exportBudgetsToExcel(budgets: Budget[]): Promise<string>
```

### Calculation Service

财务计算服务。

#### calculateBudgetProgress
计算预算进度

```typescript
calculateBudgetProgress(
  budgetedAmount: number,
  spentAmount: number
): number
```

**返回**：进度百分比（0-100）

#### calculateBudgetRemaining
计算预算剩余

```typescript
calculateBudgetRemaining(
  budgetedAmount: number,
  spentAmount: number
): number
```

#### isOverBudget
检查是否超预算

```typescript
isOverBudget(
  budgetedAmount: number,
  spentAmount: number
): boolean
```

#### isNearLimit
检查是否接近预算限额

```typescript
isNearLimit(
  budgetedAmount: number,
  spentAmount: number,
  threshold: number = 0.8
): boolean
```

**使用示例**：
```typescript
import { isNearLimit } from '@/services/calculationService';

if (isNearLimit(budget.budgetedAmount, budget.spentAmount, 0.8)) {
  showAlert('预算即将用完！');
}
```

## Repositories（数据仓储）

### Account Repository

#### findAll
获取所有账户

```typescript
accountRepository.findAll(): Promise<Account[]>
```

#### findById
根据 ID 获取账户

```typescript
accountRepository.findById(id: string): Promise<Account | null>
```

#### create
创建账户

```typescript
accountRepository.create(account: Account): Promise<void>
```

#### update
更新账户

```typescript
accountRepository.update(account: Account): Promise<void>
```

#### delete
删除账户

```typescript
accountRepository.delete(id: string): Promise<void>
```

#### updateBalance
更新账户余额

```typescript
accountRepository.updateBalance(
  id: string,
  balance: number
): Promise<void>
```

### Transaction Repository

#### findAll
获取所有交易

```typescript
transactionRepository.findAll(): Promise<Transaction[]>
```

#### findById
根据 ID 获取交易

```typescript
transactionRepository.findById(id: string): Promise<Transaction | null>
```

#### findByAccountId
获取指定账户的所有交易

```typescript
transactionRepository.findByAccountId(
  accountId: string
): Promise<Transaction[]>
```

#### findByDateRange
获取日期范围内的交易

```typescript
transactionRepository.findByDateRange(
  startDate: Date,
  endDate: Date
): Promise<Transaction[]>
```

#### create
创建交易

```typescript
transactionRepository.create(transaction: Transaction): Promise<void>
```

#### update
更新交易

```typescript
transactionRepository.update(transaction: Transaction): Promise<void>
```

#### delete
删除交易

```typescript
transactionRepository.delete(id: string): Promise<void>
```

### Budget Repository

#### findAll
获取所有预算

```typescript
budgetRepository.findAll(): Promise<Budget[]>
```

#### findById
根据 ID 获取预算

```typescript
budgetRepository.findById(id: string): Promise<Budget | null>
```

#### findByCategory
获取指定分类的预算

```typescript
budgetRepository.findByCategory(category: string): Promise<Budget | null>
```

#### create
创建预算

```typescript
budgetRepository.create(budget: Budget): Promise<void>
```

#### update
更新预算

```typescript
budgetRepository.update(budget: Budget): Promise<void>
```

#### delete
删除预算

```typescript
budgetRepository.delete(id: string): Promise<void>
```

#### updateSpentAmount
更新已用金额

```typescript
budgetRepository.updateSpentAmount(
  id: string,
  spentAmount: number
): Promise<void>
```

### Category Repository

#### findAll
获取所有分类

```typescript
categoryRepository.findAll(): Promise<Category[]>
```

#### findById
根据 ID 获取分类

```typescript
categoryRepository.findById(id: string): Promise<Category | null>
```

#### findByType
获取指定类型的分类

```typescript
categoryRepository.findByType(
  type: 'income' | 'expense'
): Promise<Category[]>
```

#### create
创建分类

```typescript
categoryRepository.create(category: Category): Promise<void>
```

#### update
更新分类

```typescript
categoryRepository.update(category: Category): Promise<void>
```

#### delete
删除分类

```typescript
categoryRepository.delete(id: string): Promise<void>
```

## 工具函数

### 格式化工具（utils/formatting.ts）

#### formatCurrency
格式化货币

```typescript
formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string
```

**使用示例**：
```typescript
formatCurrency(1234.56, 'USD', 'en-US');  // "$1,234.56"
formatCurrency(1234.56, 'CNY', 'zh-CN');  // "¥1,234.56"
```

#### formatDate
格式化日期

```typescript
formatDate(
  date: Date | string,
  locale: string = 'en-US'
): string
```

**使用示例**：
```typescript
formatDate(new Date(), 'en-US');  // "Jan 15, 2024"
formatDate(new Date(), 'zh-CN');  // "2024年1月15日"
```

#### formatPercentage
格式化百分比

```typescript
formatPercentage(
  value: number,
  decimals: number = 1,
  locale: string = 'en-US'
): string
```

**使用示例**：
```typescript
formatPercentage(75.5, 1);  // "75.5%"
```

#### calculatePercentage
计算百分比

```typescript
calculatePercentage(
  value: number,
  total: number
): number
```

**使用示例**：
```typescript
calculatePercentage(75, 100);  // 75
```

### 验证工具（utils/validation.ts）

#### validateEmail
验证邮箱格式

```typescript
validateEmail(email: string): boolean
```

#### validateAmount
验证金额

```typescript
validateAmount(amount: number): boolean
```

#### validateRequired
验证必填字段

```typescript
validateRequired(value: any): boolean
```

### 表单工具（utils/form.ts）

#### schemas
预定义的验证模式

```typescript
schemas.account: Yup.ObjectSchema
schemas.transaction: Yup.ObjectSchema
schemas.budget: Yup.ObjectSchema
schemas.category: Yup.ObjectSchema
```

**使用示例**：
```typescript
import { schemas } from '@/utils/form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const { control, handleSubmit } = useForm({
  resolver: yupResolver(schemas.transaction)
});
```

#### getFieldError
获取字段错误信息

```typescript
getFieldError(error: FieldError | undefined): string | undefined
```

**使用示例**：
```typescript
import { getFieldError } from '@/utils/form';

<TextInput
  error={getFieldError(errors.amount)}
/>
```

## 使用最佳实践

### 1. 使用 TypeScript 类型

始终使用 TypeScript 类型，确保类型安全：

```typescript
import { Account } from '@/types';
import { RootState } from '@/store';

const account: Account = useSelector((state: RootState) => 
  selectAccountById(state, accountId)
);
```

### 2. 使用选择器而非直接访问 State

❌ 不推荐：
```typescript
const accounts = useSelector((state: RootState) => state.accounts.accounts);
```

✅ 推荐：
```typescript
const accounts = useSelector(selectAccounts);
```

### 3. 使用 Thunks 处理异步操作

❌ 不推荐：
```typescript
const handleCreate = async () => {
  const result = await accountRepository.create(account);
  dispatch(accountsSlice.actions.addAccount(account));
};
```

✅ 推荐：
```typescript
const handleCreate = () => {
  dispatch(createAccount(account));
};
```

### 4. 错误处理

使用 try-catch 或 unwrap() 处理错误：

```typescript
const handleCreate = async () => {
  try {
    await dispatch(createAccount(account)).unwrap();
    showSuccess('创建成功');
  } catch (error) {
    showError('创建失败');
  }
};
```

### 5. 加载状态

利用 loading 状态显示加载指示器：

```typescript
const loading = useSelector((state: RootState) => state.accounts.loading);

if (loading) {
  return <LoadingSpinner />;
}
```

## 总结

本 API 文档涵盖了应用中所有主要的数据操作接口。遵循这些 API 使用规范，可以确保：

- 类型安全
- 代码一致性
- 易于维护
- 性能优化
- 错误处理完善
