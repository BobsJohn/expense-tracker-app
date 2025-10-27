import {Budget} from '@/types';
import {TABLES} from '@/database/schema';
import {BudgetRow} from '@/database/types';
import {mapBudgetRowToDomain, mapBudgetToRow} from '@/database/mappers';
import {BaseRepository} from './baseRepository';

/**
 * 预算仓储
 * 负责预算的 CRUD 操作
 */
export class BudgetRepository extends BaseRepository {
  /**
   * 获取所有预算
   */
  async findAll(): Promise<Budget[]> {
    const [result] = await this.executeSql(
      `SELECT * FROM ${TABLES.BUDGETS} ORDER BY createdAt DESC`,
    );
    const rows = this.extractRows<BudgetRow>(result);
    return rows.map(mapBudgetRowToDomain);
  }

  /**
   * 根据 ID 获取预算
   */
  async findById(id: string): Promise<Budget | null> {
    const [result] = await this.executeSql(
      `SELECT * FROM ${TABLES.BUDGETS} WHERE id = ?`,
      [id],
    );
    const row = this.extractFirstRow<BudgetRow>(result);
    return row ? mapBudgetRowToDomain(row) : null;
  }

  /**
   * 根据分类获取预算
   */
  async findByCategory(category: string): Promise<Budget[]> {
    const [result] = await this.executeSql(
      `SELECT * FROM ${TABLES.BUDGETS} WHERE category = ? ORDER BY createdAt DESC`,
      [category],
    );
    const rows = this.extractRows<BudgetRow>(result);
    return rows.map(mapBudgetRowToDomain);
  }

  /**
   * 根据周期获取预算
   */
  async findByPeriod(period: 'monthly' | 'yearly'): Promise<Budget[]> {
    const [result] = await this.executeSql(
      `SELECT * FROM ${TABLES.BUDGETS} WHERE period = ? ORDER BY createdAt DESC`,
      [period],
    );
    const rows = this.extractRows<BudgetRow>(result);
    return rows.map(mapBudgetRowToDomain);
  }

  /**
   * 创建预算
   */
  async create(budget: Budget): Promise<void> {
    const row = mapBudgetToRow(budget);
    await this.executeSql(
      `INSERT INTO ${TABLES.BUDGETS}
       (id, category, budgetedAmount, spentAmount, period, currency, alertThreshold, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        row.id,
        row.category,
        row.budgetedAmount,
        row.spentAmount,
        row.period,
        row.currency,
        row.alertThreshold,
        row.createdAt,
        row.updatedAt,
      ],
    );
  }

  /**
   * 更新预算
   */
  async update(budget: Budget): Promise<void> {
    const row = mapBudgetToRow(budget);
    await this.executeSql(
      `UPDATE ${TABLES.BUDGETS}
       SET category = ?, budgetedAmount = ?, spentAmount = ?, 
           period = ?, currency = ?, alertThreshold = ?, updatedAt = ?
       WHERE id = ?`,
      [
        row.category,
        row.budgetedAmount,
        row.spentAmount,
        row.period,
        row.currency,
        row.alertThreshold,
        row.updatedAt,
        row.id,
      ],
    );
  }

  /**
   * 更新预算的已支出金额
   */
  async updateSpentAmount(id: string, spentAmount: number): Promise<void> {
    const updatedAt = new Date().toISOString();
    await this.executeSql(
      `UPDATE ${TABLES.BUDGETS}
       SET spentAmount = ?, updatedAt = ?
       WHERE id = ?`,
      [spentAmount, updatedAt, id],
    );
  }

  /**
   * 删除预算
   */
  async delete(id: string): Promise<void> {
    await this.executeSql(`DELETE FROM ${TABLES.BUDGETS} WHERE id = ?`, [id]);
  }

  /**
   * 检查预算是否存在
   */
  async exists(id: string): Promise<boolean> {
    return super.exists(TABLES.BUDGETS, id);
  }

  /**
   * 获取预算总数
   */
  async count(): Promise<number> {
    return super.count(TABLES.BUDGETS);
  }

  /**
   * 批量创建预算
   */
  async createBatch(budgets: Budget[]): Promise<void> {
    await this.executeTransaction(async db => {
      for (const budget of budgets) {
        const row = mapBudgetToRow(budget);
        await db.executeSql(
          `INSERT INTO ${TABLES.BUDGETS}
           (id, category, budgetedAmount, spentAmount, period, currency, alertThreshold, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            row.id,
            row.category,
            row.budgetedAmount,
            row.spentAmount,
            row.period,
            row.currency,
            row.alertThreshold,
            row.createdAt,
            row.updatedAt,
          ],
        );
      }
    });
  }
}

// 导出单例实例
export const budgetRepository = new BudgetRepository();
