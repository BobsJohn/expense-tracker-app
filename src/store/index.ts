import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from '@reduxjs/toolkit';
import accountsSlice from './slices/accountsSlice';
import transactionsSlice from './slices/transactionsSlice';
import budgetsSlice from './slices/budgetsSlice';
import categoriesSlice from './slices/categoriesSlice';
import appSlice from './slices/appSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['accounts', 'transactions', 'budgets', 'categories'],
};

const rootReducer = combineReducers({
  accounts: accountsSlice,
  transactions: transactionsSlice,
  budgets: budgetsSlice,
  categories: categoriesSlice,
  app: appSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
