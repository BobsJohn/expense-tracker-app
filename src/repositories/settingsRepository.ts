import {TABLES} from '@/database/schema';
import {SettingsRow} from '@/database/types';
import {BaseRepository} from './baseRepository';

/**
 * 设置仓储
 * 负责应用设置的存储和检索
 */
export class SettingsRepository extends BaseRepository {
  /**
   * 获取设置值
   */
  async get(key: string): Promise<string | null> {
    const [result] = await this.executeSql(
      `SELECT value FROM ${TABLES.SETTINGS} WHERE key = ?`,
      [key],
    );
    const row = this.extractFirstRow<SettingsRow>(result);
    return row ? row.value : null;
  }

  /**
   * 设置值
   */
  async set(key: string, value: string): Promise<void> {
    await this.executeSql(
      `INSERT OR REPLACE INTO ${TABLES.SETTINGS} (key, value) VALUES (?, ?)`,
      [key, value],
    );
  }

  /**
   * 删除设置
   */
  async delete(key: string): Promise<void> {
    await this.executeSql(`DELETE FROM ${TABLES.SETTINGS} WHERE key = ?`, [key]);
  }

  /**
   * 获取所有设置
   */
  async getAll(): Promise<Record<string, string>> {
    const [result] = await this.executeSql(`SELECT * FROM ${TABLES.SETTINGS}`);
    const rows = this.extractRows<SettingsRow>(result);
    const settings: Record<string, string> = {};
    rows.forEach(row => {
      settings[row.key] = row.value;
    });
    return settings;
  }

  /**
   * 批量设置
   */
  async setBatch(settings: Record<string, string>): Promise<void> {
    await this.executeTransaction(async db => {
      for (const [key, value] of Object.entries(settings)) {
        await db.executeSql(
          `INSERT OR REPLACE INTO ${TABLES.SETTINGS} (key, value) VALUES (?, ?)`,
          [key, value],
        );
      }
    });
  }

  /**
   * 清除所有设置
   */
  async clear(): Promise<void> {
    await this.executeSql(`DELETE FROM ${TABLES.SETTINGS}`);
  }

  /**
   * 检查设置是否存在
   */
  async has(key: string): Promise<boolean> {
    const [result] = await this.executeSql(
      `SELECT COUNT(*) as count FROM ${TABLES.SETTINGS} WHERE key = ?`,
      [key],
    );
    const row = this.extractFirstRow<{count: number}>(result);
    return row ? row.count > 0 : false;
  }
}

// 设置键常量
export const SETTINGS_KEYS = {
  DB_INITIALIZED: 'db_initialized',
  DATA_SEEDED: 'data_seeded',
  THEME: 'theme',
  LANGUAGE: 'language',
  CURRENCY: 'currency',
  LAST_SYNC: 'last_sync',
} as const;

// 导出单例实例
export const settingsRepository = new SettingsRepository();
