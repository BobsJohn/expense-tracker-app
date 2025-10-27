/**
 * Metro 打包工具配置文件
 * 
 * 功能说明：
 * - 配置 React Native 的 JavaScript 打包工具 Metro
 * - 定义模块解析、转换和打包规则
 * 
 * 配置说明：
 * - 当前使用默认配置
 * - 可以在 config 对象中添加自定义配置项
 * - 更多配置选项参见：https://facebook.github.io/metro/docs/configuration
 * 
 * @type {import('metro-config').MetroConfig}
 */
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
