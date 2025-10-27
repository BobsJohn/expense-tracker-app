import {SQLiteDatabase, ResultSet} from 'react-native-sqlite-storage';
import {getDatabase} from '@/database/database';

/**
 * 基础仓储类
 * 提供通用的数据库操作方法
 */
export abstract class BaseRepository {
  protected async getDb(): Promise<SQLiteDatabase> {
    return getDatabase();
  }

  /**
   * 执行 SQL 查询
   */
  protected async executeSql(
    sql: string,
    params: any[] = [],
  ): Promise<[ResultSet]> {
    const db = await this.getDb();
    return db.executeSql(sql, params);
  }

  /**
   * 执行多个 SQL 语句（事务）
   */
  protected async executeTransaction(
    operations: (db: SQLiteDatabase) => Promise<void>,
  ): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          operations(tx as unknown as SQLiteDatabase)
            .then(() => resolve())
            .catch(reject);
        },
        error => {
          console.error('事务执行失败:', error);
          reject(error);
        },
        () => {
          resolve();
        },
      );
    });
  }

  /**
   * 从结果集中提取所有行
   */
  protected extractRows<T>(result: ResultSet): T[] {
    const rows: T[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      rows.push(result.rows.item(i));
    }
    return rows;
  }

  /**
   * 从结果集中提取第一行
   */
  protected extractFirstRow<T>(result: ResultSet): T | null {
    if (result.rows.length > 0) {
      return result.rows.item(0);
    }
    return null;
  }

  /**
   * 生成占位符字符串 (?, ?, ?)
   */
  protected generatePlaceholders(count: number): string {
    return Array(count).fill('?').join(', ');
  }

  /**
   * 检查记录是否存在
   */
  protected async exists(table: string, id: string): Promise<boolean> {
    const [result] = await this.executeSql(
      `SELECT COUNT(*) as count FROM ${table} WHERE id = ?`,
      [id],
    );
    const row = this.extractFirstRow<{count: number}>(result);
    return row ? row.count > 0 : false;
  }

  /**
   * 获取表中的记录数量
   */
  protected async count(table: string, whereClause?: string, params?: any[]): Promise<number> {
    const sql = whereClause
      ? `SELECT COUNT(*) as count FROM ${table} WHERE ${whereClause}`
      : `SELECT COUNT(*) as count FROM ${table}`;
    const [result] = await this.executeSql(sql, params);
    const row = this.extractFirstRow<{count: number}>(result);
    return row ? row.count : 0;
  }
}
