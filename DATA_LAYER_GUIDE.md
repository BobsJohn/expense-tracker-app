# 数据持久化层使用指南

## 概述

本应用使用 SQLite 数据库作为数据持久化层，结合 Redux 进行状态管理。数据层架构包括：

- **数据库层** (`src/database/`): 核心数据库管理，包括初始化、迁移和 schema 定义
- **仓储层** (`src/repositories/`): 封装所有 CRUD 操作的仓储模式
- **Redux 层** (`src/store/`): 使用 Redux Toolkit 管理应用状态，通过 thunks 与仓储层交互

## 架构图

```
┌─────────────────────────────────────────┐
│           React Components              │
│  (使用 useSelector 和 useDispatch)       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│          Redux Store (State)            │
│  - accounts, transactions, categories   │
│  - budgets, app                         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│       Redux Thunks (异步操作)           │
│  - loadAccounts, createTransaction, etc │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Repositories (仓储层)              │
│  - accountRepository                    │
│  - transactionRepository                │
│  - categoryRepository                   │
│  - budgetRepository                     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│    Database Layer (SQLite)              │
│  - 初始化、迁移、schema 管理            │
└─────────────────────────────────────────┘
```

## 核心概念

### 1. 数据库初始化

应用启动时会自动初始化数据库：

```typescript
// 在 App.tsx 中自动调用
dispatch(initializeApp())
```

初始化流程：
1. 打开或创建数据库连接
2. 检查并运行必要的迁移
3. 首次运行时种子默认数据（默认分类和账户）
4. 从数据库加载所有数据到 Redux store

### 2. 数据库迁移

迁移系统支持数据库结构的版本化管理：

```typescript
// src/database/migrations.ts
export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    up: async (db: SQLiteDatabase) => {
      // 创建表和索引
    },
  },
  // 未来版本的迁移可以在这里添加
];
```

### 3. 仓储模式

每个数据实体都有对应的仓储类：

```typescript
// 使用账户仓储的示例
import {accountRepository} from '@/repositories';

// 获取所有账户
const accounts = await accountRepository.findAll();

// 创建账户
await accountRepository.create(newAccount);

// 更新账户
await accountRepository.update(updatedAccount);

// 删除账户
await accountRepository.delete(accountId);
```

### 4. Redux Thunks

通过 thunks 在组件中执行异步操作：

```typescript
import {useDispatch} from 'react-redux';
import {createAccount} from '@/store/thunks/accountThunks';

const dispatch = useDispatch();

// 创建账户
dispatch(createAccount(newAccount));
```

## 主要特性

### ✅ 完整的类型安全

所有数据操作都有完整的 TypeScript 类型定义：

- **领域模型** (`src/types/index.ts`): 应用层使用的类型
- **数据库 DTO** (`src/database/types.ts`): 数据库行格式
- **映射器** (`src/database/mappers.ts`): DTO ↔ 领域模型转换

### ✅ 事务支持

仓储层支持数据库事务：

```typescript
await transactionRepository.executeTransaction(async (db) => {
  // 在事务中执行多个操作
  await db.executeSql(...);
  await db.executeSql(...);
});
```

### ✅ 自动数据种子

首次运行时自动初始化：
- 21 个默认分类（收入和支出）
- 1 个默认账户

### ✅ 迁移系统

支持数据库结构的渐进式升级，无需用户手动干预。

## 数据表结构

### accounts (账户)
- id, name, type, balance, currency
- createdAt, updatedAt

### transactions (交易)
- id, accountId, amount, category
- description, date, type, memo
- transferId, relatedAccountId

### categories (分类)
- id, name, icon, color, type
- isDefault

### budgets (预算)
- id, category, budgetedAmount, spentAmount
- period, currency, alertThreshold
- createdAt, updatedAt

### settings (设置)
- key, value

### transfers (转账)
- id, sourceAccountId, destinationAccountId
- amount, date, memo, createdAt

## 使用示例

### 示例 1: 创建新交易

```typescript
import {useDispatch} from 'react-redux';
import {createTransaction} from '@/store/thunks/transactionThunks';

const handleCreateTransaction = () => {
  const newTransaction: Transaction = {
    id: Date.now().toString(),
    accountId: selectedAccount.id,
    amount: -50.00,
    category: 'Food',
    description: 'Groceries',
    date: new Date().toISOString(),
    type: 'expense',
  };

  dispatch(createTransaction(newTransaction));
};
```

### 示例 2: 加载账户交易

```typescript
import {useSelector} from 'react-redux';
import {selectTransactionsByAccountId} from '@/store/selectors';

const AccountDetails = ({accountId}: {accountId: string}) => {
  const transactions = useSelector(state => 
    selectTransactionsByAccountId(state, accountId)
  );

  return (
    <TransactionList transactions={transactions} />
  );
};
```

### 示例 3: 直接使用仓储（高级）

```typescript
import {accountRepository} from '@/repositories';

// 在某些特殊情况下可以直接使用仓储
const account = await accountRepository.findById(accountId);
if (account) {
  await accountRepository.updateBalance(accountId, newBalance);
}
```

## 测试

### 运行测试

```bash
npm test
```

### 测试覆盖

- ✅ 数据映射器测试
- ✅ Redux slice 和 reducer 测试
- ✅ Selector 测试
- ✅ 仓储层测试（使用 mock）

## 性能优化

### 索引

数据库表已添加适当的索引以提高查询性能：
- transactions 表的 accountId, date, type, category 字段
- categories 表的 type 字段
- 等等

### 选择器缓存

Redux selectors 使用 reselect 进行记忆化，避免不必要的重新计算。

## 调试技巧

### 查看数据库日志

所有数据库操作都会在控制台输出日志：

```
[LOG] 正在初始化数据库...
[LOG] 数据库连接已建立
[LOG] 数据库结构已是最新
[LOG] 数据已初始化，跳过种子数据
[LOG] 从数据库加载数据到 store...
[LOG] 应用初始化完成
```

### 重置数据库

如需重置所有数据（仅用于开发）：

```typescript
import {resetDatabase} from '@/database/database';
await resetDatabase();
```

## 最佳实践

1. **始终通过 Redux thunks 修改数据**
   - 不要直接调用仓储方法
   - 保持数据流的一致性

2. **使用 selectors 访问数据**
   - 利用缓存优化性能
   - 保持组件简洁

3. **类型安全**
   - 使用 TypeScript 类型定义
   - 避免使用 `any`

4. **错误处理**
   - 所有异步操作都应该处理错误
   - 使用 try-catch 或 thunk 的 rejectWithValue

## 未来扩展

如需添加新的数据表或字段：

1. 在 `src/database/schema.ts` 中定义新的 schema
2. 在 `src/database/types.ts` 中添加 DTO 类型
3. 在 `src/database/migrations.ts` 中创建新的迁移
4. 创建对应的仓储类
5. 添加 Redux slice 和 thunks
6. 编写测试

## 故障排除

### 数据库初始化失败

- 检查权限
- 清除应用数据重试
- 查看详细错误日志

### 数据不同步

- 确保使用 thunks 而不是直接修改 store
- 检查 reducer 中的逻辑
- 验证数据库操作是否成功

## 参考资料

- [Redux Toolkit 文档](https://redux-toolkit.js.org/)
- [React Native SQLite Storage](https://github.com/andpor/react-native-sqlite-storage)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
