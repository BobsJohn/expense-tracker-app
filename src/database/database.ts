/**
 * 数据库管理模块
 * 
 * 功能说明：
 * - 管理 SQLite 数据库的连接和生命周期
 * - 提供数据库初始化、关闭、删除等操作
 * - 支持数据库事务处理
 * - 管理数据库迁移和版本控制
 * 
 * 架构说明：
 * - 使用单例模式确保全局只有一个数据库连接
 * - 支持懒加载，首次使用时自动初始化
 * - 提供线程安全的初始化逻辑，防止重复初始化
 * 
 * @module database
 */
import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
import {runMigrations, needsMigration} from './migrations';

SQLite.enablePromise(true);

const DATABASE_NAME = 'FinancialBudgetApp.db';
const DATABASE_VERSION = 1;
const DATABASE_DISPLAY_NAME = 'Financial Budget Database';
const DATABASE_SIZE = 5 * 1024 * 1024;

let dbInstance: SQLiteDatabase | null = null;
let isInitialized = false;
let initializationPromise: Promise<SQLiteDatabase> | null = null;

/**
 * 获取数据库实例
 * 
 * 功能：
 * - 返回已初始化的数据库实例
 * - 如果数据库未初始化，自动执行初始化
 * - 防止并发初始化导致的问题
 * 
 * @returns Promise<SQLiteDatabase> 数据库实例
 * 
 * @example
 * const db = await getDatabase();
 * const result = await db.executeSql('SELECT * FROM accounts');
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
 * 
 * 功能：
 * - 打开或创建 SQLite 数据库连接
 * - 检查并执行数据库迁移
 * - 确保数据库结构为最新版本
 * 
 * @returns Promise<SQLiteDatabase> 初始化后的数据库实例
 * @throws 初始化失败时抛出错误
 * 
 * @example
 * await initDatabase();
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
 * 
 * 功能：安全关闭数据库连接并清理资源
 * 
 * @throws 关闭失败时抛出错误
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
 * 
 * 功能：完全删除数据库文件
 * 
 * ⚠️ 警告：此操作不可逆，将永久删除所有数据
 * 
 * @throws 删除失败时抛出错误
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
 * 执行数据库事务
 * 
 * 功能：
 * - 在事务中执行一组数据库操作
 * - 保证操作的原子性（全部成功或全部回滚）
 * - 提高批量操作的性能
 * 
 * @param operations - 事务操作函数，接收数据库实例作为参数
 * @returns Promise<T> 操作结果
 * @throws 事务执行失败时抛出错误
 * 
 * @example
 * await executeTransaction(async (db) => {
 *   await db.executeSql('INSERT INTO accounts ...');
 *   await db.executeSql('UPDATE budgets ...');
 * });
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
 * 
 * 功能：返回数据库的初始化状态
 * 
 * @returns boolean 已初始化返回 true，否则返回 false
 */
export const isDatabaseInitialized = (): boolean => {
  return isInitialized && dbInstance !== null;
};

/**
 * 重置数据库到初始状态
 * 
 * 功能：
 * - 删除现有数据库
 * - 重新创建并初始化数据库
 * 
 * ⚠️ 警告：此操作将删除所有数据，常用于开发和测试环境
 * 
 * @throws 重置失败时抛出错误
 */
export const resetDatabase = async (): Promise<void> => {
  await deleteDatabase();
  await initDatabase();
};
