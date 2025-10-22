# Financial Budget App

A comprehensive React Native application for personal financial management, featuring account tracking, budget management, transaction monitoring, and multi-language support.

## 📱 Features

### Core Functionality
- **Account Management**: Track multiple accounts (checking, savings, credit cards, investments)
- **Transaction Tracking**: Record and categorize income and expenses
- **Budget Planning**: Set and monitor budgets by category with progress tracking
- **Financial Dashboard**: Real-time overview of financial health
- **Multi-language Support**: English, Spanish, and French localization

### User Experience
- **Responsive Design**: Optimized for both phones and tablets
- **Haptic Feedback**: Enhanced tactile feedback for key interactions
- **Toast Notifications**: User-friendly success/error messages
- **Loading States**: Smooth loading indicators throughout the app
- **Error Handling**: Comprehensive error boundaries and recovery mechanisms

### Performance Features
- **State Management**: Redux Toolkit with persistence
- **Virtual Lists**: Optimized rendering for large data sets
- **Memoization**: Performance-optimized components and selectors
- **Offline Support**: Data persistence with Redux Persist

## 🏗️ Architecture

### Application Structure
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Common components (Loading, ErrorBoundary)
│   └── ui/              # UI primitives (Button, Card, etc.)
├── screens/             # Screen components
│   ├── dashboard/       # Dashboard screen
│   ├── accounts/        # Account management screens
│   ├── budgets/         # Budget management screens
│   ├── transactions/    # Transaction screens
│   └── settings/        # Settings screens
├── store/               # Redux store configuration
│   ├── slices/          # Redux slices for each domain
│   └── selectors.ts     # Memoized selectors
├── services/            # External services and utilities
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── localization/        # i18n configuration and translations
└── navigation/          # Navigation configuration
```

### State Management Architecture

The app uses Redux Toolkit for state management with the following structure:

- **Accounts Slice**: Manages user accounts and balances
- **Transactions Slice**: Handles transaction data and operations
- **Budgets Slice**: Controls budget creation and tracking
- **App Slice**: Global app state (theme, language, loading states)

### Data Flow
1. **Actions** are dispatched from components
2. **Reducers** update the store state immutably
3. **Selectors** compute derived data with memoization
4. **Components** subscribe to state changes via useSelector

### Performance Optimizations
- **Memoized Selectors**: Prevent unnecessary re-computations
- **Component Memoization**: React.memo for pure components
- **Virtual Lists**: Efficient rendering of large datasets
- **Bundle Splitting**: Code splitting for optimal load times

## 🚀 Setup Instructions

### Prerequisites
- Node.js 16+ 
- React Native CLI
- iOS: Xcode 12+ (for iOS development)
- Android: Android Studio and SDK (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd financial-budget-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup** (macOS only)
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Start Metro bundler**
   ```bash
   npm start
   ```

5. **Run the application**
   
   For iOS:
   ```bash
   npm run ios
   ```
   
   For Android:
   ```bash
   npm run android
   ```

### Environment Configuration

Create a `.env` file in the root directory for environment-specific configurations:
```
API_BASE_URL=https://your-api-url.com
ENABLE_FLIPPER=true
LOG_LEVEL=debug
```

## 🧪 Testing Guidelines

### Test Structure
The app includes comprehensive testing for:
- **Unit Tests**: Individual functions and utilities
- **Component Tests**: React component behavior
- **Integration Tests**: Store selectors and complex interactions
- **E2E Tests**: Full user workflows

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- DashboardScreen.test.tsx
```

### Test Categories

#### Unit Tests
- **Selectors**: Critical business logic calculations
- **Utils**: Currency formatting, validation functions
- **Services**: API calls and data transformations

#### Component Tests
- **Rendering**: Ensure components render without crashes
- **Interactions**: User interactions and state changes
- **Props**: Component behavior with different props

#### Integration Tests
- **Store Integration**: Action dispatching and state updates
- **Navigation**: Screen transitions and parameter passing
- **Persistence**: Data saving and loading

### Testing Best Practices

1. **Descriptive Test Names**: Use clear, descriptive test names
2. **Arrange-Act-Assert**: Structure tests with clear phases
3. **Mock External Dependencies**: Isolate units under test
4. **Test Error Cases**: Include negative test scenarios
5. **Maintain Test Data**: Use factories for consistent test data

### Code Coverage Targets
- **Unit Tests**: > 90% coverage for utils and selectors
- **Component Tests**: > 80% coverage for screen components
- **Integration Tests**: > 70% coverage for store operations

## 📖 Development Guidelines

### Code Style
- **TypeScript**: Strict typing enabled
- **ESLint**: Enforced code quality rules
- **Prettier**: Consistent code formatting

### Component Development
- Use functional components with hooks
- Implement proper prop typing
- Add displayName for debugging
- Use React.memo for performance optimization

### State Management
- Keep state normalized and flat
- Use selectors for derived data
- Implement proper error handling
- Add loading states for async operations

### Internationalization
- All user-facing strings must be localized
- Use translation keys following the established pattern
- Test with different languages to ensure UI compatibility

## 🔧 Build Configuration

### Development Build
```bash
npm run android        # Android development build
npm run ios           # iOS development build
```

### Production Build
```bash
# Android
cd android
./gradlew assembleRelease

# iOS
cd ios
xcodebuild -workspace FinancialBudgetApp.xcworkspace -scheme FinancialBudgetApp -configuration Release
```

## 🌐 Localization

### Supported Languages
- English (en) - Default
- Spanish (es)
- French (fr)

### Adding New Languages
1. Create translation file: `src/localization/locales/{lang}.json`
2. Add to i18n resources in `src/localization/i18n.ts`
3. Test thoroughly for UI layout issues

## 🐛 Troubleshooting

### Common Issues

#### Metro bundler issues
```bash
npm start -- --reset-cache
```

#### iOS build failures
```bash
cd ios
pod install
cd ..
npm run ios
```

#### Android build issues
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Performance Monitoring
- Use Flipper for debugging
- Monitor memory usage in large lists
- Check bundle size regularly
- Profile component render times

## 📝 Contributing

1. Follow the established code style
2. Add tests for new features
3. Update documentation as needed
4. Test across multiple devices and platforms
5. Ensure accessibility compliance

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

For additional support or questions, please refer to the project documentation or create an issue in the repository.