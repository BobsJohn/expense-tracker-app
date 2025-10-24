import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
import {Account, Transaction, Budget} from '@/types';

SQLite.enablePromise(true);

const DATABASE_NAME = 'FinancialBudgetApp.db';

let db: SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<void> => {
  try {
    db = await SQLite.openDatabase({
      name: DATABASE_NAME,
      location: 'default',
    });

    await createTables();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

const createTables = async (): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized');
  }

  const createAccountsTable = `
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      balance REAL NOT NULL,
      currency TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `;

  const createTransactionsTable = `
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      accountId TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      type TEXT NOT NULL,
      memo TEXT,
      transferId TEXT,
      relatedAccountId TEXT,
      FOREIGN KEY (accountId) REFERENCES accounts(id) ON DELETE CASCADE
    );
  `;

  const createBudgetsTable = `
    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      budgetedAmount REAL NOT NULL,
      spentAmount REAL NOT NULL,
      period TEXT NOT NULL,
      currency TEXT NOT NULL,
      alertThreshold REAL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `;

  const createCategoriesTable = `
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      type TEXT NOT NULL,
      isDefault INTEGER DEFAULT 0
    );
  `;

  await db.executeSql(createAccountsTable);
  await db.executeSql(createTransactionsTable);
  await db.executeSql(createBudgetsTable);
  await db.executeSql(createCategoriesTable);

  await db.executeSql(
    'CREATE INDEX IF NOT EXISTS idx_transactions_accountId ON transactions(accountId);',
  );
  await db.executeSql('CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);');
  await db.executeSql('CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);');
  await db.executeSql(
    'CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);',
  );
};

export const insertTransaction = async (transaction: Transaction): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized');
  }

  await db.executeSql(
    `INSERT INTO transactions (id, accountId, amount, category, description, date, type, memo, transferId, relatedAccountId)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      transaction.id,
      transaction.accountId,
      transaction.amount,
      transaction.category,
      transaction.description,
      transaction.date,
      transaction.type,
      transaction.memo || null,
      transaction.transferId || null,
      transaction.relatedAccountId || null,
    ],
  );
};

export const updateTransaction = async (transaction: Transaction): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized');
  }

  await db.executeSql(
    `UPDATE transactions 
     SET accountId = ?, amount = ?, category = ?, description = ?, date = ?, type = ?, memo = ?, transferId = ?, relatedAccountId = ?
     WHERE id = ?`,
    [
      transaction.accountId,
      transaction.amount,
      transaction.category,
      transaction.description,
      transaction.date,
      transaction.type,
      transaction.memo || null,
      transaction.transferId || null,
      transaction.relatedAccountId || null,
      transaction.id,
    ],
  );
};

export const deleteTransaction = async (transactionId: string): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized');
  }

  await db.executeSql('DELETE FROM transactions WHERE id = ?', [transactionId]);
};

export const getTransactions = async (): Promise<Transaction[]> => {
  if (!db) {
    throw new Error('Database not initialized');
  }

  const [results] = await db.executeSql('SELECT * FROM transactions ORDER BY date DESC');
  const transactions: Transaction[] = [];

  for (let i = 0; i < results.rows.length; i++) {
    const row = results.rows.item(i);
    transactions.push({
      id: row.id,
      accountId: row.accountId,
      amount: row.amount,
      category: row.category,
      description: row.description,
      date: row.date,
      type: row.type,
      memo: row.memo || undefined,
      transferId: row.transferId || undefined,
      relatedAccountId: row.relatedAccountId || undefined,
    });
  }

  return transactions;
};

export const getTransactionById = async (transactionId: string): Promise<Transaction | null> => {
  if (!db) {
    throw new Error('Database not initialized');
  }

  const [results] = await db.executeSql('SELECT * FROM transactions WHERE id = ?', [transactionId]);

  if (results.rows.length === 0) {
    return null;
  }

  const row = results.rows.item(0);
  return {
    id: row.id,
    accountId: row.accountId,
    amount: row.amount,
    category: row.category,
    description: row.description,
    date: row.date,
    type: row.type,
    memo: row.memo || undefined,
    transferId: row.transferId || undefined,
    relatedAccountId: row.relatedAccountId || undefined,
  };
};

export const insertAccount = async (account: Account): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized');
  }

  await db.executeSql(
    `INSERT INTO accounts (id, name, type, balance, currency, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      account.id,
      account.name,
      account.type,
      account.balance,
      account.currency,
      account.createdAt,
      account.updatedAt,
    ],
  );
};

export const updateAccount = async (account: Account): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized');
  }

  await db.executeSql(
    `UPDATE accounts 
     SET name = ?, type = ?, balance = ?, currency = ?, updatedAt = ?
     WHERE id = ?`,
    [account.name, account.type, account.balance, account.currency, account.updatedAt, account.id],
  );
};

export const getAccounts = async (): Promise<Account[]> => {
  if (!db) {
    throw new Error('Database not initialized');
  }

  const [results] = await db.executeSql('SELECT * FROM accounts');
  const accounts: Account[] = [];

  for (let i = 0; i < results.rows.length; i++) {
    const row = results.rows.item(i);
    accounts.push({
      id: row.id,
      name: row.name,
      type: row.type,
      balance: row.balance,
      currency: row.currency,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  return accounts;
};

export const insertBudget = async (budget: Budget): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized');
  }

  await db.executeSql(
    `INSERT INTO budgets (id, category, budgetedAmount, spentAmount, period, currency, alertThreshold, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      budget.id,
      budget.category,
      budget.budgetedAmount,
      budget.spentAmount,
      budget.period,
      budget.currency,
      budget.alertThreshold || null,
      budget.createdAt,
      budget.updatedAt,
    ],
  );
};

export const updateBudget = async (budget: Budget): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized');
  }

  await db.executeSql(
    `UPDATE budgets 
     SET category = ?, budgetedAmount = ?, spentAmount = ?, period = ?, currency = ?, alertThreshold = ?, updatedAt = ?
     WHERE id = ?`,
    [
      budget.category,
      budget.budgetedAmount,
      budget.spentAmount,
      budget.period,
      budget.currency,
      budget.alertThreshold || null,
      budget.updatedAt,
      budget.id,
    ],
  );
};

export const getBudgets = async (): Promise<Budget[]> => {
  if (!db) {
    throw new Error('Database not initialized');
  }

  const [results] = await db.executeSql('SELECT * FROM budgets');
  const budgets: Budget[] = [];

  for (let i = 0; i < results.rows.length; i++) {
    const row = results.rows.item(i);
    budgets.push({
      id: row.id,
      category: row.category,
      budgetedAmount: row.budgetedAmount,
      spentAmount: row.spentAmount,
      period: row.period,
      currency: row.currency,
      alertThreshold: row.alertThreshold || undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  return budgets;
};

export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.close();
    db = null;
  }
};
