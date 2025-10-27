import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {getLocales} from 'react-native-localize';

import en from './locales/en.json';
import zh from './locales/zh.json';
import es from './locales/es.json';
import fr from './locales/fr.json';

const resources = {
  en: {translation: en},
  zh: {translation: zh},
  es: {translation: es},
  fr: {translation: fr},
};

const getDeviceLanguage = (): string => {
  const locales = getLocales();
  const primaryLocale = locales[0]?.languageCode || 'en';

  // 检查是否支持此语言
  if (resources[primaryLocale as keyof typeof resources]) {
    return primaryLocale;
  }

  return 'en'; // 默认回退
};

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
