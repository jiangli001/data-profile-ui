export interface DbtTest {
  id: string;
  name: string;
  type: string;
  where?: string;
  severity?: "error" | "warn";
  acceptedValues?: string;
  errorIf?: string;
  warnIf?: string;
  quoteValues?: boolean;
  sourceName?: string;
  columnName?: string;
}

export interface DbtTestColumn {
  id: string;
  name: string;
  description?: string;
  tests?: DbtTest[];
}

export interface DbtTestTable {
  id: string;
  name: string;
  description?: string;
  columns?: DbtTestColumn[];
}

export interface DbtTestSource {
  id: string;
  name: string;
  database: string;
  schema: string;
  tables?: DbtTestTable[];
  expanded: boolean;
}

// types for the DBT test section components
export type RelationshipArguments = {
  to: string;
  field: string;
};

export type TestArguments = {
  values?: Array<string | number>;
  valuesString?: string;
  quote?: boolean;
  sourceName?: string;
  columnName?: string;
} & Record<string, unknown>;

export const TEST_TYPES = {
  UNIQUE: "unique",
  NOT_NULL: "not_null",
  ACCEPTED_VALUES: "accepted_values",
  RELATIONSHIPS: "relationships",
} as const;

export type TestType = (typeof TEST_TYPES)[keyof typeof TEST_TYPES];

export const BUILT_IN_TESTS: readonly TestType[] = [
  TEST_TYPES.UNIQUE,
  TEST_TYPES.NOT_NULL,
  TEST_TYPES.ACCEPTED_VALUES,
  TEST_TYPES.RELATIONSHIPS,
];

// Config types for YAML generation
export type DbtTestColumnConfig = Partial<Omit<DbtTestColumn, "tests">> & {
  tests?: (string | Record<string, unknown>)[];
};

export type DbtTestTableConfig = Partial<Omit<DbtTestTable, "columns">> & {
  columns?: DbtTestColumnConfig[];
};

export type DbtTestSourceConfig = Partial<Omit<DbtTestSource, "tables">> & {
  tables?: DbtTestTableConfig[];
};
