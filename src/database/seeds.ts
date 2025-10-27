import {Account, Category} from '@/types';
import {accountRepository} from '@/repositories/accountRepository';
import {categoryRepository} from '@/repositories/categoryRepository';
import {settingsRepository, SETTINGS_KEYS} from '@/repositories/settingsRepository';

// 默认分类数据
const DEFAULT_CATEGORIES: Category[] = [
  // 支出分类
  {
    id: 'default-expense-food',
    name: 'Food',
    icon: 'silverware-fork-knife',
    color: '#FF6B6B',
    type: 'expense',
    isDefault: true,
  },
  {
    id: 'default-expense-transportation',
    name: 'Transportation',
    icon: 'car',
    color: '#FFA502',
    type: 'expense',
    isDefault: true,
  },
  {
    id: 'default-expense-housing',
    name: 'Housing',
    icon: 'home-city',
    color: '#1E90FF',
    type: 'expense',
    isDefault: true,
  },
  {
    id: 'default-expense-utilities',
    name: 'Utilities',
    icon: 'flash',
    color: '#3742FA',
    type: 'expense',
    isDefault: true,
  },
  {
    id: 'default-expense-healthcare',
    name: 'Healthcare',
    icon: 'heart-pulse',
    color: '#FF4757',
    type: 'expense',
    isDefault: true,
  },
  {
    id: 'default-expense-entertainment',
    name: 'Entertainment',
    icon: 'music-note',
    color: '#A29BFE',
    type: 'expense',
    isDefault: true,
  },
  {
    id: 'default-expense-shopping',
    name: 'Shopping',
    icon: 'shopping',
    color: '#2ED573',
    type: 'expense',
    isDefault: true,
  },
  {
    id: 'default-expense-insurance',
    name: 'Insurance',
    icon: 'shield-check',
    color: '#70A1FF',
    type: 'expense',
    isDefault: true,
  },
  {
    id: 'default-expense-subscriptions',
    name: 'Subscriptions',
    icon: 'repeat',
    color: '#FF6B81',
    type: 'expense',
    isDefault: true,
  },
  {
    id: 'default-expense-transfer',
    name: 'Transfer',
    icon: 'swap-horizontal',
    color: '#57606F',
    type: 'expense',
    isDefault: true,
  },
  {
    id: 'default-expense-other',
    name: 'Other',
    icon: 'dots-horizontal',
    color: '#8395A7',
    type: 'expense',
    isDefault: true,
  },
  // 收入分类
  {
    id: 'default-income-salary',
    name: 'Salary',
    icon: 'briefcase',
    color: '#34C759',
    type: 'income',
    isDefault: true,
  },
  {
    id: 'default-income-bonus',
    name: 'Bonus',
    icon: 'gift',
    color: '#FF9F1C',
    type: 'income',
    isDefault: true,
  },
  {
    id: 'default-income-investments',
    name: 'Investments',
    icon: 'chart-line',
    color: '#1E90FF',
    type: 'income',
    isDefault: true,
  },
  {
    id: 'default-income-gifts',
    name: 'Gifts',
    icon: 'hand-heart',
    color: '#FF6B6B',
    type: 'income',
    isDefault: true,
  },
  {
    id: 'default-income-interest',
    name: 'Interest',
    icon: 'percent',
    color: '#5352ED',
    type: 'income',
    isDefault: true,
  },
  {
    id: 'default-income-refunds',
    name: 'Refunds',
    icon: 'cash-refund',
    color: '#2ED573',
    type: 'income',
    isDefault: true,
  },
  {
    id: 'default-income-sales',
    name: 'Sales',
    icon: 'cart-arrow-down',
    color: '#FF4757',
    type: 'income',
    isDefault: true,
  },
  {
    id: 'default-income-rental',
    name: 'Rental Income',
    icon: 'home-currency-usd',
    color: '#3742FA',
    type: 'income',
    isDefault: true,
  },
  {
    id: 'default-income-transfer',
    name: 'Transfer',
    icon: 'swap-horizontal',
    color: '#57606F',
    type: 'income',
    isDefault: true,
  },
  {
    id: 'default-income-other',
    name: 'Other',
    icon: 'dots-horizontal',
    color: '#8395A7',
    type: 'income',
    isDefault: true,
  },
];

// 默认账户数据
const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: 'default-account-1',
    name: 'Main Checking',
    type: 'checking',
    balance: 0,
    currency: 'USD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * 检查数据是否已初始化
 */
export const isDataSeeded = async (): Promise<boolean> => {
  const seeded = await settingsRepository.get(SETTINGS_KEYS.DATA_SEEDED);
  return seeded === 'true';
};

/**
 * 初始化默认数据（仅在首次运行时执行）
 */
export const seedDefaultData = async (): Promise<void> => {
  try {
    // 检查是否已经初始化
    const alreadySeeded = await isDataSeeded();
    if (alreadySeeded) {
      console.log('数据已初始化，跳过种子数据');
      return;
    }

    console.log('开始初始化默认数据...');

    // 插入默认分类
    const existingCategoriesCount = await categoryRepository.count();
    if (existingCategoriesCount === 0) {
      console.log(`插入 ${DEFAULT_CATEGORIES.length} 个默认分类...`);
      await categoryRepository.createBatch(DEFAULT_CATEGORIES);
    }

    // 插入默认账户
    const existingAccountsCount = await accountRepository.count();
    if (existingAccountsCount === 0) {
      console.log(`插入 ${DEFAULT_ACCOUNTS.length} 个默认账户...`);
      await accountRepository.createBatch(DEFAULT_ACCOUNTS);
    }

    // 标记为已初始化
    await settingsRepository.set(SETTINGS_KEYS.DATA_SEEDED, 'true');
    await settingsRepository.set(SETTINGS_KEYS.DB_INITIALIZED, new Date().toISOString());

    console.log('默认数据初始化完成');
  } catch (error) {
    console.error('初始化默认数据失败:', error);
    throw error;
  }
};

/**
 * 重置所有数据（用于测试或重置应用）
 */
export const resetAllData = async (): Promise<void> => {
  try {
    console.log('正在重置所有数据...');

    // 清空所有表中的数据
    // 注意：由于外键约束，需要按特定顺序删除
    await settingsRepository.clear();

    console.log('所有数据已重置');
  } catch (error) {
    console.error('重置数据失败:', error);
    throw error;
  }
};

// 导出默认数据供其他模块使用
export {DEFAULT_CATEGORIES, DEFAULT_ACCOUNTS};
