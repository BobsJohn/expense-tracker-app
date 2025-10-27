# 核心应用架构实现文档

本文档说明核心应用架构（导航、主题、国际化）的实现细节。

## 🎯 功能概览

### 1. 导航系统 (React Navigation)

#### 认证栈 (Auth Stack)
- **登录屏幕** (`src/screens/auth/LoginScreen.tsx`)
  - 占位符认证屏幕
  - 点击按钮进入主应用
  - 使用主题化组件和国际化文本

#### 主应用栈 (Main App Stack)
- **底部标签导航** (Bottom Tab Navigator)
  - Transactions（交易）
  - Accounts（账户）
  - Budgets（预算）
  - Reports（报表）
  - Settings（设置）

#### 其他栈屏幕
- AccountDetails（账户详情）
- CategoryManagement（分类管理）
- Export（导出）

### 2. 主题系统

#### 主题配置
- **浅色主题** (`lightTheme`)
  - 白色背景
  - 深色文本
  - 亮色强调色
- **深色主题** (`darkTheme`)
  - 深色背景
  - 浅色文本
  - 调整后的强调色

#### 主题提供者
- **ThemeProvider** (`src/theme/ThemeContext.tsx`)
  - 提供主题上下文
  - 支持主题切换
  - 使用 AsyncStorage 持久化主题偏好

#### 主题 Hook
```typescript
const {theme, themeMode, toggleTheme, setThemeMode} = useTheme();
```

#### 共享组件
- **ScreenContainer** (`src/components/shared/ScreenContainer.tsx`)
  - 提供一致的屏幕容器
  - 自动应用主题背景色
  - 可选的安全区域支持

- **Header** (`src/components/shared/Header.tsx`)
  - 主题化的屏幕标题组件
  - 支持左右操作按钮
  - 支持副标题

- **ThemedStatusBar** (`src/components/common/ThemedStatusBar.tsx`)
  - 根据主题自动调整状态栏样式
  - 深色主题使用浅色内容
  - 浅色主题使用深色内容

### 3. 国际化 (i18n)

#### 支持的语言
- 英文 (en)
- 中文 (zh) ✨ 新增
- 西班牙文 (es)
- 法文 (fr)

#### 翻译文件
- `src/localization/locales/en.json`
- `src/localization/locales/zh.json` ✨ 新增
- `src/localization/locales/es.json`
- `src/localization/locales/fr.json`

#### 语言检测
- 使用 `react-native-localize` 检测设备语言
- 自动选择支持的语言
- 回退到英文

#### 语言切换
- 在设置页面点击"语言"选项
- 循环切换：英文 → 中文 → 西班牙文 → 法文 → 英文
- 实时更新所有屏幕的文本

### 4. Provider 层级结构

```
<GestureHandlerRootView>
  <SafeAreaProvider>
    <ThemeProvider> ✨ 新增
      <Redux Provider>
        <AppInitializer>
          <ErrorBoundary>
            <BudgetAlertProvider>
              <ThemedStatusBar /> ✨ 新增
              <AppNavigator />
              <Toast />
            </BudgetAlertProvider>
          </ErrorBoundary>
        </AppInitializer>
      </Redux Provider>
    </ThemeProvider>
  </SafeAreaProvider>
</GestureHandlerRootView>
```

## 🧪 测试步骤

### 测试导航
1. 启动应用
2. 应看到登录屏幕（认证占位符）
3. 点击"进入应用"按钮
4. 进入主应用，显示底部标签栏
5. 点击各个标签页，确认导航正常工作

### 测试主题切换
1. 进入"设置"标签页
2. 找到"主题"选项
3. 切换主题开关
4. 观察以下变化：
   - 背景颜色从白色变为深色（或反之）
   - 文本颜色相应调整
   - 状态栏样式自动改变
   - 导航栏颜色更新
5. 在不同标签页间切换，确认主题应用一致
6. 重启应用，确认主题偏好已保存

### 测试语言切换
1. 进入"设置"标签页
2. 点击"语言"选项
3. 观察语言循环切换：
   - English
   - 中文
   - Español
   - Français
4. 在不同标签页间切换，确认所有文本已翻译
5. 查看以下屏幕的翻译：
   - 登录屏幕
   - 所有标签页标题
   - 设置页面选项
   - 按钮文本

### 测试共享组件
1. 各个屏幕应正确使用 ScreenContainer
2. 背景色应根据主题自动调整
3. 文本颜色应具有良好的对比度
4. Header 组件应显示正确的标题

## 📁 关键文件

### 主题相关
- `src/theme/theme.ts` - 主题配置
- `src/theme/ThemeContext.tsx` - 主题提供者和 Hook
- `src/theme/index.ts` - 主题模块导出

### 国际化相关
- `src/localization/i18n.ts` - i18n 配置
- `src/localization/locales/*.json` - 翻译文件

### 导航相关
- `src/navigation/AppNavigator.tsx` - 导航配置
- `src/screens/auth/LoginScreen.tsx` - 登录屏幕

### 共享组件
- `src/components/shared/ScreenContainer.tsx` - 屏幕容器
- `src/components/shared/Header.tsx` - 标题头部
- `src/components/common/ThemedStatusBar.tsx` - 主题状态栏

### 应用入口
- `src/App.tsx` - 应用根组件，包含所有 Provider

## 🎨 设计原则

1. **一致性**：所有屏幕使用相同的主题系统和组件
2. **可访问性**：确保浅色/深色模式下的文本对比度
3. **可扩展性**：易于添加新的语言和主题
4. **用户体验**：主题和语言偏好持久化存储

## ✅ 验收标准

- ✅ 导航在标签页间正常工作
- ✅ 认证栈显示登录占位符屏幕
- ✅ 主题切换更新整个应用的 UI
- ✅ 语言切换重新渲染所有占位符屏幕的文本
- ✅ 主题偏好在应用重启后保持
- ✅ ScreenContainer 和 Header 组件可在屏幕中使用
- ✅ 所有组件响应主题变化
