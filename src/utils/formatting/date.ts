/**
 * 日期格式化工具函数
 */

/**
 * 格式化日期为本地化字符串
 */
export const formatDate = (
  date: Date | string | number,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions,
): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(dateObj);
};

/**
 * 格式化日期为短格式 (MM/DD/YYYY)
 */
export const formatShortDate = (date: Date | string | number, locale: string = 'en-US'): string => {
  return formatDate(date, locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * 格式化日期为长格式 (January 1, 2024)
 */
export const formatLongDate = (date: Date | string | number, locale: string = 'en-US'): string => {
  return formatDate(date, locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * 格式化日期时间
 */
export const formatDateTime = (
  date: Date | string | number,
  locale: string = 'en-US',
): string => {
  return formatDate(date, locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * 格式化为相对时间 (2 days ago, in 3 hours)
 */
export const formatRelativeTime = (
  date: Date | string | number,
  locale: string = 'en-US',
): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat(locale, {numeric: 'auto'});
  
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];
  
  for (const [unit, secondsInUnit] of units) {
    const value = Math.floor(diffInSeconds / secondsInUnit);
    if (Math.abs(value) >= 1) {
      return rtf.format(-value, unit);
    }
  }
  
  return rtf.format(0, 'second');
};

/**
 * 获取月份名称
 */
export const getMonthName = (monthIndex: number, locale: string = 'en-US', format: 'long' | 'short' = 'long'): string => {
  const date = new Date(2000, monthIndex, 1);
  return new Intl.DateTimeFormat(locale, {month: format}).format(date);
};

/**
 * 获取星期名称
 */
export const getDayName = (dayIndex: number, locale: string = 'en-US', format: 'long' | 'short' = 'long'): string => {
  const date = new Date(2000, 0, dayIndex + 2); // 2000-01-02 是星期日
  return new Intl.DateTimeFormat(locale, {weekday: format}).format(date);
};

/**
 * 检查日期是否为今天
 */
export const isToday = (date: Date | string | number): boolean => {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * 检查日期是否为本周
 */
export const isThisWeek = (date: Date | string | number): boolean => {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  const today = new Date();
  const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
  
  return dateObj >= firstDayOfWeek && dateObj <= lastDayOfWeek;
};

/**
 * 获取日期范围文本
 */
export const getDateRangeText = (
  startDate: Date | string | number,
  endDate: Date | string | number,
  locale: string = 'en-US',
): string => {
  const start = formatShortDate(startDate, locale);
  const end = formatShortDate(endDate, locale);
  return `${start} - ${end}`;
};
