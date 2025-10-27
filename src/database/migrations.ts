import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {CREATE_TABLES_SQL, CREATE_INDEXES_SQL, SCHEMA_VERSION, TABLES} from './schema';

// 数据库迁移管理
export interface Migration {
  version: number;
  up: (db: SQLiteDatabase) => Promise<void>;
  down?: (db: SQLiteDatabase) => Promise<void>;
}

// 迁移列表 - 按版本号升序排列
export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    up: async (db: SQLiteDatabase) => {
      // 版本 1: 初始化数据库结构
      await db.executeSql(CREATE_TABLES_SQL.accounts);
      await db.executeSql(CREATE_TABLES_SQL.transactions);
      await db.executeSql(CREATE_TABLES_SQL.categories);
      await db.executeSql(CREATE_TABLES_SQL.budgets);
      await db.executeSql(CREATE_TABLES_SQL.transfers);
      await db.executeSql(CREATE_TABLES_SQL.settings);
      await db.executeSql(CREATE_TABLES_SQL.dbVersion);

      // 创建索引
      for (const indexSql of CREATE_INDEXES_SQL) {
        await db.executeSql(indexSql);
      }

      // 设置初始版本号
      await db.executeSql(`INSERT INTO ${TABLES.DB_VERSION} (version) VALUES (?)`, [1]);
    },
  },
  // 未来的迁移可以在此添加
  // {
  //   version: 2,
  //   up: async (db: SQLiteDatabase) => {
  //     // 版本 2 的更改
  //   },
  // },
];

// 获取当前数据库版本
export const getCurrentVersion = async (db: SQLiteDatabase): Promise<number> => {
  try {
    const [result] = await db.executeSql(`SELECT version FROM ${TABLES.DB_VERSION} LIMIT 1`);
    if (result.rows.length > 0) {
      return result.rows.item(0).version;
    }
    return 0;
  } catch (error) {
    // 如果表不存在，返回 0
    return 0;
  }
};

// 更新版本号
export const updateVersion = async (db: SQLiteDatabase, version: number): Promise<void> => {
  const currentVersion = await getCurrentVersion(db);
  if (currentVersion === 0) {
    await db.executeSql(`INSERT INTO ${TABLES.DB_VERSION} (version) VALUES (?)`, [version]);
  } else {
    await db.executeSql(`UPDATE ${TABLES.DB_VERSION} SET version = ?`, [version]);
  }
};

// 运行所有待执行的迁移
export const runMigrations = async (db: SQLiteDatabase): Promise<void> => {
  const currentVersion = await getCurrentVersion(db);
  const pendingMigrations = MIGRATIONS.filter(m => m.version > currentVersion);

  if (pendingMigrations.length === 0) {
    console.log(`数据库已是最新版本: ${currentVersion}`);
    return;
  }

  console.log(`开始迁移: 从版本 ${currentVersion} 到 ${SCHEMA_VERSION}`);

  for (const migration of pendingMigrations) {
    console.log(`执行迁移到版本 ${migration.version}...`);
    try {
      await migration.up(db);
      await updateVersion(db, migration.version);
      console.log(`成功迁移到版本 ${migration.version}`);
    } catch (error) {
      console.error(`迁移到版本 ${migration.version} 失败:`, error);
      throw error;
    }
  }

  console.log(`迁移完成: 当前版本 ${SCHEMA_VERSION}`);
};

// 检查是否需要迁移
export const needsMigration = async (db: SQLiteDatabase): Promise<boolean> => {
  const currentVersion = await getCurrentVersion(db);
  return currentVersion < SCHEMA_VERSION;
};
