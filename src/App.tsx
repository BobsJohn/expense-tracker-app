/**
 * 应用根组件
 * 
 * 功能说明：
 * - 配置应用的根级 Provider（Redux、主题、导航等）
 * - 处理应用初始化逻辑（数据库连接、数据加载）
 * - 设置全局错误边界和预算提醒功能
 * - 配置手势处理和安全区域
 * 
 * 组件层级结构：
 * GestureHandlerRootView（手势支持）
 *   └─ SafeAreaProvider（安全区域）
 *      └─ ThemeProvider（主题）
 *         └─ Redux Provider（状态管理）
 *            └─ AppInitializer（初始化）
 *               └─ ErrorBoundary（错误捕获）
 *                  └─ BudgetAlertProvider（预算提醒）
 *                     └─ AppNavigator（导航）
 */
import React, {useEffect, useState} from 'react';
import {Provider, useDispatch} from 'react-redux';
import Toast from 'react-native-toast-message';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {store, AppDispatch} from '@/store';
import {initializeApp} from '@/store/thunks/initThunks';
import AppNavigator from '@/navigation/AppNavigator';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import BudgetAlertProvider from '@/components/common/BudgetAlertProvider';
import ThemedStatusBar from '@/components/common/ThemedStatusBar';
import {ThemeProvider} from '@/theme';
import '@/localization/i18n';

/**
 * 应用初始化包装组件
 * 
 * 功能：
 * - 在应用启动时执行初始化逻辑
 * - 连接数据库并加载初始数据
 * - 显示加载指示器直到初始化完成
 * - 即使初始化失败也会显示应用界面，避免白屏
 */
const AppInitializer: React.FC<{children: React.ReactNode}> = ({children}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await dispatch(initializeApp()).unwrap();
        setIsInitialized(true);
      } catch (error) {
        console.error('应用初始化失败:', error);
        setIsInitialized(true);
      }
    };

    init();
  }, [dispatch]);

  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

/**
 * 应用主组件
 * 
 * 功能：
 * - 组装所有根级 Provider 和容器组件
 * - 配置 Redux store、主题系统、导航系统
 * - 设置手势处理、安全区域、错误边界等全局功能
 * - 渲染 Toast 消息组件用于全局提示
 */
const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <ThemeProvider>
          <Provider store={store}>
            <AppInitializer>
              <ErrorBoundary>
                <BudgetAlertProvider>
                  <ThemedStatusBar />
                  <AppNavigator />
                  <Toast />
                </BudgetAlertProvider>
              </ErrorBoundary>
            </AppInitializer>
          </Provider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
