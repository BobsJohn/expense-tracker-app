/**
 * 金额输入组件
 * 专门用于货币金额输入，支持格式化和验证
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  AccessibilityProps,
} from 'react-native';
import {useTheme} from '@/theme';
import {parseCurrencyInput} from '@/utils/formatting';

export interface AmountInputProps extends AccessibilityProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  currency?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  maxValue?: number;
  minValue?: number;
}

const AmountInput: React.FC<AmountInputProps> = ({
  label,
  value,
  onChange,
  currency = '$',
  error,
  helperText,
  placeholder = '0.00',
  disabled = false,
  required = false,
  containerStyle,
  inputStyle,
  labelStyle,
  maxValue,
  minValue = 0,
  accessibilityLabel,
  accessibilityHint,
  ...accessibilityProps
}) => {
  const {theme} = useTheme();
  const [inputValue, setInputValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setInputValue(value.toString());
    }
  }, [value, isFocused]);

  const handleChangeText = (text: string) => {
    setInputValue(text);
    
    const parsed = parseCurrencyInput(text);
    
    if (maxValue !== undefined && parsed > maxValue) {
      onChange(maxValue);
      return;
    }
    
    if (parsed < minValue) {
      onChange(minValue);
      return;
    }
    
    onChange(parsed);
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseCurrencyInput(inputValue);
    setInputValue(parsed.toFixed(2));
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const hasError = !!error;
  const showHelper = !hasError && !!helperText;

  const borderColor = hasError
    ? theme.colors.error
    : isFocused
    ? theme.colors.primary
    : theme.colors.border;

  const labelColor = hasError
    ? theme.colors.error
    : isFocused
    ? theme.colors.primary
    : theme.colors.textSecondary;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: labelColor,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
            },
            labelStyle,
          ]}
          accessibilityLabel={`${label}${required ? '，必填' : ''}`}>
          {label}
          {required && <Text style={{color: theme.colors.error}}> *</Text>}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor,
            borderRadius: theme.borderRadius.md,
            backgroundColor: disabled ? theme.colors.backgroundSecondary : theme.colors.background,
            height: theme.sizes.input.height.md,
          },
        ]}>
        <Text
          style={[
            styles.currency,
            {
              color: theme.colors.textPrimary,
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semiBold,
            },
          ]}>
          {currency}
        </Text>
        
        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.textPrimary,
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semiBold,
            },
            inputStyle,
          ]}
          value={inputValue}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType="decimal-pad"
          editable={!disabled}
          selectTextOnFocus
          accessible={true}
          accessibilityRole="none"
          accessibilityLabel={accessibilityLabel || label || '金额输入'}
          accessibilityHint={accessibilityHint || '输入金额'}
          accessibilityState={{disabled}}
          accessibilityValue={{text: `${currency}${inputValue}`}}
          {...accessibilityProps}
        />
      </View>

      {hasError && (
        <View style={styles.helperContainer} accessibilityLiveRegion="polite">
          <Text
            style={[
              styles.helperText,
              {
                color: theme.colors.error,
                fontSize: theme.typography.fontSize.xs,
              },
            ]}
            accessibilityLabel={`错误：${error}`}>
            {error}
          </Text>
        </View>
      )}

      {showHelper && (
        <View style={styles.helperContainer}>
          <Text
            style={[
              styles.helperText,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.xs,
              },
            ]}>
            {helperText}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  currency: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  helperText: {
    flex: 1,
  },
});

export default AmountInput;
