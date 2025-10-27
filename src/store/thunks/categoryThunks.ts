import {createAsyncThunk} from '@reduxjs/toolkit';
import {Category} from '@/types';
import {categoryRepository} from '@/repositories';

/**
 * 从数据库加载所有分类
 */
export const loadCategories = createAsyncThunk(
  'categories/loadCategories',
  async (_, {rejectWithValue}) => {
    try {
      const categories = await categoryRepository.findAll();
      return categories;
    } catch (error) {
      console.error('加载分类失败:', error);
      return rejectWithValue('Failed to load categories');
    }
  },
);

/**
 * 创建新分类
 */
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (category: Category, {rejectWithValue}) => {
    try {
      // 检查名称是否已存在
      const exists = await categoryRepository.nameExists(category.name, category.type);
      if (exists) {
        return rejectWithValue('CATEGORY_DUPLICATE');
      }

      await categoryRepository.create(category);
      return category;
    } catch (error) {
      console.error('创建分类失败:', error);
      return rejectWithValue('Failed to create category');
    }
  },
);

/**
 * 更新分类
 */
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async (
    payload: {id: string; updates: Partial<Category>; previous: Category},
    {rejectWithValue},
  ) => {
    try {
      const {id, updates, previous} = payload;

      // 检查是否为默认分类
      if (previous.isDefault) {
        return rejectWithValue('CATEGORY_READ_ONLY');
      }

      // 如果更改了名称，检查是否重复
      if (updates.name && updates.name !== previous.name) {
        const exists = await categoryRepository.nameExists(
          updates.name,
          updates.type || previous.type,
          id,
        );
        if (exists) {
          return rejectWithValue('CATEGORY_DUPLICATE');
        }
      }

      const updated: Category = {...previous, ...updates};
      await categoryRepository.update(updated);
      return {id, updates, previous};
    } catch (error) {
      console.error('更新分类失败:', error);
      return rejectWithValue('Failed to update category');
    }
  },
);

/**
 * 删除分类
 */
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (
    payload: {id: string; category: Category; reassignmentCategory?: Category},
    {rejectWithValue},
  ) => {
    try {
      const {id, category} = payload;

      // 检查是否为默认分类
      if (category.isDefault) {
        return rejectWithValue('CATEGORY_READ_ONLY');
      }

      await categoryRepository.delete(id);
      return payload;
    } catch (error) {
      console.error('删除分类失败:', error);
      return rejectWithValue('Failed to delete category');
    }
  },
);
