/**
 * 触觉反馈工具
 * 
 * 功能说明：
 * - 提供统一的触觉反馈接口
 * - 支持多种反馈类型（轻、中、重、选择、成功、警告、错误）
 * - 增强用户交互体验
 * - 自动处理 iOS 和 Android 平台差异
 * 
 * 使用场景：
 * - 按钮点击
 * - 操作成功/失败
 * - 列表项选择
 * - 表单验证
 * 
 * @module utils/haptics
 */
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

/**
 * 触觉反馈触发器
 * 
 * 提供不同强度和类型的触觉反馈
 * 
 * @example
 * // 轻触反馈
 * triggerHapticFeedback.light();
 * 
 * // 成功操作反馈
 * triggerHapticFeedback.success();
 */
export const triggerHapticFeedback = {
  selection: () => ReactNativeHapticFeedback.trigger('selection', options),
  light: () => ReactNativeHapticFeedback.trigger('impactLight', options),
  medium: () => ReactNativeHapticFeedback.trigger('impactMedium', options),
  heavy: () => ReactNativeHapticFeedback.trigger('impactHeavy', options),
  success: () => ReactNativeHapticFeedback.trigger('notificationSuccess', options),
  warning: () => ReactNativeHapticFeedback.trigger('notificationWarning', options),
  error: () => ReactNativeHapticFeedback.trigger('notificationError', options),
};
