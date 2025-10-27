import {Account} from '@/types';
import {TABLES} from '@/database/schema';
import {AccountRow} from '@/database/types';
import {mapAccountRowToDomain, mapAccountToRow} from '@/database/mappers';
import {BaseRepository} from './baseRepository';

/**
 * 账户仓储
 * 负责账户的 CRUD 操作
 */
export class AccountRepository extends BaseRepository {
  /**
   * 获取所有账户
   */
  async findAll(): Promise<Account[]> {
    const [result] = await this.executeSql(
      `SELECT * FROM ${TABLES.ACCOUNTS} ORDER BY createdAt ASC`,
    );
    const rows = this.extractRows<AccountRow>(result);
    return rows.map(mapAccountRowToDomain);
  }

  /**
   * 根据 ID 获取账户
   */
  async findById(id: string): Promise<Account | null> {
    const [result] = await this.executeSql(
      `SELECT * FROM ${TABLES.ACCOUNTS} WHERE id = ?`,
      [id],
    );
    const row = this.extractFirstRow<AccountRow>(result);
    return row ? mapAccountRowToDomain(row) : null;
  }

  /**
   * 根据类型获取账户
   */
  async findByType(type: Account['type']): Promise<Account[]> {
    const [result] = await this.executeSql(
      `SELECT * FROM ${TABLES.ACCOUNTS} WHERE type = ? ORDER BY createdAt ASC`,
      [type],
    );
    const rows = this.extractRows<AccountRow>(result);
    return rows.map(mapAccountRowToDomain);
  }

  /**
   * 创建账户
   */
  async create(account: Account): Promise<void> {
    const row = mapAccountToRow(account);
    await this.executeSql(
      `INSERT INTO ${TABLES.ACCOUNTS} 
       (id, name, type, balance, currency, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [row.id, row.name, row.type, row.balance, row.currency, row.createdAt, row.updatedAt],
    );
  }

  /**
   * 更新账户
   */
  async update(account: Account): Promise<void> {
    const row = mapAccountToRow(account);
    await this.executeSql(
      `UPDATE ${TABLES.ACCOUNTS}
       SET name = ?, type = ?, balance = ?, currency = ?, updatedAt = ?
       WHERE id = ?`,
      [row.name, row.type, row.balance, row.currency, row.updatedAt, row.id],
    );
  }

  /**
   * 更新账户余额
   */
  async updateBalance(id: string, balance: number): Promise<void> {
    const updatedAt = new Date().toISOString();
    await this.executeSql(
      `UPDATE ${TABLES.ACCOUNTS}
       SET balance = ?, updatedAt = ?
       WHERE id = ?`,
      [balance, updatedAt, id],
    );
  }

  /**
   * 删除账户
   */
  async delete(id: string): Promise<void> {
    await this.executeSql(`DELETE FROM ${TABLES.ACCOUNTS} WHERE id = ?`, [id]);
  }

  /**
   * 检查账户是否存在
   */
  async exists(id: string): Promise<boolean> {
    return super.exists(TABLES.ACCOUNTS, id);
  }

  /**
   * 获取账户总数
   */
  async count(): Promise<number> {
    return super.count(TABLES.ACCOUNTS);
  }

  /**
   * 批量创建账户（用于初始化）
   */
  async createBatch(accounts: Account[]): Promise<void> {
    await this.executeTransaction(async db => {
      for (const account of accounts) {
        const row = mapAccountToRow(account);
        await db.executeSql(
          `INSERT INTO ${TABLES.ACCOUNTS} 
           (id, name, type, balance, currency, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [row.id, row.name, row.type, row.balance, row.currency, row.createdAt, row.updatedAt],
        );
      }
    });
  }
}

// 导出单例实例
export const accountRepository = new AccountRepository();
