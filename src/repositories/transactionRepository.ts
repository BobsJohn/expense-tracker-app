import {Transaction} from '@/types';
import {TABLES} from '@/database/schema';
import {TransactionRow} from '@/database/types';
import {mapTransactionRowToDomain, mapTransactionToRow} from '@/database/mappers';
import {BaseRepository} from './baseRepository';

/**
 * 交易仓储
 * 负责交易的 CRUD 和查询操作
 */
export class TransactionRepository extends BaseRepository {
  /**
   * 获取所有交易（按日期降序）
   */
  async findAll(): Promise<Transaction[]> {
    const [result] = await this.executeSql(
      `SELECT * FROM ${TABLES.TRANSACTIONS} ORDER BY date DESC, id DESC`,
    );
    const rows = this.extractRows<TransactionRow>(result);
    return rows.map(mapTransactionRowToDomain);
  }

  /**
   * 根据 ID 获取交易
   */
  async findById(id: string): Promise<Transaction | null> {
    const [result] = await this.executeSql(
      `SELECT * FROM ${TABLES.TRANSACTIONS} WHERE id = ?`,
      [id],
    );
    const row = this.extractFirstRow<TransactionRow>(result);
    return row ? mapTransactionRowToDomain(row) : null;
  }

  /**
   * 根据账户 ID 获取交易
   */
  async findByAccountId(accountId: string): Promise<Transaction[]> {
    const [result] = await this.executeSql(
      `SELECT * FROM ${TABLES.TRANSACTIONS} 
       WHERE accountId = ? 
       ORDER BY date DESC, id DESC`,
      [accountId],
    );
    const rows = this.extractRows<TransactionRow>(result);
    return rows.map(mapTransactionRowToDomain);
  }

  /**
   * 根据日期范围获取交易
   */
  async findByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    const [result] = await this.executeSql(
      `SELECT * FROM ${TABLES.TRANSACTIONS}
       WHERE date >= ? AND date <= ?
       ORDER BY date DESC, id DESC`,
      [startDate, endDate],
    );
    const rows = this.extractRows<TransactionRow>(result);
    return rows.map(mapTransactionRowToDomain);
  }

  /**
   * 根据分类获取交易
   */
  async findByCategory(category: string): Promise<Transaction[]> {
    const [result] = await this.executeSql(
      `SELECT * FROM ${TABLES.TRANSACTIONS}
       WHERE category = ?
       ORDER BY date DESC, id DESC`,
      [category],
    );
    const rows = this.extractRows<TransactionRow>(result);
    return rows.map(mapTransactionRowToDomain);
  }

  /**
   * 根据类型获取交易
   */
  async findByType(type: 'income' | 'expense'): Promise<Transaction[]> {
    const [result] = await this.executeSql(
      `SELECT * FROM ${TABLES.TRANSACTIONS}
       WHERE type = ?
       ORDER BY date DESC, id DESC`,
      [type],
    );
    const rows = this.extractRows<TransactionRow>(result);
    return rows.map(mapTransactionRowToDomain);
  }

  /**
   * 根据转账 ID 获取交易
   */
  async findByTransferId(transferId: string): Promise<Transaction[]> {
    const [result] = await this.executeSql(
      `SELECT * FROM ${TABLES.TRANSACTIONS}
       WHERE transferId = ?
       ORDER BY date DESC, id DESC`,
      [transferId],
    );
    const rows = this.extractRows<TransactionRow>(result);
    return rows.map(mapTransactionRowToDomain);
  }

  /**
   * 创建交易
   */
  async create(transaction: Transaction): Promise<void> {
    const row = mapTransactionToRow(transaction);
    await this.executeSql(
      `INSERT INTO ${TABLES.TRANSACTIONS}
       (id, accountId, amount, category, description, date, type, memo, transferId, relatedAccountId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        row.id,
        row.accountId,
        row.amount,
        row.category,
        row.description,
        row.date,
        row.type,
        row.memo,
        row.transferId,
        row.relatedAccountId,
      ],
    );
  }

  /**
   * 更新交易
   */
  async update(transaction: Transaction): Promise<void> {
    const row = mapTransactionToRow(transaction);
    await this.executeSql(
      `UPDATE ${TABLES.TRANSACTIONS}
       SET accountId = ?, amount = ?, category = ?, description = ?, 
           date = ?, type = ?, memo = ?, transferId = ?, relatedAccountId = ?
       WHERE id = ?`,
      [
        row.accountId,
        row.amount,
        row.category,
        row.description,
        row.date,
        row.type,
        row.memo,
        row.transferId,
        row.relatedAccountId,
        row.id,
      ],
    );
  }

  /**
   * 删除交易
   */
  async delete(id: string): Promise<void> {
    await this.executeSql(`DELETE FROM ${TABLES.TRANSACTIONS} WHERE id = ?`, [id]);
  }

  /**
   * 根据账户删除所有交易
   */
  async deleteByAccountId(accountId: string): Promise<void> {
    await this.executeSql(`DELETE FROM ${TABLES.TRANSACTIONS} WHERE accountId = ?`, [accountId]);
  }

  /**
   * 检查交易是否存在
   */
  async exists(id: string): Promise<boolean> {
    return super.exists(TABLES.TRANSACTIONS, id);
  }

  /**
   * 获取交易总数
   */
  async count(): Promise<number> {
    return super.count(TABLES.TRANSACTIONS);
  }

  /**
   * 获取账户的交易总数
   */
  async countByAccountId(accountId: string): Promise<number> {
    return super.count(TABLES.TRANSACTIONS, 'accountId = ?', [accountId]);
  }

  /**
   * 批量更新分类名称（当分类重命名时）
   */
  async updateCategoryName(oldName: string, newName: string, type: 'income' | 'expense'): Promise<void> {
    await this.executeSql(
      `UPDATE ${TABLES.TRANSACTIONS}
       SET category = ?
       WHERE category = ? AND type = ?`,
      [newName, oldName, type],
    );
  }

  /**
   * 批量重新分配分类（当删除分类时）
   */
  async reassignCategory(
    oldCategory: string,
    newCategory: string,
    type: 'income' | 'expense',
  ): Promise<void> {
    await this.executeSql(
      `UPDATE ${TABLES.TRANSACTIONS}
       SET category = ?
       WHERE category = ? AND type = ?`,
      [newCategory, oldCategory, type],
    );
  }

  /**
   * 批量创建交易
   */
  async createBatch(transactions: Transaction[]): Promise<void> {
    await this.executeTransaction(async db => {
      for (const transaction of transactions) {
        const row = mapTransactionToRow(transaction);
        await db.executeSql(
          `INSERT INTO ${TABLES.TRANSACTIONS}
           (id, accountId, amount, category, description, date, type, memo, transferId, relatedAccountId)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            row.id,
            row.accountId,
            row.amount,
            row.category,
            row.description,
            row.date,
            row.type,
            row.memo,
            row.transferId,
            row.relatedAccountId,
          ],
        );
      }
    });
  }
}

// 导出单例实例
export const transactionRepository = new TransactionRepository();
