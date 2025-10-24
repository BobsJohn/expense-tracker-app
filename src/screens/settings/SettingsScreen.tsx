import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {RootStackParamList} from '@/types';
import Card from '@/components/ui/Card';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingItem {
  key: string;
  title: string;
  onPress?: () => void;
  showArrow?: boolean;
}

const SettingsScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<SettingsScreenNavigationProp>();

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
      showArrow: true,
    },
    {
      key: 'theme',
      title: t('settings.theme'),
      showArrow: true,
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
      disabled={!item.onPress}>
      <Text style={styles.settingItemTitle}>{item.title}</Text>
      {item.showArrow && <Text style={styles.arrow}>›</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{t('settings.title')}</Text>

        <Card style={styles.settingsCard}>
          {settingsItems.map((item, index) => (
            <View key={item.key}>
              {renderSettingItem(item)}
              {index < settingsItems.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Financial Budget App v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1C1C1E',
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
  settingItemTitle: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  arrow: {
    fontSize: 20,
    color: '#C7C7CC',
    fontWeight: '300',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginLeft: 16,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
  },
});

export default SettingsScreen;
