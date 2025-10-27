/**
 * Babel 配置文件
 * 
 * 功能说明：
 * - 配置 Babel 转译器以支持 React Native 项目
 * - 设置模块路径别名以简化导入语句
 * - 集成 react-native-reanimated 动画库插件
 * 
 * 配置说明：
 * - presets: 使用 Metro React Native Babel 预设
 * - module-resolver: 配置路径别名，与 tsconfig.json 保持一致
 * - react-native-reanimated/plugin: 必须作为最后一个插件加载
 */
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@/components': './src/components',
          '@/screens': './src/screens',
          '@/store': './src/store',
          '@/services': './src/services',
          '@/utils': './src/utils',
          '@/types': './src/types',
          '@/localization': './src/localization',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
