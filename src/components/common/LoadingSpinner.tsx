import React from 'react';
import {View, ActivityIndicator, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({message, size = 'large'}) => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#007AFF" />
      <Text style={styles.message}>{message || t('common.loading')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default LoadingSpinner;
