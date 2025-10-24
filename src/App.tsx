import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {store, persistor} from '@/store';
import AppNavigator from '@/navigation/AppNavigator';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import BudgetAlertProvider from '@/components/common/BudgetAlertProvider';
import {initDatabase} from '@/services/databaseService';
import '@/localization/i18n';

const App: React.FC = () => {
  useEffect(() => {
    const initDB = async () => {
      try {
        await initDatabase();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initDB();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
            <ErrorBoundary>
              <BudgetAlertProvider>
                <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
                <AppNavigator />
                <Toast />
              </BudgetAlertProvider>
            </ErrorBoundary>
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
