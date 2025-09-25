import * as yaml from 'js-yaml';
import type { DbtTestSource, DbtTestTable, DbtTest } from "./types";


function parseAcceptedValuesForYaml(acceptedValues: string): Array<string | number> {
  return acceptedValues.split(',').map(v => {
    const trimmed = v.trim();
    // Convert to number if it's a valid number, otherwise keep as string
    const num = Number(trimmed);
    return !isNaN(num) && isFinite(num) && trimmed !== '' ? num : trimmed;
  }).filter(v => v !== '');
}

function buildTestConfig(test: DbtTest): Record<string, string> {
  const config: Record<string, string> = {};
  if (test.severity) config.severity = test.severity;
  if (test.errorIf) config.error_if = test.errorIf;
  if (test.warnIf) config.warn_if = test.warnIf;
  return config;
}

function addWhereClause(testConfig: any, test: DbtTest, testType: string): void {
  if (test.where && test.where.trim() !== "") {
    testConfig[testType].where = test.where;
  }
}

function addConfigToTest(testConfig: any, test: DbtTest, testType: string): void {
  const config = buildTestConfig(test);
  if (Object.keys(config).length > 0) {
    testConfig[testType].config = config;
  }
}

function transformAcceptedValuesTest(test: DbtTest): Record<string, any> {
  if (!test.acceptedValues) return {};

  const values = parseAcceptedValuesForYaml(test.acceptedValues);
  const testConfig = {
    [test.type]: {
      values: values,
      quote: test.quoteValues || false
    }
  };

  addWhereClause(testConfig, test, test.type);
  addConfigToTest(testConfig, test, test.type);

  return testConfig;
}

function transformRelationshipsTest(test: DbtTest): Record<string, any> {
  const testConfig = {
    [test.type]: {
      to: test.sourceName ? `source('${test.sourceName}')` : '',
      field: test.columnName || ''
    }
  };

  addWhereClause(testConfig, test, test.type);
  addConfigToTest(testConfig, test, test.type);

  return testConfig;
}

function transformSimpleTest(test: DbtTest): any {
  if (test.where || test.severity || test.errorIf || test.warnIf) {
    const testConfig = { [test.type]: {} };
    addWhereClause(testConfig, test, test.type);
    addConfigToTest(testConfig, test, test.type);
    return testConfig;
  }

  return test.type;
}

function transformTest(test: DbtTest): any {
  if (test.type === "custom") {
    return test.name;
  }

  if (test.type === "accepted_values" && test.acceptedValues) {
    return transformAcceptedValuesTest(test);
  }

  if (test.type === "relationships" && (test.sourceName || test.columnName)) {
    return transformRelationshipsTest(test);
  }

  return transformSimpleTest(test);
}

function transformColumn(column: any): any {
  const columnConfig: any = {
    name: column.name
  };

  if (column.description) {
    columnConfig.description = column.description;
  }

  if (column.tests && column.tests.length > 0) {
    columnConfig.tests = column.tests.map(transformTest);
  }

  return columnConfig;
}

function transformTable(table: DbtTestTable): any {
  const tableConfig: any = {
    name: table.name
  };

  if (table.description) {
    tableConfig.description = table.description;
  }

  if (table.columns && table.columns.length > 0) {
    tableConfig.columns = table.columns.map(transformColumn);
  }

  return tableConfig;
}

function transformSource(source: DbtTestSource): any {
  const sourceConfig: any = {
    name: source.name,
    database: source.database,
    schema: source.schema
  };

  if (source.tables && source.tables.length > 0) {
    sourceConfig.tables = source.tables.map(transformTable);
  }

  return sourceConfig;
}

function generateDbtSourceYaml(sources: DbtTestSource[]): string {
  const dbtConfig = {
    version: 2,
    sources: sources.map(transformSource)
  };

  return yaml.dump(dbtConfig, {
    indent: 2,
    noRefs: true,
    quotingType: '"'
  });
}


function validateIdentifierName(value: string): { isValid: boolean; message?: string } {
  const pattern = /^[a-zA-Z0-9_]*$/;

  if (!pattern.test(value)) {
    return {
      isValid: false,
      message: 'Only letters, numbers, and underscores are allowed'
    };
  }

  return { isValid: true };
}

function validateDatabaseName(value: string): { isValid: boolean; message?: string } {
  const pattern = /^((sf|ol_latest|ol|backend|file)\.)?[a-zA-Z0-9_]*$/;

  if (!pattern.test(value)) {
    return {
      isValid: false,
      message: 'Invalid database pattern'
    };
  }

  return { isValid: true };
}

// Additional Utility Functions

export const parseAcceptedValues = (input: string): string[] => {
  if (!input || input.trim() === "") return [];

  return input
    .split(",")
    .map(v => v.trim())
    .filter(v => v !== "");
};

export {
  generateDbtSourceYaml,
  validateIdentifierName,
  validateDatabaseName
};