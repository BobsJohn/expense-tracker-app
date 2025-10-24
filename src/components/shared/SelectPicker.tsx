/**
 * 选择器组件
 * 支持主题、验证错误和无障碍访问
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ViewStyle,
  TextStyle,
  AccessibilityProps,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '@/theme';
import {triggerHapticFeedback} from '@/utils/haptics';

export interface SelectOption<T = any> {
  label: string;
  value: T;
  icon?: string;
  disabled?: boolean;
}

export interface SelectPickerProps<T = any> extends AccessibilityProps {
  label?: string;
  placeholder?: string;
  value?: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  labelStyle?: TextStyle;
  testID?: string;
}

function SelectPicker<T = any>({
  label,
  placeholder = '请选择',
  value,
  options,
  onChange,
  error,
  disabled = false,
  required = false,
  containerStyle,
  inputStyle,
  labelStyle,
  testID,
  accessibilityLabel,
  accessibilityHint,
  ...accessibilityProps
}: SelectPickerProps<T>) {
  const {theme} = useTheme();
  const [isModalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (option: SelectOption<T>) => {
    if (!option.disabled) {
      triggerHapticFeedback.light();
      onChange(option.value);
      setModalVisible(false);
    }
  };

  const openModal = () => {
    if (!disabled) {
      triggerHapticFeedback.light();
      setModalVisible(true);
    }
  };

  const hasError = !!error;
  const borderColor = hasError
    ? theme.colors.error
    : theme.colors.border;

  const labelColor = hasError
    ? theme.colors.error
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
        onPress={openModal}
        disabled={disabled}
        testID={testID}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || label || '选择器'}
        accessibilityHint={accessibilityHint || '点击打开选项列表'}
        accessibilityState={{disabled}}
        accessibilityValue={{text: selectedOption?.label || placeholder}}
        {...accessibilityProps}>
        {selectedOption?.icon && (
          <Icon
            name={selectedOption.icon}
            size={theme.sizes.icon.sm}
            color={theme.colors.textPrimary}
            style={styles.leftIcon}
          />
        )}
        <Text
          style={[
            styles.valueText,
            {
              color: selectedOption ? theme.colors.textPrimary : theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.md,
            },
          ]}>
          {selectedOption?.label || placeholder}
        </Text>
        <Icon
          name="arrow-drop-down"
          size={theme.sizes.icon.md}
          color={theme.colors.textSecondary}
        />
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

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        accessibilityViewIsModal>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.colors.background,
                borderTopLeftRadius: theme.borderRadius.lg,
                borderTopRightRadius: theme.borderRadius.lg,
              },
            ]}>
            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  {
                    fontSize: theme.typography.fontSize.lg,
                    fontWeight: theme.typography.fontWeight.semiBold,
                    color: theme.colors.textPrimary,
                  },
                ]}>
                {label || '选择选项'}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="关闭">
                <Icon
                  name="close"
                  size={theme.sizes.icon.md}
                  color={theme.colors.textPrimary}
                />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item, index) => `${item.value}-${index}`}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    {
                      backgroundColor:
                        item.value === value
                          ? theme.colors.backgroundSecondary
                          : 'transparent',
                    },
                    item.disabled && {opacity: 0.5},
                  ]}
                  onPress={() => handleSelect(item)}
                  disabled={item.disabled}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                  accessibilityState={{
                    selected: item.value === value,
                    disabled: item.disabled,
                  }}>
                  {item.icon && (
                    <Icon
                      name={item.icon}
                      size={theme.sizes.icon.md}
                      color={theme.colors.textPrimary}
                      style={styles.optionIcon}
                    />
                  )}
                  <Text
                    style={[
                      styles.optionText,
                      {
                        fontSize: theme.typography.fontSize.md,
                        color: theme.colors.textPrimary,
                      },
                    ]}>
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Icon
                      name="check"
                      size={theme.sizes.icon.md}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

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
  leftIcon: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {},
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
});

export default SelectPicker;
