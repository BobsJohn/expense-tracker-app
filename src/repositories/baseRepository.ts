/**
 * 基础数据仓储类
 * 
 * 功能说明：
 * - 提供所有仓储类的基础数据库操作方法
 * - 封装通用的 CRUD 操作和事务处理
 * - 简化派生仓储类的实现
 * 
 * 设计模式：
 * - 使用仓储模式（Repository Pattern）
 * - 抽象类，需要被具体仓储类继承
 * - 提供模板方法供子类使用
 * 
 * @module repositories/baseRepository
 */
import {SQLiteDatabase, ResultSet} from 'react-native-sqlite-storage';
import {getDatabase} from '@/database/database';

/**
 * 基础仓储抽象类
 * 
 * 所有具体仓储类应继承此类以获得通用数据库操作能力
 */
export abstract class BaseRepository {
  protected async getDb(): Promise<SQLiteDatabase> {
    return getDatabase();
  }

  /**
   * 执行 SQL 查询语句
   * 
   * @param sql - SQL 查询语句
   * @param params - 查询参数数组（用于参数化查询，防止 SQL 注入）
   * @returns Promise<[ResultSet]> 查询结果集
   */
  protected async executeSql(
    sql: string,
    params: any[] = [],
  ): Promise<[ResultSet]> {
    const db = await this.getDb();
    return db.executeSql(sql, params);
  }

  /**
   * 执行数据库事务
   * 
   * 功能：在事务中执行多个 SQL 语句，保证原子性
   * 
   * @param operations - 事务操作函数
   * @returns Promise<void>
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
