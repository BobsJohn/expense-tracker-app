# 环境配置和开发指南

本文档提供了详细的环境配置和开发指南，帮助新开发者从零开始搭建完整的 React Native 开发环境。

## 📋 目录

- [系统要求](#系统要求)
- [开发环境安装](#开发环境安装)
- [项目初始化步骤](#项目初始化步骤)
- [环境变量配置](#环境变量配置)
- [常见问题和解决方案](#常见问题和解决方案)
- [开发工作流](#开发工作流)
- [构建和打包](#构建和打包)
- [性能优化建议](#性能优化建议)
- [故障排查指南](#故障排查指南)
- [附录](#附录)

---

## 系统要求

### macOS 开发环境（iOS 开发必需）

| 软件 | 最低版本 | 推荐版本 | 说明 |
|------|---------|---------|------|
| macOS | 12.0+ (Monterey) | 13.0+ (Ventura) | iOS 开发必需 macOS 系统 |
| Xcode | 14.0+ | 15.0+ | iOS 开发必需 |
| Command Line Tools | 对应 Xcode 版本 | 最新版 | Xcode 配套工具 |
| Node.js | 16.x | 18.x LTS | JavaScript 运行时 |
| npm | 8.x+ | 9.x+ | 包管理器 |
| Yarn | 1.22.x | 1.22.x（可选） | 备选包管理器 |
| CocoaPods | 1.12.0+ | 1.14.0+ | iOS 依赖管理 |
| Watchman | 4.9.0+ | 最新版 | 文件监控工具 |
| Ruby | 2.7.0+ | 3.0.0+ | CocoaPods 依赖 |
| iOS Simulator | iOS 15.0+ | iOS 17.0+ | 模拟器最低版本 |

### Android 开发环境（可选）

| 软件 | 版本要求 | 说明 |
|------|---------|------|
| Android Studio | 2022.1.1+ | Android 开发 IDE |
| Android SDK | API 31+ | 目标 Android 12+ |
| JDK | 11.x | Java 开发工具包 |

### 硬件要求

- **最低配置**：
  - CPU：Intel Core i5 或同等 Apple Silicon (M1)
  - 内存：8GB RAM
  - 磁盘：20GB 可用空间

- **推荐配置**：
  - CPU：Intel Core i7 或 Apple Silicon (M1/M2/M3)
  - 内存：16GB+ RAM
  - 磁盘：50GB+ 可用空间（SSD 推荐）

---

## 开发环境安装

### 1. 基础环境

#### 1.1 安装 Homebrew

Homebrew 是 macOS 的包管理器，用于安装开发工具。

```bash
# 安装 Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 验证安装
brew --version

# 更新 Homebrew
brew update
```

#### 1.2 安装 Node.js

**方式一：使用 nvm（推荐）**

nvm（Node Version Manager）允许在同一台机器上管理多个 Node.js 版本。

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# 重启终端或执行
source ~/.zshrc  # 如果使用 zsh
# 或
source ~/.bash_profile  # 如果使用 bash

# 验证 nvm 安装
nvm --version

# 安装 Node.js LTS 版本
nvm install 18
nvm use 18
nvm alias default 18

# 验证安装
node --version  # 应显示 v18.x.x
npm --version   # 应显示 9.x.x 或更高
```

**方式二：使用 Homebrew**

```bash
# 安装 Node.js
brew install node@18

# 验证安装
node --version
npm --version
```

#### 1.3 安装 Watchman

Watchman 是 Facebook 开发的文件监控工具，用于提高 React Native 开发效率。

```bash
# 安装 Watchman
brew install watchman

# 验证安装
watchman --version
```

#### 1.4 安装 CocoaPods

CocoaPods 是 iOS 的依赖管理工具。

```bash
# 确保 Ruby 已安装（macOS 自带）
ruby --version

# 安装 CocoaPods
sudo gem install cocoapods

# 或使用 Homebrew 安装（推荐）
brew install cocoapods

# 验证安装
pod --version

# 设置 CocoaPods
pod setup
```

**CocoaPods 配置优化（可选）**

```bash
# 切换到国内镜像源（加速下载）
cd ~/.cocoapods/repos
pod repo remove master
git clone https://mirrors.tuna.tsinghua.edu.cn/git/CocoaPods/Specs.git master

# 或使用清华源
pod repo add master https://mirrors.tuna.tsinghua.edu.cn/git/CocoaPods/Specs.git
```

#### 1.5 安装 Xcode

Xcode 是 iOS 开发的官方 IDE。

**安装步骤：**

1. 从 Mac App Store 下载并安装 Xcode（约 12GB，需要一段时间）
2. 打开 Xcode，接受许可协议
3. 等待 Xcode 安装额外组件

**安装 Command Line Tools：**

```bash
# 安装 Xcode Command Line Tools
xcode-select --install

# 验证安装
xcode-select --print-path
# 应输出：/Applications/Xcode.app/Contents/Developer

# 切换 Command Line Tools 版本（如有需要）
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

**配置 Xcode：**

```bash
# 同意 Xcode 许可协议
sudo xcodebuild -license accept

# 验证 Xcode 安装
xcodebuild -version
```

#### 1.6 配置 iOS 模拟器

```bash
# 列出所有可用的模拟器
xcrun simctl list devices

# 创建新模拟器（可选）
xcrun simctl create "iPhone 15 Pro" "iPhone 15 Pro" "iOS17.0"

# 启动模拟器
open -a Simulator

# 或指定设备启动
xcrun simctl boot "iPhone 15 Pro"
```

**推荐安装的模拟器：**
- iPhone 15 Pro (iOS 17.0+)
- iPhone 14 (iOS 16.0+)
- iPad Pro 12.9-inch (iOS 17.0+)

### 2. React Native 环境

#### 2.1 React Native CLI

本项目使用 React Native CLI（而非 Expo），需要完整的原生开发环境。

```bash
# 全局安装 React Native CLI
npm install -g react-native-cli

# 验证安装
react-native --version
```

#### 2.2 iOS 开发环境验证

运行 React Native 官方环境检查工具：

```bash
# 安装环境检查工具
npm install -g @react-native-community/cli

# 检查环境
npx react-native doctor

# 输出示例：
# ✓ Node.js
# ✓ npm
# ✓ Watchman
# ✓ Xcode
# ✓ CocoaPods
# ✓ iOS Simulator
```

### 3. 开发工具推荐

#### 3.1 Visual Studio Code

**安装 VS Code：**

```bash
# 使用 Homebrew 安装
brew install --cask visual-studio-code

# 或从官网下载安装
# https://code.visualstudio.com/
```

**推荐插件列表：**

| 插件名称 | 功能 | 必需性 |
|---------|------|-------|
| ES7+ React/Redux/React-Native snippets | React Native 代码片段 | 必需 |
| React Native Tools | React Native 调试和智能感知 | 必需 |
| ESLint | 代码质量检查 | 必需 |
| Prettier - Code formatter | 代码格式化 | 必需 |
| TypeScript and JavaScript Language Features | TypeScript 支持 | 必需 |
| GitLens | Git 增强功能 | 推荐 |
| Auto Rename Tag | 自动重命名标签 | 推荐 |
| Bracket Pair Colorizer | 括号高亮 | 推荐 |
| Path Intellisense | 路径自动完成 | 推荐 |
| TODO Highlight | TODO 注释高亮 | 推荐 |
| Import Cost | 显示导入包大小 | 推荐 |
| Color Highlight | 颜色值高亮显示 | 可选 |

**安装插件：**

```bash
# 通过命令行安装推荐插件
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension msjsdiag.vscode-react-native
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension eamodio.gitlens
```

**VS Code 配置（.vscode/settings.json）：**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.associations": {
    "*.tsx": "typescriptreact"
  },
  "emmet.includeLanguages": {
    "typescript": "typescriptreact"
  }
}
```

#### 3.2 React Native Debugger

独立的调试工具，集成 Redux DevTools 和 React DevTools。

```bash
# 使用 Homebrew 安装
brew install --cask react-native-debugger

# 或从 GitHub 下载
# https://github.com/jhen0409/react-native-debugger/releases
```

**使用方法：**

1. 启动 React Native Debugger（默认端口 8081）
2. 在应用中打开调试菜单（Cmd+D）
3. 选择 "Debug"

#### 3.3 Flipper 调试器

Meta 官方开发的移动应用调试平台。

```bash
# 使用 Homebrew 安装
brew install --cask flipper

# 或从官网下载
# https://fbflipper.com/
```

**Flipper 功能：**
- 📱 查看应用布局层次结构
- 🗄️ 检查数据库内容（SQLite）
- 🌐 网络请求监控
- 📊 Redux state 查看
- 📝 日志查看
- 🎨 设计工具（测量、网格）
- ⚡ 性能分析

**配置 Flipper（React Native 0.62+）：**

项目已自动集成 Flipper 支持，无需额外配置。启动应用后，Flipper 会自动检测并连接。

#### 3.4 其他实用工具

```bash
# Charles Proxy（网络抓包工具）
brew install --cask charles

# Postman（API 测试工具）
brew install --cask postman

# iTerm2（终端增强工具）
brew install --cask iterm2

# Fork（Git GUI 客户端）
brew install --cask fork
```

---

## 项目初始化步骤

### 1. 克隆仓库

```bash
# 克隆项目仓库
git clone https://github.com/your-username/expense-tracker-app.git
cd expense-tracker-app

# 查看当前分支
git branch

# 切换到开发分支（如有）
git checkout develop
```

### 2. 安装项目依赖

```bash
# 使用 npm 安装依赖
npm install

# 或使用 yarn（可选）
yarn install

# 验证安装
npm list --depth=0
```

**常见依赖安装问题：**

```bash
# 如果遇到权限问题
sudo npm install

# 如果遇到网络问题，切换国内镜像
npm config set registry https://registry.npmmirror.com
npm install

# 恢复官方镜像
npm config set registry https://registry.npmjs.org

# 清理 npm 缓存（如遇到问题）
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 3. 初始化 iOS 原生依赖

React Native 0.60+ 使用自动链接，但仍需要安装 Pod 依赖。

```bash
# 进入 ios 目录
cd ios

# 安装 CocoaPods 依赖
pod install

# 如果遇到问题，尝试更新 repo
pod repo update
pod install

# 返回项目根目录
cd ..
```

**初始化 iOS 项目（如果 ios 目录不存在）：**

```bash
# 在项目根目录执行
npx react-native init FinancialBudgetApp --template react-native-template-typescript

# 或手动创建 iOS 项目
cd ios
npx react-native init-ios-project
cd ..
```

### 4. 配置环境变量

复制环境变量模板并配置：

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件
nano .env
# 或使用 VS Code
code .env
```

**.env 文件示例：**

```env
# 应用环境
NODE_ENV=development

# API 配置
API_BASE_URL=https://api.example.com
API_TIMEOUT=10000

# 功能开关
ENABLE_FLIPPER=true
ENABLE_DEV_MENU=true
ENABLE_REDUX_LOGGER=true

# 日志级别
LOG_LEVEL=debug

# 数据库配置
DB_NAME=financial_budget.db
DB_VERSION=1

# 分析工具（可选）
ANALYTICS_ENABLED=false
SENTRY_DSN=

# 测试配置
TEST_MODE=false
MOCK_API=false
```

### 5. 验证项目配置

```bash
# 类型检查
npm run typecheck

# 代码检查
npm run lint

# 运行测试
npm test

# 所有检查通过后，继续下一步
```

### 6. 启动开发服务器

在终端中启动 Metro bundler：

```bash
# 启动 Metro bundler
npm start

# 或清除缓存启动（推荐首次运行）
npm start -- --reset-cache
```

**Metro bundler 应显示：**
```
 ██████╗ ███████╗ █████╗  ██████╗████████╗    ███╗   ██╗ █████╗ ████████╗██╗██╗   ██╗███████╗
 ██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝    ████╗  ██║██╔══██╗╚══██╔══╝██║██║   ██║██╔════╝
 ██████╔╝█████╗  ███████║██║        ██║       ██╔██╗ ██║███████║   ██║   ██║██║   ██║█████╗
 ██╔══██╗██╔══╝  ██╔══██║██║        ██║       ██║╚██╗██║██╔══██║   ██║   ██║╚██╗ ██╔╝██╔══╝
 ██║  ██║███████╗██║  ██║╚██████╗   ██║       ██║ ╚████║██║  ██║   ██║   ██║ ╚████╔╝ ███████╗
 ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝   ╚═╝       ╚═╝  ╚═══╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═══╝  ╚══════╝

Welcome to Metro!
```

### 7. 运行 iOS 应用

**打开新终端窗口**，运行以下命令：

```bash
# 方式一：使用 npm script（默认模拟器）
npm run ios

# 方式二：指定模拟器设备
npm run ios -- --simulator="iPhone 15 Pro"

# 方式三：使用 React Native CLI
npx react-native run-ios

# 方式四：指定设备 UDID（真机）
npx react-native run-ios --device "Your iPhone Name"

# 列出所有可用设备
xcrun simctl list devices
```

**首次运行可能需要较长时间（5-10 分钟）**，包括：
- 编译原生代码
- 下载依赖
- 构建 JavaScript bundle

**成功启动后应看到：**
```
info Found Xcode workspace "FinancialBudgetApp.xcworkspace"
info Building (using "xcodebuild -workspace FinancialBudgetApp.xcworkspace -configuration Debug -scheme FinancialBudgetApp -destination id=...")
info Launching "org.reactjs.native.example.FinancialBudgetApp"
success Successfully launched app on the simulator
```

### 8. 验证应用运行

应用启动后，验证以下功能：

- ✅ 应用正常加载
- ✅ 可以看到欢迎屏幕或主界面
- ✅ 底部导航栏可见
- ✅ 可以切换不同标签页
- ✅ 热重载（Hot Reload）工作正常

**测试热重载：**

1. 打开 `src/screens/Dashboard/DashboardScreen.tsx`
2. 修改一些文本内容
3. 保存文件（Cmd+S）
4. 应用应自动刷新，显示新内容

---

## 环境变量配置

### 环境变量文件说明

项目支持多环境配置：

| 文件 | 用途 | 提交到版本库 |
|------|------|------------|
| `.env` | 本地开发环境变量 | ❌ 否 |
| `.env.example` | 环境变量模板 | ✅ 是 |
| `.env.development` | 开发环境配置 | ✅ 是（不含敏感信息） |
| `.env.production` | 生产环境配置 | ❌ 否 |
| `.env.test` | 测试环境配置 | ✅ 是 |

### 环境变量详细说明

#### 应用配置

```env
# 应用名称（用于显示）
APP_NAME=财务预算管理应用

# 应用环境：development | staging | production
NODE_ENV=development

# 应用版本（与 package.json 同步）
APP_VERSION=1.0.0

# Bundle ID（iOS）/ Package Name（Android）
BUNDLE_ID=com.example.financialbudgetapp
```

#### API 配置

```env
# API 基础 URL
API_BASE_URL=https://api.example.com

# API 超时时间（毫秒）
API_TIMEOUT=10000

# API 密钥（如需要）
API_KEY=your_api_key_here

# API 版本
API_VERSION=v1
```

#### 功能开关

```env
# 启用 Flipper 调试器（仅开发环境）
ENABLE_FLIPPER=true

# 启用开发菜单
ENABLE_DEV_MENU=true

# 启用 Redux Logger（仅开发环境）
ENABLE_REDUX_LOGGER=true

# 启用性能监控
ENABLE_PERFORMANCE_MONITORING=false
```

#### 数据库配置

```env
# 数据库名称
DB_NAME=financial_budget.db

# 数据库版本
DB_VERSION=1

# 数据库位置（可选）
DB_LOCATION=default
```

#### 第三方服务（可选）

```env
# Sentry（错误追踪）
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=development

# Google Analytics（分析）
GA_TRACKING_ID=UA-XXXXXXXXX-X

# Firebase（推送通知）
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_PROJECT_ID=your_project_id
```

#### 测试配置

```env
# 测试模式
TEST_MODE=false

# 模拟 API 响应
MOCK_API=false

# E2E 测试配置
E2E_BASE_URL=http://localhost:8081
```

### 开发环境 vs 生产环境

**开发环境配置（.env.development）：**

```env
NODE_ENV=development
API_BASE_URL=https://dev-api.example.com
ENABLE_FLIPPER=true
ENABLE_DEV_MENU=true
ENABLE_REDUX_LOGGER=true
LOG_LEVEL=debug
```

**生产环境配置（.env.production）：**

```env
NODE_ENV=production
API_BASE_URL=https://api.example.com
ENABLE_FLIPPER=false
ENABLE_DEV_MENU=false
ENABLE_REDUX_LOGGER=false
LOG_LEVEL=error
```

### 敏感信息管理建议

⚠️ **绝对不要将敏感信息提交到版本库！**

**敏感信息包括：**
- API 密钥和令牌
- 数据库密码
- 第三方服务凭证
- 加密密钥
- 证书私钥

**最佳实践：**

1. **使用 .env.example 作为模板**：
   ```env
   # .env.example
   API_KEY=your_api_key_here
   DB_PASSWORD=your_password_here
   ```

2. **确保 .env 在 .gitignore 中**：
   ```gitignore
   # .gitignore
   .env
   .env.local
   .env.production
   ```

3. **使用环境变量管理服务**（生产环境）：
   - AWS Secrets Manager
   - HashiCorp Vault
   - Azure Key Vault
   - Google Cloud Secret Manager

4. **团队成员之间安全共享**：
   - 使用 1Password、LastPass 等密码管理器
   - 通过加密通道传输
   - 避免通过邮件或即时通讯明文发送

### 访问环境变量

在代码中访问环境变量：

```typescript
// src/config/env.ts
import Config from 'react-native-config';

export const ENV = {
  apiBaseUrl: Config.API_BASE_URL || 'https://api.example.com',
  apiTimeout: parseInt(Config.API_TIMEOUT || '10000', 10),
  enableFlipper: Config.ENABLE_FLIPPER === 'true',
  logLevel: Config.LOG_LEVEL || 'info',
};

// 使用示例
import { ENV } from '@/config/env';

const response = await fetch(`${ENV.apiBaseUrl}/users`, {
  timeout: ENV.apiTimeout,
});
```

---

## 常见问题和解决方案

### Metro Bundler 问题

#### 问题 1：端口 8081 已被占用

**症状：**
```
error: Port 8081 already in use
```

**解决方案：**

```bash
# 方案一：杀死占用端口的进程
lsof -ti:8081 | xargs kill -9

# 方案二：使用其他端口
npm start -- --port=8082

# 方案三：找出并手动关闭占用进程
lsof -i :8081
kill -9 <PID>
```

#### 问题 2：Metro bundler 缓存问题

**症状：**
- 代码修改后不生效
- 应用显示旧内容
- 构建错误但代码已修复

**解决方案：**

```bash
# 方案一：清除 Metro 缓存
npm start -- --reset-cache

# 方案二：清除所有缓存
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
npm start -- --reset-cache

# 方案三：完全重置项目
npm run clean  # 如果有清理脚本
rm -rf node_modules
rm -rf ios/Pods ios/build
npm install
cd ios && pod install && cd ..
npm start -- --reset-cache
```

#### 问题 3：Watchman 问题

**症状：**
```
Watchman error: too many pending cache jobs
```

**解决方案：**

```bash
# 停止 Watchman
watchman shutdown-server

# 清除 Watchman 缓存
watchman watch-del-all

# 重启 Metro bundler
npm start
```

### 依赖安装问题

#### 问题 4：npm install 失败

**症状：**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**解决方案：**

```bash
# 方案一：使用 --legacy-peer-deps
npm install --legacy-peer-deps

# 方案二：使用 --force（不推荐）
npm install --force

# 方案三：清理后重装
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### 问题 5：CocoaPods 安装失败

**症状：**
```
[!] Unable to find a specification for ...
```

**解决方案：**

```bash
# 更新 CocoaPods repo
cd ios
pod repo update
pod install

# 如果仍然失败，尝试清理
pod cache clean --all
rm -rf Pods Podfile.lock
pod install

# 使用 Rosetta（Apple Silicon Mac）
arch -x86_64 pod install
```

### Xcode 构建问题

#### 问题 6：Xcode 构建失败

**症状：**
```
error: Build input file cannot be found: ...
```

**解决方案：**

```bash
# 方案一：清理 Xcode 构建缓存
cd ios
xcodebuild clean
cd ..

# 方案二：重新安装 Pods
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install
cd ..

# 方案三：删除 DerivedData
rm -rf ~/Library/Developer/Xcode/DerivedData
```

#### 问题 7：Code Signing 错误

**症状：**
```
Code signing is required for product type 'Application' in SDK 'iOS 16.0'
```

**解决方案：**

1. 打开 `ios/FinancialBudgetApp.xcworkspace`
2. 选择项目 → Targets → FinancialBudgetApp
3. 签名 & 能力（Signing & Capabilities）标签
4. 勾选 "Automatically manage signing"
5. 选择你的 Team（需要 Apple Developer 账号）

**临时解决方案（仅开发）：**

```bash
# 使用个人 Team 签名
open ios/FinancialBudgetApp.xcworkspace
# 在 Xcode 中选择个人 Team
```

### 模拟器问题

#### 问题 8：模拟器启动失败

**症状：**
```
Unable to boot the Simulator
```

**解决方案：**

```bash
# 方案一：重启模拟器
killall Simulator
open -a Simulator

# 方案二：重置模拟器
xcrun simctl erase all

# 方案三：删除并重新创建模拟器
xcrun simctl delete unavailable
xcrun simctl list devices
```

#### 问题 9：应用未显示在模拟器中

**症状：**
- 构建成功但模拟器没有显示应用

**解决方案：**

```bash
# 卸载应用
xcrun simctl uninstall booted com.example.financialbudgetapp

# 重新安装
npm run ios
```

### 应用运行时问题

#### 问题 10：Red Screen 错误

**症状：**
- 应用显示红色错误屏幕

**解决方案：**

1. **仔细阅读错误信息**（最重要！）
2. **检查堆栈跟踪**，定位出错文件
3. **常见原因**：
   - 语法错误
   - 未定义的变量
   - 导入路径错误
   - 类型错误

```bash
# 重启应用
按 Cmd+R 重新加载

# 清除缓存重启
npm start -- --reset-cache
```

#### 问题 11：White/Blank Screen

**症状：**
- 应用启动后显示空白屏幕

**解决方案：**

```bash
# 检查 Metro bundler 日志
# 查看终端输出，寻找错误信息

# 检查原生日志
npx react-native log-ios

# 验证入口文件
cat index.js
# 确保正确导入和注册应用

# 重置应用
rm -rf ios/build
npm run ios
```

### 数据库问题

#### 问题 12：SQLite 数据库错误

**症状：**
```
Error: Unable to open database
```

**解决方案：**

```bash
# 重置应用数据
xcrun simctl privacy booted reset all com.example.financialbudgetapp

# 或卸载重装应用
xcrun simctl uninstall booted com.example.financialbudgetapp
npm run ios
```

### 缓存清理命令汇总

```bash
# 全面清理脚本（创建 scripts/clean.sh）
#!/bin/bash

echo "🧹 清理项目缓存..."

# 清理 npm 缓存
echo "清理 npm..."
rm -rf node_modules
rm -rf package-lock.json
npm cache clean --force

# 清理 Metro bundler 缓存
echo "清理 Metro..."
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-map-*

# 清理 Watchman 缓存
echo "清理 Watchman..."
watchman watch-del-all

# 清理 iOS 缓存
echo "清理 iOS..."
cd ios
rm -rf Pods
rm -rf Podfile.lock
rm -rf build
rm -rf ~/Library/Developer/Xcode/DerivedData
cd ..

# 重新安装
echo "重新安装依赖..."
npm install
cd ios && pod install && cd ..

echo "✅ 清理完成！"
```

**使用方法：**

```bash
chmod +x scripts/clean.sh
./scripts/clean.sh
```

---

## 开发工作流

### 日常开发流程

#### 1. 启动项目

每天开始开发时的标准流程：

```bash
# 步骤 1：进入项目目录
cd expense-tracker-app

# 步骤 2：拉取最新代码
git pull origin develop

# 步骤 3：更新依赖（如有 package.json 变更）
npm install
cd ios && pod install && cd ..  # 如有原生依赖变更

# 步骤 4：启动 Metro bundler（终端 1）
npm start

# 步骤 5：运行应用（终端 2）
npm run ios
```

#### 2. 热重载（Hot Reload）

React Native 支持快速刷新（Fast Refresh），代码保存后自动更新。

**启用快速刷新：**
- 在模拟器中按 `Cmd+D`（iOS）
- 选择 "Enable Fast Refresh"

**手动刷新：**
- 按 `Cmd+R`（iOS）重新加载应用

**完全重置：**
- 按 `Cmd+D` → "Reload" 或 "Debug" → "Reload"

#### 3. 调试方法

##### 3.1 使用 Console.log

```typescript
// 基本日志
console.log('用户信息:', user);

// 分组日志
console.group('账户操作');
console.log('账户ID:', accountId);
console.log('余额:', balance);
console.groupEnd();

// 表格显示
console.table(accounts);

// 性能测试
console.time('fetchData');
await fetchData();
console.timeEnd('fetchData');
```

**查看日志：**

```bash
# iOS 系统日志
npx react-native log-ios

# 过滤日志
npx react-native log-ios | grep "账户"
```

##### 3.2 使用 React DevTools

```bash
# 安装 React DevTools
npm install -g react-devtools

# 启动 React DevTools
npx react-devtools

# 在应用中连接（应自动连接）
# Cmd+D → "Toggle Inspector"
```

**功能：**
- 查看组件层次结构
- 检查 props 和 state
- 修改 props 实时查看效果
- 性能分析

##### 3.3 使用 Redux DevTools

通过 React Native Debugger 或 Flipper 查看 Redux state。

**在代码中使用：**

```typescript
// 在 store 配置中启用 Redux DevTools
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: rootReducer,
  devTools: __DEV__, // 仅开发环境启用
});
```

##### 3.4 使用断点调试

**Chrome DevTools 调试：**

1. 在模拟器中按 `Cmd+D`
2. 选择 "Debug"
3. Chrome 会自动打开调试窗口
4. 在 Sources 面板设置断点
5. 触发相应操作，执行会在断点处暂停

**VS Code 调试：**

创建 `.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Attach to packager",
      "cwd": "${workspaceFolder}",
      "type": "reactnative",
      "request": "attach"
    },
    {
      "name": "Debug iOS",
      "cwd": "${workspaceFolder}",
      "type": "reactnative",
      "request": "launch",
      "platform": "ios"
    }
  ]
}
```

**使用方法：**
1. 按 `F5` 或点击调试按钮
2. 选择 "Debug iOS"
3. 在代码中设置断点
4. 正常使用应用，执行会在断点处暂停

##### 3.5 网络请求调试

**使用 Flipper：**
1. 启动 Flipper
2. 连接到应用
3. 打开 "Network" 插件
4. 查看所有网络请求和响应

**使用 Charles Proxy：**
1. 启动 Charles
2. 配置模拟器代理（自动）
3. 捕获所有 HTTP/HTTPS 流量

#### 4. 运行测试

##### 4.1 单元测试

```bash
# 运行所有测试
npm test

# 监听模式（自动重新运行）
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# 运行特定测试文件
npm test -- AccountRepository.test.ts

# 运行匹配模式的测试
npm test -- --testNamePattern="应该创建账户"
```

##### 4.2 集成测试

```bash
# 运行集成测试
npm test -- --testPathPattern=integration

# 运行端到端测试
npm run test:e2e
```

##### 4.3 查看测试覆盖率

```bash
npm run test:coverage

# 在浏览器中查看详细报告
open coverage/lcov-report/index.html
```

**覆盖率目标：**
- 行覆盖率：≥ 80%
- 分支覆盖率：≥ 75%
- 函数覆盖率：≥ 80%
- 语句覆盖率：≥ 80%

#### 5. 代码质量检查

##### 5.1 ESLint 检查

```bash
# 运行 ESLint
npm run lint

# 自动修复可修复的问题
npm run lint -- --fix

# 检查特定文件
npm run lint -- src/components/Button.tsx

# 检查特定目录
npm run lint -- src/components/
```

##### 5.2 TypeScript 类型检查

```bash
# 运行类型检查
npm run typecheck

# 监听模式
npm run typecheck -- --watch
```

##### 5.3 代码格式化

```bash
# 使用 Prettier 格式化所有文件
npx prettier --write .

# 格式化特定目录
npx prettier --write "src/**/*.{ts,tsx}"

# 检查格式（不修改）
npx prettier --check .
```

##### 5.4 提交前检查

建议配置 Git hooks 自动检查：

**安装 husky 和 lint-staged：**

```bash
npm install --save-dev husky lint-staged

# 初始化 husky
npx husky install

# 添加 pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

**配置 lint-staged（package.json）：**

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "npm run typecheck"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

#### 6. Git 工作流

##### 6.1 创建功能分支

```bash
# 从 develop 分支创建新分支
git checkout develop
git pull origin develop
git checkout -b feature/account-management

# 分支命名规范：
# feature/功能名称    - 新功能
# bugfix/问题描述     - 问题修复
# hotfix/紧急修复     - 紧急修复
# refactor/重构内容   - 代码重构
# docs/文档更新       - 文档更新
```

##### 6.2 提交代码

```bash
# 查看修改
git status
git diff

# 添加文件
git add src/components/AccountCard.tsx

# 或添加所有修改
git add .

# 提交（使用语义化提交信息）
git commit -m "feat: 添加账户卡片组件"
```

**提交信息规范：**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型（type）：**
- `feat`: 新功能
- `fix`: 问题修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例：**

```bash
git commit -m "feat(accounts): 添加账户余额显示功能"
git commit -m "fix(transactions): 修复交易日期格式化问题"
git commit -m "docs(readme): 更新安装说明"
```

##### 6.3 推送代码

```bash
# 首次推送
git push -u origin feature/account-management

# 后续推送
git push
```

##### 6.4 创建 Pull Request

1. 在 GitHub/GitLab 上创建 Pull Request
2. 填写 PR 描述：
   - 改动内容
   - 测试方法
   - 截图（如有 UI 变更）
   - 相关 Issue 链接

3. 请求代码审查
4. 根据反馈修改代码
5. 合并到主分支

#### 7. 性能监控

##### 7.1 使用 Flipper 性能分析

1. 打开 Flipper
2. 选择 "Layout" 插件
3. 查看组件渲染性能
4. 识别性能瓶颈

##### 7.2 使用 React Profiler

```typescript
import { Profiler } from 'react';

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number,
) {
  console.log(`${id} ${phase} phase:`);
  console.log(`Actual duration: ${actualDuration}ms`);
}

<Profiler id="AccountList" onRender={onRenderCallback}>
  <AccountList />
</Profiler>
```

---

## 构建和打包

### 开发版本构建

#### iOS 开发构建

```bash
# 方式一：使用 npm script
npm run ios

# 方式二：指定配置
npm run ios -- --configuration Debug

# 方式三：使用 xcodebuild
cd ios
xcodebuild -workspace FinancialBudgetApp.xcworkspace \
           -scheme FinancialBudgetApp \
           -configuration Debug \
           -destination 'platform=iOS Simulator,name=iPhone 15 Pro' \
           build
```

### 生产版本构建

#### iOS 生产构建

##### 1. 准备工作

**1.1 配置 App Icon**

1. 准备各尺寸图标（使用 [App Icon Generator](https://appicon.co/)）
2. 将图标放入 `ios/FinancialBudgetApp/Images.xcassets/AppIcon.appiconset/`

**1.2 配置启动屏幕**

1. 编辑 `ios/FinancialBudgetApp/LaunchScreen.storyboard`
2. 或使用自定义启动图片

**1.3 更新版本号**

编辑 `ios/FinancialBudgetApp/Info.plist`：

```xml
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>1</string>
```

或使用命令：

```bash
cd ios
agvtool new-marketing-version 1.0.0
agvtool new-version -all 1
```

##### 2. 构建 Release 版本

**方式一：使用 Xcode（推荐）**

1. 打开 `ios/FinancialBudgetApp.xcworkspace`
2. 选择菜单：Product → Scheme → Edit Scheme
3. 在 Run 下，将 Build Configuration 改为 Release
4. 选择真机或 Generic iOS Device
5. 选择菜单：Product → Archive
6. 等待构建完成

**方式二：使用命令行**

```bash
cd ios

# 清理构建
xcodebuild clean

# 构建 Archive
xcodebuild archive \
  -workspace FinancialBudgetApp.xcworkspace \
  -scheme FinancialBudgetApp \
  -configuration Release \
  -archivePath build/FinancialBudgetApp.xcarchive \
  CODE_SIGN_IDENTITY="iPhone Distribution" \
  PROVISIONING_PROFILE_SPECIFIER="YourProvisioningProfile"

# 导出 IPA
xcodebuild -exportArchive \
  -archivePath build/FinancialBudgetApp.xcarchive \
  -exportPath build \
  -exportOptionsPlist ExportOptions.plist
```

**ExportOptions.plist 示例：**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    <key>uploadSymbols</key>
    <true/>
    <key>compileBitcode</key>
    <false/>
</dict>
</plist>
```

##### 3. 签名和证书配置

**3.1 创建 App ID**

1. 登录 [Apple Developer Center](https://developer.apple.com/account)
2. Certificates, Identifiers & Profiles → Identifiers
3. 点击 "+" 创建新 App ID
4. 输入 Bundle ID：`com.example.financialbudgetapp`
5. 配置需要的能力（Capabilities）

**3.2 创建证书**

```bash
# 生成证书请求文件
# 在钥匙串访问中：证书助理 → 从证书颁发机构请求证书

# 在 Apple Developer 中上传 CSR 文件生成证书
# 下载证书并双击安装
```

**3.3 创建 Provisioning Profile**

1. 在 Apple Developer 中创建 Provisioning Profile
2. 选择 App ID 和证书
3. 选择设备（Development）或分发类型（Distribution）
4. 下载 Profile 并双击安装

**3.4 在 Xcode 中配置**

1. 打开项目设置
2. Signing & Capabilities 标签
3. 取消 "Automatically manage signing"（如需手动管理）
4. 选择正确的 Provisioning Profile

##### 4. TestFlight 测试

**4.1 上传到 App Store Connect**

使用 Xcode Organizer：

1. 构建完成后，打开 Window → Organizer
2. 选择刚才的 Archive
3. 点击 "Distribute App"
4. 选择 "App Store Connect"
5. 上传应用

使用命令行工具：

```bash
# 使用 altool 上传
xcrun altool --upload-app \
  -f build/FinancialBudgetApp.ipa \
  -t ios \
  -u your@email.com \
  -p your-app-specific-password

# 使用 Transporter（推荐）
# 下载 Transporter 应用，拖入 IPA 文件上传
```

**4.2 配置 TestFlight**

1. 登录 [App Store Connect](https://appstoreconnect.apple.com)
2. 选择应用
3. TestFlight 标签
4. 添加内部测试员
5. 添加外部测试员（需审核）
6. 配置测试信息

**4.3 邀请测试员**

```bash
# 测试员会收到邀请邮件
# 安装 TestFlight 应用
# 接受邀请并安装测试版本
```

##### 5. App Store 发布

**5.1 准备应用信息**

在 App Store Connect 中填写：

- 应用名称
- 副标题
- 描述
- 关键词
- 支持 URL
- 隐私政策 URL
- 应用类别
- 截图（各尺寸）
- 预览视频（可选）

**5.2 提交审核**

1. 完成所有必填信息
2. 选择构建版本
3. 填写版本发布说明
4. 配置价格和上架地区
5. 提交审核

**5.3 审核时间**

- 通常 24-48 小时
- 首次提交可能更长
- 被拒绝后重新提交约 24 小时

**5.4 常见拒绝原因**

- 应用崩溃或严重 bug
- 缺少功能或内容
- 隐私政策不完整
- 元数据不准确
- 违反审核指南

### 自动化构建

#### 使用 Fastlane（推荐）

**1. 安装 Fastlane**

```bash
# 使用 Homebrew
brew install fastlane

# 或使用 RubyGems
sudo gem install fastlane

# 验证安装
fastlane --version
```

**2. 初始化 Fastlane**

```bash
cd ios
fastlane init

# 选择配置类型：
# 1. Automate screenshots
# 2. Automate beta distribution to TestFlight
# 3. Automate App Store distribution
# 4. Manual setup
```

**3. 配置 Fastfile**

```ruby
# ios/fastlane/Fastfile

default_platform(:ios)

platform :ios do
  desc "Push a new beta build to TestFlight"
  lane :beta do
    increment_build_number(xcodeproj: "FinancialBudgetApp.xcodeproj")
    build_app(workspace: "FinancialBudgetApp.xcworkspace",
              scheme: "FinancialBudgetApp")
    upload_to_testflight
  end

  desc "Push a new release build to the App Store"
  lane :release do
    increment_version_number(
      version_number: "1.0.0"
    )
    build_app(workspace: "FinancialBudgetApp.xcworkspace",
              scheme: "FinancialBudgetApp")
    upload_to_app_store
  end

  desc "Run tests"
  lane :test do
    run_tests(workspace: "FinancialBudgetApp.xcworkspace",
              scheme: "FinancialBudgetApp")
  end
end
```

**4. 运行 Fastlane**

```bash
# 发布到 TestFlight
fastlane ios beta

# 发布到 App Store
fastlane ios release

# 运行测试
fastlane ios test
```

#### CI/CD 集成

**GitHub Actions 示例：**

```yaml
# .github/workflows/ios.yml
name: iOS Build

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: macos-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 18
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        npm install
        cd ios && pod install && cd ..
    
    - name: Run tests
      run: npm test
    
    - name: Run linter
      run: npm run lint
    
    - name: Type check
      run: npm run typecheck
    
    - name: Build iOS
      run: |
        cd ios
        xcodebuild -workspace FinancialBudgetApp.xcworkspace \
                   -scheme FinancialBudgetApp \
                   -configuration Release \
                   -destination 'generic/platform=iOS' \
                   -archivePath FinancialBudgetApp.xcarchive \
                   archive
```

---

## 性能优化建议

### 1. 开发时性能优化

#### 1.1 启用 Hermes 引擎

Hermes 是 Facebook 为 React Native 优化的 JavaScript 引擎。

**iOS 配置（ios/Podfile）：**

```ruby
# 确保启用 Hermes
use_react_native!(
  :path => config[:reactNativePath],
  :hermes_enabled => true  # 启用 Hermes
)
```

```bash
# 重新安装 Pods
cd ios
pod install
cd ..
```

**验证 Hermes：**

```typescript
const isHermes = () => !!(global as any).HermesInternal;
console.log('Using Hermes:', isHermes());
```

#### 1.2 组件优化

**使用 React.memo：**

```typescript
import React from 'react';

// 避免不必要的重新渲染
export const AccountCard = React.memo(({ account }) => {
  return (
    <View>
      <Text>{account.name}</Text>
    </View>
  );
}, (prevProps, nextProps) => {
  // 自定义比较函数
  return prevProps.account.id === nextProps.account.id;
});
```

**使用 useMemo 和 useCallback：**

```typescript
import { useMemo, useCallback } from 'react';

function AccountList({ accounts, onSelect }) {
  // 缓存计算结果
  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  }, [accounts]);

  // 缓存回调函数
  const handleSelect = useCallback((accountId: string) => {
    onSelect(accountId);
  }, [onSelect]);

  return (
    <View>
      <Text>总余额: {totalBalance}</Text>
      {accounts.map(account => (
        <AccountItem
          key={account.id}
          account={account}
          onPress={handleSelect}
        />
      ))}
    </View>
  );
}
```

#### 1.3 列表优化

**使用 FlatList 替代 ScrollView：**

```typescript
import { FlatList } from 'react-native';

<FlatList
  data={accounts}
  keyExtractor={item => item.id}
  renderItem={({ item }) => <AccountCard account={item} />}
  // 性能优化配置
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  windowSize={21}
  // 避免重新创建函数
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

#### 1.4 图片优化

```typescript
import { Image } from 'react-native';
import FastImage from 'react-native-fast-image';

// 使用 react-native-fast-image（推荐）
<FastImage
  style={styles.image}
  source={{
    uri: 'https://example.com/image.jpg',
    priority: FastImage.priority.normal,
    cache: FastImage.cacheControl.immutable,
  }}
  resizeMode={FastImage.resizeMode.cover}
/>
```

### 2. 包体积优化

#### 2.1 分析包大小

```bash
# 生成包体积分析报告
npx react-native bundle \
  --platform ios \
  --dev false \
  --entry-file index.js \
  --bundle-output bundle.js \
  --sourcemap-output bundle.map

# 使用 source-map-explorer 分析
npm install -g source-map-explorer
source-map-explorer bundle.js bundle.map
```

#### 2.2 移除未使用的代码

**启用 Tree Shaking：**

确保使用 ES6 模块导入：

```typescript
// ✅ 好 - 支持 Tree Shaking
import { Button } from '@/components';

// ❌ 不好 - 不支持 Tree Shaking
import * as Components from '@/components';
```

#### 2.3 压缩资源

```bash
# 压缩图片
brew install imageoptim-cli
imageoptim --directory ./assets/images

# 或使用在线工具
# https://tinypng.com/
# https://squoosh.app/
```

### 3. 启动速度优化

#### 3.1 延迟加载非关键模块

```typescript
import React, { lazy, Suspense } from 'react';

// 懒加载组件
const Reports = lazy(() => import('./screens/Reports'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Reports />
    </Suspense>
  );
}
```

#### 3.2 优化启动屏幕

```typescript
import RNBootSplash from 'react-native-bootsplash';

function App() {
  useEffect(() => {
    // 应用准备就绪后隐藏启动屏幕
    const init = async () => {
      await initializeApp();
      await RNBootSplash.hide({ fade: true });
    };
    init();
  }, []);

  return <MainApp />;
}
```

#### 3.3 减少初始化工作

```typescript
// 将非关键初始化延后
useEffect(() => {
  // 关键初始化（立即执行）
  initializeDatabase();
  loadUserPreferences();

  // 非关键初始化（延后执行）
  setTimeout(() => {
    initializeAnalytics();
    checkForUpdates();
  }, 2000);
}, []);
```

### 4. 内存优化

#### 4.1 及时清理监听器

```typescript
useEffect(() => {
  const subscription = eventEmitter.addListener('update', handleUpdate);

  // 清理
  return () => {
    subscription.remove();
  };
}, []);
```

#### 4.2 避免内存泄漏

```typescript
function MyComponent() {
  const [data, setData] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    fetchData().then(result => {
      // 仅在组件仍挂载时更新状态
      if (isMountedRef.current) {
        setData(result);
      }
    });

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return <View>{data && <Text>{data}</Text>}</View>;
}
```

---

## 故障排查指南

### 1. 日志查看

#### iOS 日志

```bash
# 查看 React Native 日志
npx react-native log-ios

# 查看系统日志（详细）
log stream --predicate 'processImagePath contains "FinancialBudgetApp"'

# 使用 Console.app
open /Applications/Utilities/Console.app
```

#### Metro Bundler 日志

```bash
# Metro 日志在启动终端中显示
npm start

# 详细日志
npm start -- --verbose
```

### 2. 常见错误代码

| 错误代码 | 描述 | 解决方案 |
|---------|------|---------|
| `EISDIR` | 目标是目录而非文件 | 检查文件路径 |
| `ENOENT` | 文件或目录不存在 | 确认路径正确，文件存在 |
| `EACCES` | 权限被拒绝 | 使用 sudo 或修改文件权限 |
| `EADDRINUSE` | 端口已被占用 | 杀死占用进程或使用其他端口 |
| `Module not found` | 模块未找到 | 运行 npm install，检查导入路径 |
| `Could not connect to development server` | 无法连接到开发服务器 | 检查 Metro 是否运行，检查端口 |

### 3. 重置项目到干净状态

#### 完全重置脚本

```bash
#!/bin/bash
# scripts/reset.sh

echo "⚠️  警告：这将删除所有缓存和构建文件！"
read -p "确定要继续吗？(y/N) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

echo "🧹 开始重置项目..."

# 1. 清理 Node modules
echo "清理 Node modules..."
rm -rf node_modules
rm -rf package-lock.json
rm -rf yarn.lock

# 2. 清理 npm 缓存
echo "清理 npm 缓存..."
npm cache clean --force

# 3. 清理 Metro bundler 缓存
echo "清理 Metro 缓存..."
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-map-*

# 4. 清理 Watchman
echo "清理 Watchman..."
watchman watch-del-all

# 5. 清理 iOS
echo "清理 iOS..."
cd ios
rm -rf Pods
rm -rf Podfile.lock
rm -rf build
rm -rf ~/Library/Developer/Xcode/DerivedData
cd ..

# 6. 清理 Jest 缓存
echo "清理 Jest 缓存..."
npx jest --clearCache

# 7. 重新安装依赖
echo "重新安装依赖..."
npm install

# 8. 重新安装 iOS 依赖
echo "重新安装 iOS 依赖..."
cd ios
pod install
cd ..

echo "✅ 重置完成！"
echo "现在可以运行: npm start && npm run ios"
```

**使用方法：**

```bash
chmod +x scripts/reset.sh
./scripts/reset.sh
```

#### 快速清理命令

```bash
# 仅清理缓存（不删除依赖）
npm start -- --reset-cache
watchman watch-del-all

# 重建 iOS
cd ios
rm -rf Pods build
pod install
cd ..

# 重新安装依赖
rm -rf node_modules
npm install
```

### 4. 获取帮助

#### 检查文档

```bash
# React Native 官方文档
open https://reactnative.dev/

# 项目文档
cat README.md
cat DEVELOPMENT.md
cat ARCHITECTURE.md
```

#### 检查 GitHub Issues

```bash
# 搜索已知问题
open https://github.com/facebook/react-native/issues
```

#### 社区支持

- Stack Overflow：[react-native] 标签
- Discord：React Native Community
- Reddit：r/reactnative

---

## 附录

### A. 有用的资源链接

#### 官方文档

- [React Native 官方文档](https://reactnative.dev/)
- [React 官方文档](https://react.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Redux Toolkit 文档](https://redux-toolkit.js.org/)
- [React Navigation 文档](https://reactnavigation.org/)

#### 开发工具

- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/)
- [React DevTools](https://react.dev/learn/react-developer-tools)

#### iOS 开发

- [Apple Developer](https://developer.apple.com/)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [TestFlight](https://developer.apple.com/testflight/)
- [Xcode](https://developer.apple.com/xcode/)

#### 学习资源

- [React Native Express](https://www.reactnative.express/)
- [React Native School](https://www.reactnativeschool.com/)
- [Udemy React Native 课程](https://www.udemy.com/topic/react-native/)
- [freeCodeCamp](https://www.freecodecamp.org/)

#### 社区

- [React Native Community](https://github.com/react-native-community)
- [Awesome React Native](https://github.com/jondot/awesome-react-native)
- [React Native Elements](https://reactnativeelements.com/)

### B. 推荐的第三方库

#### UI 组件

| 库名称 | 用途 | GitHub |
|-------|------|--------|
| React Native Paper | Material Design 组件 | [Link](https://github.com/callstack/react-native-paper) |
| React Native Elements | 通用 UI 组件 | [Link](https://github.com/react-native-elements/react-native-elements) |
| NativeBase | 跨平台 UI 组件 | [Link](https://github.com/GeekyAnts/NativeBase) |

#### 工具库

| 库名称 | 用途 | GitHub |
|-------|------|--------|
| date-fns | 日期处理 | [Link](https://github.com/date-fns/date-fns) |
| lodash | 实用工具函数 | [Link](https://github.com/lodash/lodash) |
| axios | HTTP 客户端 | [Link](https://github.com/axios/axios) |

#### 调试工具

| 工具名称 | 用途 | 链接 |
|---------|------|------|
| Reactotron | 调试和监控 | [Link](https://github.com/infinitered/reactotron) |
| react-native-debugger | 独立调试器 | [Link](https://github.com/jhen0409/react-native-debugger) |
| Flipper | Meta 官方调试器 | [Link](https://fbflipper.com/) |

### C. 命令速查表

#### 项目命令

```bash
# 安装依赖
npm install

# 启动 Metro
npm start

# 清除缓存启动
npm start -- --reset-cache

# 运行 iOS
npm run ios

# 运行指定设备
npm run ios -- --simulator="iPhone 15 Pro"

# 运行测试
npm test

# 测试覆盖率
npm run test:coverage

# 代码检查
npm run lint

# 类型检查
npm run typecheck
```

#### iOS 命令

```bash
# 安装 Pods
cd ios && pod install && cd ..

# 更新 Pods
cd ios && pod update && cd ..

# 清理构建
cd ios && xcodebuild clean && cd ..

# 列出设备
xcrun simctl list devices

# 启动模拟器
open -a Simulator

# 卸载应用
xcrun simctl uninstall booted com.example.app
```

#### Git 命令

```bash
# 克隆仓库
git clone <url>

# 创建分支
git checkout -b feature/name

# 提交更改
git add .
git commit -m "message"

# 推送
git push origin branch-name

# 拉取最新
git pull origin develop

# 查看状态
git status

# 查看日志
git log --oneline
```

#### 清理命令

```bash
# 清理 npm
rm -rf node_modules package-lock.json
npm cache clean --force

# 清理 Metro
rm -rf $TMPDIR/react-*

# 清理 Watchman
watchman watch-del-all

# 清理 iOS
cd ios
rm -rf Pods build Podfile.lock
cd ..

# 清理 Xcode DerivedData
rm -rf ~/Library/Developer/Xcode/DerivedData
```

### D. 快捷键

#### VS Code

| 快捷键 | 功能 |
|-------|------|
| `Cmd+P` | 快速打开文件 |
| `Cmd+Shift+P` | 命令面板 |
| `Cmd+B` | 切换侧边栏 |
| `Cmd+D` | 选择下一个匹配项 |
| `Cmd+/` | 注释/取消注释 |
| `Shift+Alt+F` | 格式化文档 |
| `Cmd+Shift+O` | 跳转到符号 |
| `F12` | 跳转到定义 |
| `Shift+F12` | 查找所有引用 |

#### React Native 调试

| 快捷键 | 功能 |
|-------|------|
| `Cmd+D` | 打开开发菜单（iOS） |
| `Cmd+R` | 重新加载应用 |
| `Cmd+Ctrl+Z` | 撤销 |

### E. 团队协作

#### 代码审查清单

- [ ] 代码符合项目规范
- [ ] 类型定义完整准确
- [ ] 包含必要的测试
- [ ] 测试全部通过
- [ ] 无 ESLint 错误
- [ ] 文档已更新
- [ ] 性能影响可接受
- [ ] 无明显安全问题
- [ ] UI/UX 符合设计规范
- [ ] 适配不同屏幕尺寸

#### 沟通渠道

- **技术问题**：Slack #dev-mobile 频道
- **设计问题**：Slack #design 频道
- **紧急问题**：直接电话或视频会议
- **日常沟通**：每日站会

#### 文档维护

- 每周五更新 CHANGELOG.md
- 重要变更及时更新文档
- 新功能需补充使用示例
- API 变更需通知所有成员

---

## 总结

本文档提供了完整的 React Native iOS 开发环境配置指南。如果在配置过程中遇到任何问题，请参考[常见问题](#常见问题和解决方案)章节或联系团队成员获取帮助。

**快速开始命令：**

```bash
# 1. 克隆仓库
git clone <repository-url>
cd expense-tracker-app

# 2. 安装依赖
npm install
cd ios && pod install && cd ..

# 3. 启动项目
npm start
npm run ios
```

**下一步：**
- 阅读 [README.md](./README.md) 了解项目概况
- 阅读 [DEVELOPMENT.md](./DEVELOPMENT.md) 了解开发规范
- 阅读 [ARCHITECTURE.md](./ARCHITECTURE.md) 了解架构设计

祝开发愉快！🚀
