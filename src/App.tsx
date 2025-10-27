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

// 应用初始化包装组件
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
        // 即使失败也显示应用，避免白屏
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
