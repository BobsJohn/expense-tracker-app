/**
 * 国际化配置文件
 * 
 * 功能说明：
 * - 配置 i18next 国际化框架
 * - 支持多语言（英语、中文、西班牙语、法语）
 * - 自动检测设备语言并设置
 * - 提供语言切换和回退机制
 * 
 * 技术实现：
 * - 使用 i18next 和 react-i18next
 * - 使用 react-native-localize 获取设备语言
 * - JSON 格式的翻译资源文件
 * 
 * @module localization/i18n
 */
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {getLocales} from 'react-native-localize';

import en from './locales/en.json';
import zh from './locales/zh.json';
import es from './locales/es.json';
import fr from './locales/fr.json';

/**
 * 翻译资源配置
 * 
 * 包含所有支持语言的翻译文本
 */
const resources = {
  en: {translation: en},
  zh: {translation: zh},
  es: {translation: es},
  fr: {translation: fr},
};

/**
 * 获取设备语言
 * 
 * 功能：
 * - 读取设备的首选语言
 * - 检查是否在支持的语言列表中
 * - 不支持则回退到英语
 * 
 * @returns string 语言代码
 */
const getDeviceLanguage = (): string => {
  const locales = getLocales();
  const primaryLocale = locales[0]?.languageCode || 'en';

  if (resources[primaryLocale as keyof typeof resources]) {
    return primaryLocale;
  }

  return 'en';
};

/**
 * 初始化 i18n 实例
 */
i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
