export interface DbtTest {
  id: string;
  name: string;
  type: string;
  arguments?: Record<string, any>;
  where?: string;
  config?: Record<string, string>;
}

export interface DbtTestColumn {
  id: string;
  name: string;
  description?: string;
  tests: DbtTest[];
}

export interface DbtTestTable {
  id: string;
  name: string;
  description?: string;
  columns: DbtTestColumn[];
}

export interface DbtTestSource {
  id: string;
  name: string;
  database: string;
  schema: string;
  tables: DbtTestTable[];
  expanded: boolean;
}
