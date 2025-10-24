/**
 * 应用主题配置
 * 定义颜色、字体、间距等设计标准
 */

export const theme = {
  // 颜色配置
  colors: {
    primary: '#007AFF',
    primaryDark: '#0051D5',
    primaryLight: '#4DA2FF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
    error: '#FF3B30',
    info: '#5AC8FA',
    
    // 文本颜色
    textPrimary: '#000000',
    textSecondary: '#8E8E93',
    textTertiary: '#C7C7CC',
    textDisabled: '#AEAEB2',
    textOnPrimary: '#FFFFFF',
    
    // 背景颜色
    background: '#FFFFFF',
    backgroundSecondary: '#F2F2F7',
    backgroundTertiary: '#E5E5EA',
    
    // 边框颜色
    border: '#C6C6C8',
    borderLight: '#E5E5EA',
    
    // 特殊用途颜色
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.1)',
    
    // 图表颜色
    chart: {
      primary: '#007AFF',
      secondary: '#5856D6',
      tertiary: '#34C759',
      quaternary: '#FF9500',
      quinary: '#FF3B30',
      senary: '#5AC8FA',
    },
  },
  
  // 字体配置
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    fontWeight: {
      regular: '400' as const,
      medium: '500' as const,
      semiBold: '600' as const,
      bold: '700' as const,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
  },
  
  // 间距配置
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // 圆角配置
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  
  // 阴影配置
  shadows: {
    none: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
  
  // 尺寸配置
  sizes: {
    icon: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 32,
      xl: 48,
    },
    button: {
      height: {
        sm: 32,
        md: 44,
        lg: 56,
      },
    },
    input: {
      height: {
        sm: 36,
        md: 44,
        lg: 52,
      },
    },
  },
  
  // 动画配置
  animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
  },
};

export type Theme = typeof theme;
