/**
 * 登录屏幕占位符
 * 用于认证流程
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import ScreenContainer from '@/components/shared/ScreenContainer';
import {useTheme} from '@/theme';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({onLogin}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={[styles.title, {color: theme.colors.textPrimary}]}>{t('auth.login')}</Text>
        <Text style={[styles.subtitle, {color: theme.colors.textSecondary}]}>
          {t('auth.loginSubtitle')}
        </Text>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: theme.colors.primary}]}
          onPress={onLogin}>
          <Text style={[styles.buttonText, {color: theme.colors.textOnPrimary}]}>
            {t('auth.loginButton')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
