/**
 * Toast 消息提示服务
 * 
 * 功能说明：
 * - 提供全局消息提示功能
 * - 支持多种消息类型（成功、错误、信息、警告）
 * - 统一的消息展示接口
 * - 自动消失和位置管理
 * 
 * 使用场景：
 * - 操作成功提示
 * - 错误信息展示
 * - 系统通知
 * - 用户反馈
 * 
 * @module services/toastService
 */
import Toast from 'react-native-toast-message';

/**
 * Toast 消息展示工具
 * 
 * @example
 * // 显示成功消息
 * showToast.success('操作成功！');
 * 
 * // 显示错误消息
 * showToast.error('操作失败，请重试');
 */
export const showToast = {
  /**
   * 显示成功消息
   * 
   * @param message - 消息内容
   * @param title - 消息标题（可选）
   */
  success: (message: string, title?: string) => {
    Toast.show({
      type: 'success',
      text1: title || 'Success',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  },

  /**
   * 显示错误消息
   * 
   * @param message - 消息内容
   * @param title - 消息标题（可选）
   */
  error: (message: string, title?: string) => {
    Toast.show({
      type: 'error',
      text1: title || 'Error',
      text2: message,
      position: 'top',
      visibilityTime: 4000,
    });
  },

  /**
   * 显示信息消息
   * 
   * @param message - 消息内容
   * @param title - 消息标题（可选）
   */
  info: (message: string, title?: string) => {
    Toast.show({
      type: 'info',
      text1: title || 'Info',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  },

  /**
   * 显示警告消息
   * 
   * @param message - 消息内容
   * @param title - 消息标题（可选）
   */
  warning: (message: string, title?: string) => {
    Toast.show({
      type: 'error',
      text1: title || 'Warning',
      text2: message,
      position: 'top',
      visibilityTime: 3500,
    });
  },
};
