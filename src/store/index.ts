import {configureStore} from '@reduxjs/toolkit';
import accountsSlice from './slices/accountsSlice';
import transactionsSlice from './slices/transactionsSlice';
import budgetsSlice from './slices/budgetsSlice';
import categoriesSlice from './slices/categoriesSlice';
import appSlice from './slices/appSlice';

// 配置 Redux store
// 数据持久化现在由 SQLite 数据库处理，不再使用 redux-persist
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
        // 某些操作可能包含不可序列化的值（如 Date 对象）
        ignoredActionPaths: ['payload.date', 'payload.createdAt', 'payload.updatedAt'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
