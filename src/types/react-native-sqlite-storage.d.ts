declare module 'react-native-sqlite-storage' {
  export interface SQLiteDatabase {
    executeSql(
      statement: string,
      params?: any[],
    ): Promise<[ResultSet]>;
    close(): Promise<void>;
  }

  export interface ResultSet {
    rows: {
      length: number;
      item(index: number): any;
    };
    rowsAffected: number;
    insertId?: number;
  }

  export interface DatabaseParams {
    name: string;
    location?: string;
  }

  const SQLite: {
    openDatabase(params: DatabaseParams): Promise<SQLiteDatabase>;
    enablePromise(enable: boolean): void;
  };

  export default SQLite;
}
