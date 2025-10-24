/**
 * 日期选择器组件
 * 封装 @react-native-community/datetimepicker
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ViewStyle,
  TextStyle,
  AccessibilityProps,
} from 'react-native';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '@/theme';
import {formatDate} from '@/utils/formatting';
import {triggerHapticFeedback} from '@/utils/haptics';

export interface DatePickerFieldProps extends AccessibilityProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  maximumDate?: Date;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  locale?: string;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  labelStyle?: TextStyle;
  testID?: string;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  mode = 'date',
  minimumDate,
  maximumDate,
  error,
  disabled = false,
  required = false,
  locale = 'en-US',
  containerStyle,
  inputStyle,
  labelStyle,
  testID,
  accessibilityLabel,
  accessibilityHint,
  ...accessibilityProps
}) => {
  const {theme} = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const handlePress = () => {
    if (!disabled) {
      triggerHapticFeedback.light();
      setShowPicker(true);
    }
  };

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
    }
  };

  const handleDismiss = () => {
    setShowPicker(false);
  };

  const formatDisplayValue = () => {
    switch (mode) {
      case 'date':
        return formatDate(value, locale);
      case 'time':
        return value.toLocaleTimeString(locale, {
          hour: '2-digit',
          minute: '2-digit',
        });
      case 'datetime':
        return `${formatDate(value, locale)} ${value.toLocaleTimeString(locale, {
          hour: '2-digit',
          minute: '2-digit',
        })}`;
      default:
        return formatDate(value, locale);
    }
  };

  const getIconName = () => {
    switch (mode) {
      case 'time':
        return 'access-time';
      case 'datetime':
        return 'event';
      default:
        return 'calendar-today';
    }
  };

  const hasError = !!error;
  const borderColor = hasError ? theme.colors.error : theme.colors.border;
  const labelColor = hasError ? theme.colors.error : theme.colors.textSecondary;

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

      <TouchableOpacity
        style={[
          styles.inputContainer,
          {
            borderColor,
            borderRadius: theme.borderRadius.md,
            backgroundColor: disabled ? theme.colors.backgroundSecondary : theme.colors.background,
            height: theme.sizes.input.height.md,
          },
          inputStyle,
        ]}
        onPress={handlePress}
        disabled={disabled}
        testID={testID}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || label || '日期选择器'}
        accessibilityHint={accessibilityHint || '点击选择日期'}
        accessibilityState={{disabled}}
        accessibilityValue={{text: formatDisplayValue()}}
        {...accessibilityProps}>
        <Icon
          name={getIconName()}
          size={theme.sizes.icon.sm}
          color={theme.colors.textPrimary}
          style={styles.icon}
        />
        <Text
          style={[
            styles.valueText,
            {
              color: theme.colors.textPrimary,
              fontSize: theme.typography.fontSize.md,
            },
          ]}>
          {formatDisplayValue()}
        </Text>
      </TouchableOpacity>

      {hasError && (
        <View style={styles.errorContainer} accessibilityLiveRegion="polite">
          <Icon
            name="error-outline"
            size={theme.sizes.icon.xs}
            color={theme.colors.error}
            style={styles.errorIcon}
          />
          <Text
            style={[
              styles.errorText,
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

      {showPicker && (
        <DateTimePicker
          value={value}
          mode={mode}
          display="default"
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          locale={locale}
          textColor={theme.colors.textPrimary}
          {...(Platform.OS === 'ios' && {
            onTouchCancel: handleDismiss,
          })}
        />
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
  icon: {
    marginRight: 8,
  },
  valueText: {
    flex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  errorIcon: {
    marginRight: 4,
  },
  errorText: {
    flex: 1,
  },
});

export default DatePickerField;
