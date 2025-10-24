# Transaction Management Feature

## 概述

交易管理模块是财务预算应用的核心功能，允许用户跟踪、管理和分析他们的所有财务交易。

## 功能特性

### 1. 交易列表
- ✅ 虚拟化FlatList，支持高性能渲染大量交易
- ✅ 按日期倒序排列（最新的在前）
- ✅ 显示交易金额、分类、账户、日期
- ✅ 收入显示绿色，支出显示红色
- ✅ 视觉指示器区分交易类型

### 2. 交易摘要仪表板
- ✅ 显示总收入、总支出、净余额
- ✅ 实时计算，基于当前筛选器
- ✅ 卡片布局，简洁明了

### 3. CRUD操作
- ✅ **添加交易**：通过模态表单创建新交易
- ✅ **编辑交易**：通过滑动操作或点击进入编辑模式
- ✅ **删除交易**：通过滑动操作，带确认对话框
- ✅ 自动更新账户余额
- ✅ 乐观UI更新（先更新UI，后保存数据库）

### 4. 交易表单
- ✅ 收入/支出类型切换
- ✅ 金额输入（数字键盘，支持小数）
- ✅ 分类选择（横向滚动，带图标）
- ✅ 账户选择
- ✅ 交易描述
- ✅ 日期选择器（iOS/Android原生日期选择器）
- ✅ 备注字段（可选）
- ✅ 收据附件占位符（即将推出）
- ✅ 完整的表单验证

### 5. 筛选和搜索
- ✅ **关键词搜索**：搜索描述、分类、备注
- ✅ **分类筛选**：按分类筛选交易
- ✅ **账户筛选**：按账户筛选交易
- ✅ **类型筛选**：筛选收入或支出
- ✅ **日期范围筛选**：自定义开始和结束日期
- ✅ 筛选器组合（所有筛选条件同时生效）
- ✅ 清除筛选功能

### 6. 用户体验
- ✅ 滑动操作（编辑/删除）
- ✅ 触觉反馈
- ✅ Toast通知（成功/错误消息）
- ✅ 加载状态
- ✅ 空状态（无交易/筛选无结果）
- ✅ 错误状态处理
- ✅ 响应式设计

### 7. 数据持久化
- ✅ SQLite数据库存储
- ✅ Redux状态管理
- ✅ Redux Persist（离线支持）
- ✅ 自动保存

### 8. 关联更新
- ✅ 添加交易时自动更新账户余额
- ✅ 编辑交易时调整账户余额
- ✅ 删除交易时恢复账户余额
- ✅ 预算支出自动计算（通过selectors）

## 技术实现

### 组件结构

```
src/screens/transactions/
├── TransactionsScreen.tsx          # 主屏幕
├── components/
│   ├── TransactionFormModal.tsx    # 添加/编辑表单
│   ├── FilterPanel.tsx              # 筛选面板
│   ├── TransactionItem.tsx          # 单个交易项（带滑动）
│   └── EmptyState.tsx               # 空状态组件
└── __tests__/
    └── TransactionsScreen.test.tsx  # 单元测试
```

### Redux架构

#### Slices
- `transactionsSlice.ts` - 交易状态管理，包含CRUD reducers

#### Thunks
- `addTransactionThunk` - 添加交易并更新账户余额
- `updateTransactionThunk` - 更新交易并调整余额
- `deleteTransactionThunk` - 删除交易并恢复余额
- `loadTransactionsThunk` - 从数据库加载交易

#### Selectors
- `selectFilteredTransactions` - 根据筛选条件返回交易
- `selectTransactionsSummary` - 计算交易摘要
- `selectFilteredTransactionsSummary` - 计算筛选后的摘要

### 数据库服务

`databaseService.ts` 提供：
- 数据库初始化和表创建
- 交易CRUD操作
- 索引优化（accountId, date, type, category）

### 数据流

```
用户操作 → Thunk → Redux更新（乐观） → 数据库持久化 → Toast反馈
                  ↓
                 失败时回滚状态
```

## 使用示例

### 添加交易

```typescript
import {addTransactionThunk} from '@/store/thunks/transactionThunks';

const newTransaction: Transaction = {
  id: `tx-${Date.now()}`,
  accountId: 'account-1',
  amount: -50.00,  // 负数表示支出
  category: 'Food',
  description: 'Grocery shopping',
  date: new Date().toISOString(),
  type: 'expense',
  memo: 'Weekly groceries',
};

dispatch(addTransactionThunk(newTransaction));
```

### 筛选交易

```typescript
const filters: TransactionFilters = {
  keyword: 'grocery',
  category: 'Food',
  type: 'expense',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
};

const filteredTransactions = useAppSelector(state =>
  selectFilteredTransactions(state, filters)
);
```

## 验收标准

✅ 用户可以创建、编辑、删除交易  
✅ 筛选器正常工作，可以组合使用  
✅ 账户余额立即更新  
✅ 预算支出汇总自动更新  
✅ 数据在应用重启后持久化  
✅ 显示适当的加载、空状态和错误状态  
✅ 乐观UI更新，操作即时反馈  
✅ Toast通知确认操作成功/失败  

## 未来增强

- [ ] 收据图片附件上传和查看
- [ ] 批量操作（选择多个交易）
- [ ] 交易导出（CSV/Excel）
- [ ] 交易标签系统
- [ ] 定期交易（自动重复）
- [ ] 交易模板
- [ ] 高级统计和图表
- [ ] 交易搜索历史
- [ ] 语音输入交易

## 性能优化

- 使用虚拟化列表（FlatList）处理大量交易
- 使用记忆化选择器（createSelector）避免不必要的重新计算
- 索引数据库字段以加速查询
- 乐观UI更新提供即时反馈
- 使用React.memo优化组件渲染

## 测试

运行测试：
```bash
npm test -- src/screens/transactions
```

## 相关文档

- [Redux Thunks文档](https://redux-toolkit.js.org/api/createAsyncThunk)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [SQLite Storage](https://github.com/andpor/react-native-sqlite-storage)
