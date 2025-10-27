# 财务预算管理应用

一个功能完善的 React Native 个人财务管理应用，提供账户追踪、预算管理、交易监控和多语言支持等功能。

## 📱 特性列表

### 核心功能
- **账户管理**：追踪多个账户（支票账户、储蓄账户、信用卡、投资账户）
- **交易追踪**：记录和分类收入与支出
- **预算规划**：按类别设置和监控预算，实时追踪进度
- **财务面板**：实时展示财务健康状况概览
- **多语言支持**：支持英语、中文、西班牙语和法语本地化
- **主题定制**：支持浅色/深色模式，自动持久化主题偏好

### 用户体验
- **响应式设计**：针对手机和平板设备优化
- **触觉反馈**：关键交互提供增强的触觉反馈
- **Toast 通知**：用户友好的成功/错误消息提示
- **加载状态**：应用全局流畅的加载指示器
- **错误处理**：完善的错误边界和恢复机制

### 性能特性
- **状态管理**：使用 Redux Toolkit 进行状态管理和持久化
- **虚拟列表**：优化大数据集的渲染性能
- **记忆化优化**：性能优化的组件和选择器
- **离线支持**：使用 Redux Persist 实现数据持久化

## 🛠️ 技术栈

### 前端框架
- **React Native 0.72.6**：跨平台移动应用框架
- **TypeScript 4.8.4**：类型安全的 JavaScript 超集

### 状态管理
- **Redux Toolkit 1.9.7**：现代化的 Redux 状态管理
- **Redux Persist 6.0.0**：状态持久化
- **React Redux 8.1.3**：React 绑定库

### 导航
- **React Navigation 6.x**：原生导航体验
  - Bottom Tabs Navigator：底部标签导航
  - Stack Navigator：堆栈式导航

### 数据持久化
- **React Native SQLite Storage 6.0.1**：本地 SQLite 数据库

### UI 组件库
- **React Native Vector Icons 10.0.2**：图标库
- **Victory Native 36.9.2**：图表和数据可视化
- **React Native Reanimated 3.5.4**：流畅动画

### 国际化
- **i18next 23.5.1**：国际化框架
- **react-i18next 13.2.2**：React 集成
- **react-native-localize 3.0.3**：设备语言检测

### 表单处理
- **React Hook Form 7.65.0**：高性能表单库
- **Yup 1.7.1**：模式验证

### 其他工具
- **React Native Gesture Handler 2.13.4**：手势处理
- **React Native Safe Area Context 4.7.4**：安全区域
- **React Native Toast Message 2.1.6**：全局提示消息
- **React Native Haptic Feedback 2.2.0**：触觉反馈
- **React Native Share 12.2.0**：分享功能
- **React Native FS 2.20.0**：文件系统访问
- **PapaParse 5.5.3**：CSV 解析
- **XLSX 0.18.5**：Excel 文件处理

### 开发工具
- **ESLint**：代码质量检查
- **Prettier**：代码格式化
- **Jest**：单元测试框架
- **React Native Testing Library**：组件测试

## 🏗️ 系统架构

### 应用结构
```
src/
├── components/           # 可复用 UI 组件
│   ├── common/          # 通用组件（Loading、ErrorBoundary）
│   ├── shared/          # 共享组件（Button、Card、Input 等）
│   └── charts/          # 图表组件（PieChart、BarChart、LineChart）
├── screens/             # 屏幕组件
│   ├── dashboard/       # 面板屏幕
│   ├── accounts/        # 账户管理屏幕
│   ├── budgets/         # 预算管理屏幕
│   ├── transactions/    # 交易屏幕
│   ├── reports/         # 报表屏幕
│   ├── settings/        # 设置屏幕
│   └── auth/           # 认证屏幕
├── store/               # Redux 状态管理
│   ├── slices/          # Redux slices（按业务领域划分）
│   ├── thunks/          # 异步操作（thunks）
│   ├── actions/         # Action 创建器
│   └── selectors.ts     # 记忆化选择器
├── database/            # 数据库层
│   ├── database.ts      # 数据库初始化和连接
│   ├── schema.ts        # 表结构定义
│   ├── migrations.ts    # 数据库迁移
│   ├── mappers.ts       # DTO 与领域模型映射
│   └── types.ts         # 数据库类型定义
├── repositories/        # 仓储层（数据访问）
│   ├── accountRepository.ts
│   ├── transactionRepository.ts
│   ├── categoryRepository.ts
│   └── budgetRepository.ts
├── services/            # 外部服务和工具
├── utils/               # 工具函数
│   ├── formatting.ts    # 格式化工具（货币、日期、数字）
│   ├── form.ts          # 表单验证和工具
│   └── validation.ts    # 通用验证函数
├── types/               # TypeScript 类型定义
├── localization/        # 国际化配置
│   ├── i18n.ts          # i18n 配置
│   └── locales/         # 翻译文件（en、zh、es、fr）
├── theme/               # 主题系统
│   ├── theme.ts         # 主题配置（浅色/深色）
│   └── ThemeContext.tsx # 主题上下文和 Provider
├── navigation/          # 导航配置
└── hooks/               # 自定义 Hooks
```

### 架构设计原则

#### 分层架构
应用采用清晰的分层架构，每层职责明确：

```
┌─────────────────────────────────────────┐
│        UI 层（React Components）         │
│         使用 Hooks 访问状态和操作         │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      状态管理层（Redux Store）           │
│  - Slices: 状态定义和 reducers          │
│  - Selectors: 派生数据计算              │
│  - Thunks: 异步操作编排                 │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│       仓储层（Repositories）            │
│  - 封装所有 CRUD 操作                   │
│  - 处理数据映射和转换                   │
│  - 提供统一的数据访问接口               │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      数据持久化层（SQLite）              │
│  - 数据库连接管理                       │
│  - Schema 定义和迁移                    │
│  - 事务支持                            │
└─────────────────────────────────────────┘
```

#### 数据流

**单向数据流**：
1. **UI 层**：用户交互触发 action
2. **Dispatch**：通过 dispatch 分发 action
3. **Thunks**：异步操作调用仓储层
4. **Repositories**：执行数据库操作
5. **Reducers**：更新 Redux store
6. **Selectors**：计算派生数据
7. **UI 更新**：组件通过 useSelector 获取最新状态并重新渲染

#### 状态管理架构

使用 Redux Toolkit 实现状态管理，主要包含以下 slices：

- **accounts**：管理用户账户和余额
- **transactions**：处理交易数据和操作
- **budgets**：控制预算创建和追踪
- **categories**：管理收支分类
- **app**：全局应用状态（主题、语言、加载状态）

#### 性能优化策略

- **记忆化选择器**：使用 reselect 防止不必要的重新计算
- **组件记忆化**：React.memo 用于纯组件优化
- **虚拟列表**：高效渲染大型数据集
- **代码分割**：按需加载优化加载时间
- **图片优化**：合理的图片缓存策略

## 🚀 快速开始

### 环境要求
- **Node.js 16+**
- **React Native CLI**
- **iOS 开发**：Xcode 12+（仅 macOS）
- **Android 开发**：Android Studio 和 Android SDK

### 安装步骤

#### 1. 克隆仓库
```bash
git clone <repository-url>
cd financial-budget-app
```

#### 2. 安装依赖
```bash
npm install
```

#### 3. iOS 设置（仅 macOS）
```bash
cd ios
pod install
cd ..
```

#### 4. 启动 Metro bundler
```bash
npm start
```

#### 5. 运行应用

**iOS 平台：**
```bash
npm run ios
```

**Android 平台：**
```bash
npm run android
```

### 环境配置

在项目根目录创建 `.env` 文件进行环境特定配置：
```env
API_BASE_URL=https://your-api-url.com
ENABLE_FLIPPER=true
LOG_LEVEL=debug
```

## 🧪 运行和调试

### 开发模式运行

```bash
# 启动 Metro bundler
npm start

# 清除缓存启动
npm start -- --reset-cache

# iOS 模拟器运行
npm run ios

# 指定设备运行
npm run ios -- --simulator="iPhone 14 Pro"

# Android 模拟器运行
npm run android

# 指定设备运行
npm run android -- --deviceId=<device-id>
```

### 调试工具

#### React Native Debugger
1. 安装 React Native Debugger
2. 在应用中启用调试菜单（摇动设备或 Cmd+D/Ctrl+M）
3. 选择 "Debug"

#### Flipper
应用已集成 Flipper 支持，可用于：
- 查看 Redux store 状态
- 检查网络请求
- 查看数据库内容
- 性能分析

#### 控制台日志
```bash
# iOS 日志
npx react-native log-ios

# Android 日志
npx react-native log-android
```

## 🔨 构建和发布

### 开发构建

```bash
# Android 开发构建
npm run android

# iOS 开发构建
npm run ios
```

### 生产构建

#### Android 生产构建

```bash
cd android

# 生成 Release APK
./gradlew assembleRelease

# 生成 Release AAB（Google Play）
./gradlew bundleRelease

# 输出路径：
# APK: android/app/build/outputs/apk/release/app-release.apk
# AAB: android/app/build/outputs/bundle/release/app-release.aab
```

#### iOS 生产构建

```bash
cd ios

# 使用 Xcode 构建
xcodebuild -workspace FinancialBudgetApp.xcworkspace \
           -scheme FinancialBudgetApp \
           -configuration Release \
           -archivePath build/FinancialBudgetApp.xcarchive \
           archive

# 或使用 Xcode GUI：
# 1. 打开 ios/FinancialBudgetApp.xcworkspace
# 2. 选择 Product > Archive
# 3. 使用 Organizer 分发应用
```

### 签名配置

#### Android 签名
1. 生成密钥库（仅首次）：
```bash
keytool -genkeypair -v -keystore my-release-key.keystore \
        -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. 配置 `android/gradle.properties`：
```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=****
MYAPP_RELEASE_KEY_PASSWORD=****
```

#### iOS 签名
1. 在 Xcode 中配置签名证书
2. 选择正确的 Provisioning Profile
3. 配置 Bundle Identifier

## 📖 项目结构说明

### 组件分类

#### 通用组件（`components/common/`）
- **ErrorBoundary**：错误边界组件
- **LoadingSpinner**：加载指示器
- **ThemedStatusBar**：主题化状态栏
- **BudgetAlertProvider**：预算提醒功能

#### 共享 UI 组件（`components/shared/`）
- **PrimaryButton**：主按钮（多种变体和尺寸）
- **IconButton**：图标按钮
- **TextInputField**：文本输入框
- **SelectPicker**：选择器
- **AmountInput**：金额输入
- **DatePickerField**：日期选择器
- **Card**：卡片容器
- **Chip**：标签芯片
- **ProgressBar**：进度条
- **SectionHeader**：区块标题
- **EmptyState**：空状态提示
- **LoadingOverlay**：加载遮罩
- **ScreenContainer**：屏幕容器
- **Header**：页面标题头部

#### 图表组件（`components/charts/`）
- **PieChart**：饼图/环形图
- **BarChart**：柱状图
- **LineChart**：折线图

### 屏幕模块

- **Dashboard**：财务概览面板
- **Accounts**：账户列表和详情
- **Transactions**：交易记录和添加
- **Budgets**：预算设置和监控
- **Reports**：财务报表和分析
- **Settings**：应用设置（主题、语言等）
- **CategoryManagement**：分类管理
- **Export**：数据导出功能

### Redux Store 结构

```typescript
{
  accounts: {
    items: Account[],
    loading: boolean,
    error: string | null
  },
  transactions: {
    items: Transaction[],
    loading: boolean,
    error: string | null
  },
  budgets: {
    items: Budget[],
    loading: boolean,
    error: string | null
  },
  categories: {
    items: Category[],
    loading: boolean,
    error: string | null
  },
  app: {
    isInitialized: boolean,
    theme: 'light' | 'dark',
    language: 'en' | 'zh' | 'es' | 'fr'
  }
}
```

## 🌐 国际化支持

### 支持的语言
- **英语（en）**：默认语言
- **中文（zh）**：简体中文
- **西班牙语（es）**：Español
- **法语（fr）**：Français

### 添加新语言

1. 创建翻译文件：`src/localization/locales/{lang}.json`
2. 在 `src/localization/i18n.ts` 中添加语言资源：
```typescript
resources: {
  // ... 现有语言
  de: { translation: require('./locales/de.json') },
}
```
3. 在设置页面添加语言选项
4. 全面测试 UI 布局以确保兼容性

### 使用翻译

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <Text>{t('common.save')}</Text>;
}
```

## 🤝 贡献指南

### 开发流程

1. **Fork 仓库**
2. **创建功能分支**：`git checkout -b feature/your-feature`
3. **提交更改**：`git commit -m '添加某功能'`
4. **推送分支**：`git push origin feature/your-feature`
5. **创建 Pull Request**

### 代码规范

- 遵循既定的代码风格
- 为新功能添加测试
- 更新相关文档
- 在多个设备和平台上测试
- 确保无障碍访问合规

### 提交信息规范

使用语义化提交信息：
```
feat: 添加新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构代码
test: 测试相关
chore: 构建/工具相关
```

## 🐛 常见问题解答

### Metro bundler 问题

**问题**：Metro bundler 启动失败或缓存问题

**解决方案**：
```bash
# 清除缓存
npm start -- --reset-cache

# 或
rm -rf $TMPDIR/react-*
npm start
```

### iOS 构建失败

**问题**：CocoaPods 相关错误

**解决方案**：
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Android 构建问题

**问题**：Gradle 构建失败

**解决方案**：
```bash
cd android
./gradlew clean
cd ..
npm run android

# 如果仍然失败，清除 Gradle 缓存
rm -rf ~/.gradle/caches/
```

### 数据库问题

**问题**：数据不同步或加载失败

**解决方案**：
1. 检查初始化日志
2. 清除应用数据（开发环境）
3. 验证数据库迁移是否成功

### 性能问题

**问题**：应用运行缓慢或卡顿

**解决方案**：
1. 使用 Flipper 进行性能分析
2. 检查大列表是否使用虚拟化
3. 验证组件是否正确使用 React.memo
4. 检查是否有内存泄漏

## 📄 许可证

本项目采用 MIT 许可证 - 详见 LICENSE 文件。

---

## 📚 相关文档

- [架构文档](./ARCHITECTURE.md) - 详细的架构设计和技术实现
- [API 文档](./API.md) - Redux Actions、Selectors 和 Services 文档
- [开发规范](./DEVELOPMENT.md) - 代码风格、开发规范和最佳实践
- [更新日志](./CHANGELOG.md) - 版本历史和功能更新记录
- [组件库文档](./COMPONENT_LIBRARY.md) - UI 组件库使用指南
- [数据层指南](./DATA_LAYER_GUIDE.md) - 数据持久化层使用说明
- [使用示例](./USAGE_EXAMPLES.md) - 组件使用示例代码

---

如需更多支持或有任何问题，请参考项目文档或在仓库中创建 Issue。
