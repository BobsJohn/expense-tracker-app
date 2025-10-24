import transactionsReducer from '@/store/slices/transactionsSlice';
import {updateCategory, deleteCategory} from '@/store/slices/categoriesSlice';
import {Category, CategoryType, Transaction} from '@/types';
import {CategoryInput} from '@/store/slices/categoriesSlice';

const createState = () => ({
  transactions: [
    {
      id: 'tx-1',
      accountId: 'acc-1',
      amount: -50,
      category: 'Food',
      description: 'Lunch',
      date: '2024-01-10',
      type: 'expense' as const,
    },
    {
      id: 'tx-2',
      accountId: 'acc-1',
      amount: 2000,
      category: 'Salary',
      description: 'Monthly salary',
      date: '2024-01-01',
      type: 'income' as const,
    },
  ] as Transaction[],
  loading: false,
  error: null as string | null,
});

const createCategory = (
  overrides: Partial<Category> & {id: string; name: string; type: CategoryType},
): Category => ({
  icon: 'dots-horizontal',
  color: '#CCCCCC',
  isDefault: false,
  ...overrides,
});

describe('transactionsSlice category interactions', () => {
  it('renames matching transactions when a category name changes', () => {
    const previous = createCategory({id: 'cat-food', name: 'Food', type: 'expense'});
    const updates: CategoryInput = {
      name: 'Dining',
      icon: previous.icon,
      color: previous.color,
      type: previous.type,
    };

    const result = transactionsReducer(createState(), updateCategory({
      id: previous.id,
      updates,
      previous,
    }));

    const updated = result.transactions.find(tx => tx.id === 'tx-1');
    expect(updated?.category).toBe('Dining');
  });

  it('updates transaction type when category type changes', () => {
    const previous = createCategory({id: 'cat-food', name: 'Food', type: 'expense'});
    const updates: CategoryInput = {
      name: 'Food',
      icon: previous.icon,
      color: previous.color,
      type: 'income',
    };

    const result = transactionsReducer(createState(), updateCategory({
      id: previous.id,
      updates,
      previous,
    }));

    const updated = result.transactions.find(tx => tx.id === 'tx-1');
    expect(updated?.type).toBe('income');
  });

  it('reassigns transactions to a replacement category on delete', () => {
    const category = createCategory({id: 'cat-food', name: 'Food', type: 'expense'});
    const replacement = createCategory({id: 'cat-groceries', name: 'Groceries', type: 'expense'});

    const result = transactionsReducer(createState(), deleteCategory({
      id: category.id,
      category,
      reassignmentCategory: replacement,
    }));

    const updated = result.transactions.find(tx => tx.id === 'tx-1');
    expect(updated?.category).toBe('Groceries');
    expect(updated?.type).toBe('expense');
  });

  it('marks transactions as uncategorized when deleted without reassignment', () => {
    const category = createCategory({id: 'cat-food', name: 'Food', type: 'expense'});

    const result = transactionsReducer(createState(), deleteCategory({
      id: category.id,
      category,
    }));

    const updated = result.transactions.find(tx => tx.id === 'tx-1');
    expect(updated?.category).toBe('Uncategorized');
  });
});
