// 数据库表结构定义

export const TABLES = {
  ACCOUNTS: 'accounts',
  TRANSACTIONS: 'transactions',
  CATEGORIES: 'categories',
  BUDGETS: 'budgets',
  TRANSFERS: 'transfers',
  SETTINGS: 'settings',
  DB_VERSION: 'db_version',
} as const;

export const SCHEMA_VERSION = 1;

// 创建表的 SQL 语句
export const CREATE_TABLES_SQL = {
  accounts: `
    CREATE TABLE IF NOT EXISTS ${TABLES.ACCOUNTS} (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('checking', 'savings', 'credit', 'investment')),
      balance REAL NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'USD',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `,

  transactions: `
    CREATE TABLE IF NOT EXISTS ${TABLES.TRANSACTIONS} (
      id TEXT PRIMARY KEY,
      accountId TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      memo TEXT,
      transferId TEXT,
      relatedAccountId TEXT,
      FOREIGN KEY (accountId) REFERENCES ${TABLES.ACCOUNTS}(id) ON DELETE CASCADE
    );
  `,

  categories: `
    CREATE TABLE IF NOT EXISTS ${TABLES.CATEGORIES} (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      isDefault INTEGER NOT NULL DEFAULT 0,
      UNIQUE(name, type)
    );
  `,

  budgets: `
    CREATE TABLE IF NOT EXISTS ${TABLES.BUDGETS} (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      budgetedAmount REAL NOT NULL,
      spentAmount REAL NOT NULL DEFAULT 0,
      period TEXT NOT NULL CHECK(period IN ('monthly', 'yearly')),
      currency TEXT NOT NULL DEFAULT 'USD',
      alertThreshold REAL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `,

  transfers: `
    CREATE TABLE IF NOT EXISTS ${TABLES.TRANSFERS} (
      id TEXT PRIMARY KEY,
      sourceAccountId TEXT NOT NULL,
      destinationAccountId TEXT NOT NULL,
      amount REAL NOT NULL CHECK(amount > 0),
      date TEXT NOT NULL,
      memo TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (sourceAccountId) REFERENCES ${TABLES.ACCOUNTS}(id) ON DELETE CASCADE,
      FOREIGN KEY (destinationAccountId) REFERENCES ${TABLES.ACCOUNTS}(id) ON DELETE CASCADE
    );
  `,

  settings: `
    CREATE TABLE IF NOT EXISTS ${TABLES.SETTINGS} (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `,

  dbVersion: `
    CREATE TABLE IF NOT EXISTS ${TABLES.DB_VERSION} (
      version INTEGER PRIMARY KEY
    );
  `,
};

// 创建索引的 SQL 语句
export const CREATE_INDEXES_SQL = [
  `CREATE INDEX IF NOT EXISTS idx_transactions_accountId ON ${TABLES.TRANSACTIONS}(accountId);`,
  `CREATE INDEX IF NOT EXISTS idx_transactions_date ON ${TABLES.TRANSACTIONS}(date DESC);`,
  `CREATE INDEX IF NOT EXISTS idx_transactions_type ON ${TABLES.TRANSACTIONS}(type);`,
  `CREATE INDEX IF NOT EXISTS idx_transactions_category ON ${TABLES.TRANSACTIONS}(category);`,
  `CREATE INDEX IF NOT EXISTS idx_transactions_transferId ON ${TABLES.TRANSACTIONS}(transferId);`,
  `CREATE INDEX IF NOT EXISTS idx_categories_type ON ${TABLES.CATEGORIES}(type);`,
  `CREATE INDEX IF NOT EXISTS idx_budgets_category ON ${TABLES.BUDGETS}(category);`,
  `CREATE INDEX IF NOT EXISTS idx_transfers_sourceAccountId ON ${TABLES.TRANSFERS}(sourceAccountId);`,
  `CREATE INDEX IF NOT EXISTS idx_transfers_destinationAccountId ON ${TABLES.TRANSFERS}(destinationAccountId);`,
  `CREATE INDEX IF NOT EXISTS idx_transfers_date ON ${TABLES.TRANSFERS}(date DESC);`,
];
