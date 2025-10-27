/**
 * Redux Store 配置文件
 * 
 * 功能说明：
 * - 配置 Redux Toolkit store 作为应用的全局状态管理中心
 * - 整合各个功能模块的 slice（账户、交易、预算、分类、应用设置）
 * - 配置中间件以处理异步操作和序列化检查
 * 
 * 架构说明：
 * - 使用 SQLite 数据库进行数据持久化，Redux 仅用于运行时状态管理
 * - 不使用 redux-persist，避免与数据库冲突
 * - 通过 thunks 处理数据库操作和异步业务逻辑
 * 
 * @module store
 */
import {configureStore} from '@reduxjs/toolkit';
import accountsSlice from './slices/accountsSlice';
import transactionsSlice from './slices/transactionsSlice';
import budgetsSlice from './slices/budgetsSlice';
import categoriesSlice from './slices/categoriesSlice';
import appSlice from './slices/appSlice';

/**
 * Redux Store 实例
 * 
 * 配置项说明：
 * - reducer: 合并所有 slice 的 reducer
 * - middleware: 自定义中间件配置，禁用部分序列化检查
 * 
 * 注意：
 * - Date 对象等不可序列化的值需要在 ignoredActionPaths 中忽略
 */
export const store = configureStore({
  reducer: {
    accounts: accountsSlice,
    transactions: transactionsSlice,
    budgets: budgetsSlice,
    categories: categoriesSlice,
    app: appSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ['payload.date', 'payload.createdAt', 'payload.updatedAt'],
      },
    }),
});

/**
 * 根状态类型
 * 
 * 描述：从 store 自动推断的完整状态树类型
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * 应用 Dispatch 类型
 * 
 * 描述：带有 thunk 支持的 dispatch 函数类型
 */
export type AppDispatch = typeof store.dispatch;
