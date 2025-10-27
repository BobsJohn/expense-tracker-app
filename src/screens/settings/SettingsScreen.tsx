import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {RootStackParamList} from '@/types';
import Card from '@/components/ui/Card';
import {useTheme} from '@/theme';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingItem {
  key: string;
  title: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  rightComponent?: React.ReactNode;
}

const SettingsScreen: React.FC = () => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const {theme, themeMode, toggleTheme} = useTheme();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const getLanguageDisplay = () => {
    switch (i18n.language) {
      case 'zh':
        return t('settings.chinese');
      case 'es':
        return t('settings.spanish');
      case 'fr':
        return t('settings.french');
      default:
        return t('settings.english');
    }
  };

  const settingsItems: SettingItem[] = [
    {
      key: 'export',
      title: t('settings.export'),
      onPress: () => navigation.navigate('Export'),
      showArrow: true,
    },
    {
      key: 'categories',
      title: t('settings.manageCategories'),
      onPress: () => navigation.navigate('CategoryManagement'),
      showArrow: true,
    },
    {
      key: 'language',
      title: t('settings.language'),
      value: getLanguageDisplay(),
      onPress: () => {
        // 循环切换语言: en -> zh -> es -> fr -> en
        const languages = ['en', 'zh', 'es', 'fr'];
        const currentIndex = languages.indexOf(i18n.language);
        const nextIndex = (currentIndex + 1) % languages.length;
        changeLanguage(languages[nextIndex]);
      },
      showArrow: true,
    },
    {
      key: 'theme',
      title: t('settings.theme'),
      value: themeMode === 'dark' ? t('settings.darkMode') : t('settings.lightMode'),
      rightComponent: (
        <Switch
          value={themeMode === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{false: theme.colors.borderLight, true: theme.colors.primary}}
          thumbColor={theme.colors.background}
        />
      ),
    },
    {
      key: 'currency',
      title: t('settings.currency'),
      showArrow: true,
    },
    {
      key: 'notifications',
      title: t('settings.notifications'),
      showArrow: true,
    },
    {
      key: 'backup',
      title: t('settings.backup'),
      showArrow: true,
    },
    {
      key: 'about',
      title: t('settings.about'),
      showArrow: true,
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.key}
      style={styles.settingItem}
      onPress={item.onPress}
      disabled={!item.onPress && !item.rightComponent}>
      <View style={styles.settingItemLeft}>
        <Text style={[styles.settingItemTitle, {color: theme.colors.textPrimary}]}>
          {item.title}
        </Text>
        {item.value && (
          <Text style={[styles.settingItemValue, {color: theme.colors.textSecondary}]}>
            {item.value}
          </Text>
        )}
      </View>
      <View style={styles.settingItemRight}>
        {item.rightComponent ||
          (item.showArrow && (
            <Text style={[styles.arrow, {color: theme.colors.textTertiary}]}>›</Text>
          ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.backgroundSecondary}]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.title, {color: theme.colors.textPrimary}]}>{t('settings.title')}</Text>

        <Card style={styles.settingsCard}>
          {settingsItems.map((item, index) => (
            <View key={item.key}>
              {renderSettingItem(item)}
              {index < settingsItems.length - 1 && (
                <View style={[styles.separator, {backgroundColor: theme.colors.borderLight}]} />
              )}
            </View>
          ))}
        </Card>

        <View style={styles.footer}>
          <Text style={[styles.footerText, {color: theme.colors.textSecondary}]}>
            Financial Budget App v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  settingsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 50,
  },
  settingItemLeft: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
  },
  settingItemValue: {
    fontSize: 14,
    marginTop: 4,
  },
  settingItemRight: {
    marginLeft: 16,
  },
  arrow: {
    fontSize: 20,
    fontWeight: '300',
  },
  separator: {
    height: 1,
    marginLeft: 16,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
});

export default SettingsScreen;
