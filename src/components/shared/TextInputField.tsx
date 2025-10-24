/**
 * 文本输入框组件
 * 支持验证错误显示、主题和无障碍访问
 */

import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  AccessibilityProps,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '@/theme';

export interface TextInputFieldProps extends Omit<TextInputProps, 'style'>, AccessibilityProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  required?: boolean;
}

const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  required = false,
  editable = true,
  accessibilityLabel,
  accessibilityHint,
  ...textInputProps
}) => {
  const {theme} = useTheme();
  const [isFocused, setIsFocused] = useState(false);

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
            backgroundColor: editable ? theme.colors.background : theme.colors.backgroundSecondary,
            height: theme.sizes.input.height.md,
          },
        ]}>
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={theme.sizes.icon.sm}
            color={theme.colors.textSecondary}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.textPrimary,
              fontSize: theme.typography.fontSize.md,
            },
            inputStyle,
          ]}
          placeholderTextColor={theme.colors.textSecondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={editable}
          accessible={true}
          accessibilityLabel={accessibilityLabel || label}
          accessibilityHint={accessibilityHint}
          accessibilityState={{disabled: !editable}}
          {...textInputProps}
        />

        {rightIcon && (
          <Icon
            name={rightIcon}
            size={theme.sizes.icon.sm}
            color={theme.colors.textSecondary}
            style={styles.rightIcon}
            onPress={onRightIconPress}
          />
        )}
      </View>

      {hasError && (
        <View style={styles.helperContainer} accessibilityLiveRegion="polite">
          <Icon
            name="error-outline"
            size={theme.sizes.icon.xs}
            color={theme.colors.error}
            style={styles.helperIcon}
          />
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
  input: {
    flex: 1,
    paddingVertical: 0,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  helperIcon: {
    marginRight: 4,
  },
  helperText: {
    flex: 1,
  },
});

export default TextInputField;
