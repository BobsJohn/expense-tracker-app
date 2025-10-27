import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
import {runMigrations, needsMigration} from './migrations';

// 启用 Promise API
SQLite.enablePromise(true);

// 数据库配置
const DATABASE_NAME = 'FinancialBudgetApp.db';
const DATABASE_VERSION = 1;
const DATABASE_DISPLAY_NAME = 'Financial Budget Database';
const DATABASE_SIZE = 5 * 1024 * 1024; // 5MB

// 数据库实例
let dbInstance: SQLiteDatabase | null = null;

// 数据库初始化状态
let isInitialized = false;
let initializationPromise: Promise<SQLiteDatabase> | null = null;

/**
 * 获取数据库实例
 * 如果数据库尚未初始化，将自动初始化
 */
export const getDatabase = async (): Promise<SQLiteDatabase> => {
  if (dbInstance && isInitialized) {
    return dbInstance;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = initDatabase();
  return initializationPromise;
};

/**
 * 初始化数据库
 * 包括打开数据库连接和运行必要的迁移
 */
export const initDatabase = async (): Promise<SQLiteDatabase> => {
  if (dbInstance && isInitialized) {
    console.log('数据库已初始化');
    return dbInstance;
  }

  try {
    console.log('正在初始化数据库...');

    // 打开数据库连接
    dbInstance = await SQLite.openDatabase({
      name: DATABASE_NAME,
      location: 'default',
    });

    console.log('数据库连接已建立');

    // 检查是否需要迁移
    const needsUpdate = await needsMigration(dbInstance);
    if (needsUpdate) {
      console.log('检测到数据库需要更新，开始迁移...');
      await runMigrations(dbInstance);
    } else {
      console.log('数据库结构已是最新');
    }

    isInitialized = true;
    initializationPromise = null;
    console.log('数据库初始化完成');

    return dbInstance;
  } catch (error) {
    console.error('数据库初始化失败:', error);
    initializationPromise = null;
    throw new Error(`数据库初始化失败: ${error}`);
  }
};

/**
 * 关闭数据库连接
 */
export const closeDatabase = async (): Promise<void> => {
  if (dbInstance) {
    try {
      await dbInstance.close();
      console.log('数据库连接已关闭');
      dbInstance = null;
      isInitialized = false;
    } catch (error) {
      console.error('关闭数据库失败:', error);
      throw error;
    }
  }
};

/**
 * 删除数据库
 * 警告：这将删除所有数据
 */
export const deleteDatabase = async (): Promise<void> => {
  try {
    await closeDatabase();
    await SQLite.deleteDatabase({name: DATABASE_NAME, location: 'default'});
    console.log('数据库已删除');
  } catch (error) {
    console.error('删除数据库失败:', error);
    throw error;
  }
};

/**
 * 执行事务
 * @param operations - 要在事务中执行的操作
 */
export const executeTransaction = async <T>(
  operations: (db: SQLiteDatabase) => Promise<T>,
): Promise<T> => {
  const db = await getDatabase();

  return new Promise((resolve, reject) => {
    db.transaction(
      async tx => {
        try {
          const result = await operations(tx as unknown as SQLiteDatabase);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      },
      error => {
        console.error('事务执行失败:', error);
        reject(error);
      },
    );
  });
};

/**
 * 检查数据库是否已初始化
 */
export const isDatabaseInitialized = (): boolean => {
  return isInitialized && dbInstance !== null;
};

/**
 * 重置数据库到初始状态
 * 警告：这将删除所有数据
 */
export const resetDatabase = async (): Promise<void> => {
  await deleteDatabase();
  await initDatabase();
};
