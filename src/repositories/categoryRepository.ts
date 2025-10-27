import {Category} from '@/types';
import {TABLES} from '@/database/schema';
import {CategoryRow} from '@/database/types';
import {mapCategoryRowToDomain, mapCategoryToRow} from '@/database/mappers';
import {BaseRepository} from './baseRepository';

/**
 * 分类仓储
 * 负责分类的 CRUD 操作
 */
export class CategoryRepository extends BaseRepository {
  /**
   * 获取所有分类
   */
  async findAll(): Promise<Category[]> {
    const [result] = await this.executeSql(
      `SELECT * FROM ${TABLES.CATEGORIES} ORDER BY type, name ASC`,
    );
    const rows = this.extractRows<CategoryRow>(result);
    return rows.map(mapCategoryRowToDomain);
  }

  /**
   * 根据 ID 获取分类
   */
  async findById(id: string): Promise<Category | null> {
    const [result] = await this.executeSql(
      `SELECT * FROM ${TABLES.CATEGORIES} WHERE id = ?`,
      [id],
    );
    const row = this.extractFirstRow<CategoryRow>(result);
    return row ? mapCategoryRowToDomain(row) : null;
  }

  /**
   * 根据类型获取分类
   */
  async findByType(type: 'income' | 'expense'): Promise<Category[]> {
    const [result] = await this.executeSql(
      `SELECT * FROM ${TABLES.CATEGORIES} WHERE type = ? ORDER BY name ASC`,
      [type],
    );
    const rows = this.extractRows<CategoryRow>(result);
    return rows.map(mapCategoryRowToDomain);
  }

  /**
   * 根据名称和类型查找分类
   */
  async findByNameAndType(name: string, type: 'income' | 'expense'): Promise<Category | null> {
    const [result] = await this.executeSql(
      `SELECT * FROM ${TABLES.CATEGORIES} WHERE name = ? AND type = ?`,
      [name, type],
    );
    const row = this.extractFirstRow<CategoryRow>(result);
    return row ? mapCategoryRowToDomain(row) : null;
  }

  /**
   * 获取默认分类
   */
  async findDefaults(): Promise<Category[]> {
    const [result] = await this.executeSql(
      `SELECT * FROM ${TABLES.CATEGORIES} WHERE isDefault = 1 ORDER BY type, name ASC`,
    );
    const rows = this.extractRows<CategoryRow>(result);
    return rows.map(mapCategoryRowToDomain);
  }

  /**
   * 获取自定义分类（非默认）
   */
  async findCustom(): Promise<Category[]> {
    const [result] = await this.executeSql(
      `SELECT * FROM ${TABLES.CATEGORIES} WHERE isDefault = 0 ORDER BY type, name ASC`,
    );
    const rows = this.extractRows<CategoryRow>(result);
    return rows.map(mapCategoryRowToDomain);
  }

  /**
   * 创建分类
   */
  async create(category: Category): Promise<void> {
    const row = mapCategoryToRow(category);
    await this.executeSql(
      `INSERT INTO ${TABLES.CATEGORIES}
       (id, name, icon, color, type, isDefault)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [row.id, row.name, row.icon, row.color, row.type, row.isDefault],
    );
  }

  /**
   * 更新分类
   */
  async update(category: Category): Promise<void> {
    const row = mapCategoryToRow(category);
    await this.executeSql(
      `UPDATE ${TABLES.CATEGORIES}
       SET name = ?, icon = ?, color = ?, type = ?, isDefault = ?
       WHERE id = ?`,
      [row.name, row.icon, row.color, row.type, row.isDefault, row.id],
    );
  }

  /**
   * 删除分类
   */
  async delete(id: string): Promise<void> {
    await this.executeSql(`DELETE FROM ${TABLES.CATEGORIES} WHERE id = ?`, [id]);
  }

  /**
   * 检查分类是否存在
   */
  async exists(id: string): Promise<boolean> {
    return super.exists(TABLES.CATEGORIES, id);
  }

  /**
   * 检查分类名称是否已存在（同类型下）
   */
  async nameExists(name: string, type: 'income' | 'expense', excludeId?: string): Promise<boolean> {
    const sql = excludeId
      ? `SELECT COUNT(*) as count FROM ${TABLES.CATEGORIES} 
         WHERE name = ? AND type = ? AND id != ?`
      : `SELECT COUNT(*) as count FROM ${TABLES.CATEGORIES} 
         WHERE name = ? AND type = ?`;
    
    const params = excludeId ? [name, type, excludeId] : [name, type];
    const [result] = await this.executeSql(sql, params);
    const row = this.extractFirstRow<{count: number}>(result);
    return row ? row.count > 0 : false;
  }

  /**
   * 获取分类总数
   */
  async count(): Promise<number> {
    return super.count(TABLES.CATEGORIES);
  }

  /**
   * 批量创建分类（用于初始化默认分类）
   */
  async createBatch(categories: Category[]): Promise<void> {
    await this.executeTransaction(async db => {
      for (const category of categories) {
        const row = mapCategoryToRow(category);
        await db.executeSql(
          `INSERT OR IGNORE INTO ${TABLES.CATEGORIES}
           (id, name, icon, color, type, isDefault)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [row.id, row.name, row.icon, row.color, row.type, row.isDefault],
        );
      }
    });
  }
}

// 导出单例实例
export const categoryRepository = new CategoryRepository();
