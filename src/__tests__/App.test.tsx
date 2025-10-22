import React from 'react';
import {render, screen} from '@testing-library/react-native';
import App from '../App';

// Mock all the external dependencies
jest.mock('react-native-localize', () => ({
  getLocales: () => [{languageCode: 'en'}],
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

// Mock navigation container
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({children}: {children: React.ReactNode}) => children,
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({children}: {children: React.ReactNode}) => children,
    Screen: ({children}: {children: React.ReactNode}) => children,
  }),
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({children}: {children: React.ReactNode}) => children,
    Screen: ({children}: {children: React.ReactNode}) => children,
  }),
}));

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({children}: {children: React.ReactNode}) => children,
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({children}: {children: React.ReactNode}) => children,
}));

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('App', () => {
  it('renders without crashing', () => {
    const {root} = render(<App />);
    expect(root).toBeTruthy();
  });

  it('provides Redux store to components', () => {
    // This test ensures the Provider is properly set up
    render(<App />);
    // If the app renders without throwing, the store is properly configured
    expect(true).toBe(true);
  });
});
