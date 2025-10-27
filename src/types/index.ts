/**
 * 核心数据类型定义文件
 * 
 * 功能说明：
 * - 定义应用中所有核心数据模型的 TypeScript 类型
 * - 包括账户、交易、分类、预算、报表等实体类型
 * - 定义导航参数类型以确保路由类型安全
 */

/**
 * 账户接口
 * 
 * 描述：表示用户的金融账户（如银行账户、信用卡等）
 * 
 * @property id - 账户唯一标识符
 * @property name - 账户名称
 * @property type - 账户类型：支票账户、储蓄账户、信用卡、投资账户
 * @property balance - 当前余额
 * @property currency - 货币类型（如 CNY、USD）
 * @property createdAt - 创建时间（ISO 8601 格式）
 * @property updatedAt - 最后更新时间（ISO 8601 格式）
 */
export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 交易接口
 * 
 * 描述：表示一笔金融交易记录（收入或支出）
 * 
 * @property id - 交易唯一标识符
 * @property accountId - 关联的账户 ID
 * @property amount - 交易金额（正数）
 * @property category - 交易分类
 * @property description - 交易描述
 * @property date - 交易日期（ISO 8601 格式）
 * @property type - 交易类型：收入或支出
 * @property memo - 备注信息（可选）
 * @property transferId - 转账 ID，用于关联转账交易（可选）
 * @property relatedAccountId - 关联的账户 ID，用于转账场景（可选）
 */
export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  memo?: string;
  transferId?: string;
  relatedAccountId?: string;
}

/**
 * 分类类型
 * 
 * 描述：定义交易分类的类型枚举
 */
export type CategoryType = 'income' | 'expense';

/**
 * 分类接口
 * 
 * 描述：表示交易分类，用于组织和归类交易记录
 * 
 * @property id - 分类唯一标识符
 * @property name - 分类名称
 * @property icon - 图标名称（使用 react-native-vector-icons）
 * @property color - 分类颜色（十六进制颜色码）
 * @property type - 分类类型：收入或支出
 * @property isDefault - 是否为系统默认分类（可选）
 */
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
  isDefault?: boolean;
}

/**
 * 预算接口
 * 
 * 描述：表示用户为某个分类设置的预算限额
 * 
 * @property id - 预算唯一标识符
 * @property category - 关联的分类名称
 * @property budgetedAmount - 预算金额
 * @property spentAmount - 已花费金额
 * @property period - 预算周期：按月或按年
 * @property currency - 货币类型
 * @property alertThreshold - 警告阈值（百分比 0-100），达到此阈值时触发提醒（可选）
 * @property createdAt - 创建时间（ISO 8601 格式）
 * @property updatedAt - 最后更新时间（ISO 8601 格式）
 */
export interface Budget {
  id: string;
  category: string;
  budgetedAmount: number;
  spentAmount: number;
  period: 'monthly' | 'yearly';
  currency: string;
  alertThreshold?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 时间粒度类型
 * 
 * 描述：定义报表数据的时间聚合粒度
 */
export type TimeGranularity = 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * 报表筛选器接口
 * 
 * 描述：用于筛选报表数据的条件
 * 
 * @property startDate - 开始日期
 * @property endDate - 结束日期
 * @property granularity - 时间粒度
 */
export interface ReportFilters {
  startDate: Date;
  endDate: Date;
  granularity: TimeGranularity;
}

/**
 * 周期报表数据接口
 * 
 * 描述：表示按时间周期聚合的报表数据
 * 
 * @property periodKey - 周期键值（用于唯一标识）
 * @property label - 周期标签（用于显示）
 * @property startDate - 周期开始日期
 * @property endDate - 周期结束日期
 * @property income - 该周期总收入
 * @property expense - 该周期总支出
 * @property transactions - 该周期的所有交易记录
 */
export interface PeriodReportDatum {
  periodKey: string;
  label: string;
  startDate: string;
  endDate: string;
  income: number;
  expense: number;
  transactions: Transaction[];
}

/**
 * 趋势报表数据接口
 * 
 * 描述：表示趋势分析的数据点
 * 
 * @property periodKey - 周期键值
 * @property label - 数据点标签
 * @property value - 数值
 * @property transactions - 关联的交易记录
 */
export interface TrendReportDatum {
  periodKey: string;
  label: string;
  value: number;
  transactions: Transaction[];
}

/**
 * 分类报表数据接口
 * 
 * 描述：表示按分类聚合的报表数据
 * 
 * @property category - 分类名称
 * @property total - 该分类的总金额
 * @property transactions - 该分类的所有交易记录
 */
export interface CategoryReportDatum {
  category: string;
  total: number;
  transactions: Transaction[];
}

/**
 * 账户报表数据接口
 * 
 * 描述：表示按账户聚合的报表数据
 * 
 * @property accountId - 账户 ID
 * @property accountName - 账户名称
 * @property balance - 账户余额
 * @property transactions - 该账户的所有交易记录
 */
export interface AccountReportDatum {
  accountId: string;
  accountName: string;
  balance: number;
  transactions: Transaction[];
}

/**
 * 报表汇总接口
 * 
 * 描述：报表页面的汇总数据
 * 
 * @property totalIncome - 总收入
 * @property totalExpense - 总支出
 * @property netBalance - 净余额（收入 - 支出）
 * @property topCategories - 支出最多的分类列表
 */
export interface ReportSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  topCategories: CategoryReportDatum[];
}

/**
 * 应用状态接口
 * 
 * 描述：应用全局状态的数据结构
 * 
 * @property accounts - 账户列表
 * @property transactions - 交易列表
 * @property budgets - 预算列表
 * @property categories - 分类列表
 * @property loading - 加载状态
 * @property error - 错误信息
 */
export interface AppState {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  loading: boolean;
  error: string | null;
}

/**
 * 根堆栈导航参数列表
 * 
 * 描述：定义应用中所有堆栈导航路由及其参数类型
 * 
 * @property Login - 登录页面（无参数）
 * @property Dashboard - 仪表盘页面（无参数）
 * @property Accounts - 账户列表页面（无参数）
 * @property AccountDetails - 账户详情页面（需要 accountId 参数）
 * @property Budgets - 预算列表页面（无参数）
 * @property BudgetDetails - 预算详情页面（需要 budgetId 参数）
 * @property Transactions - 交易列表页面（无参数）
 * @property AddTransaction - 添加交易页面（可选 accountId 参数）
 * @property Settings - 设置页面（无参数）
 * @property CategoryManagement - 分类管理页面（无参数）
 * @property Export - 导出页面（无参数）
 */
export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Accounts: undefined;
  AccountDetails: {accountId: string};
  Budgets: undefined;
  BudgetDetails: {budgetId: string};
  Transactions: undefined;
  AddTransaction: {accountId?: string};
  Settings: undefined;
  CategoryManagement: undefined;
  Export: undefined;
};

/**
 * 底部标签栏导航参数列表
 * 
 * 描述：定义底部标签栏中的所有页面及其参数类型
 */
export type BottomTabParamList = {
  Dashboard: undefined;
  Reports: undefined;
  Accounts: undefined;
  Budgets: undefined;
  Transactions: undefined;
  Settings: undefined;
};
