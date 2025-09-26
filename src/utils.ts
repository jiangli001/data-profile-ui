import * as yaml from "js-yaml";
import type {
  DbtTestSource,
  DbtTestTable,
  DbtTestColumn,
  DbtTest,
  DbtTestColumnConfig,
  DbtTestTableConfig,
  DbtTestSourceConfig,
} from "./types";

function parseAcceptedValuesForYaml(
  acceptedValues: string,
): Array<string | number> {
  return acceptedValues
    .split(",")
    .map((v) => {
      const trimmed = v.trim();
      // Convert to number if it's a valid number, otherwise keep as string
      const num = Number(trimmed);
      return !isNaN(num) && isFinite(num) && trimmed !== "" ? num : trimmed;
    })
    .filter((v) => v !== "");
}

function buildTestWithConfig(
  typeSpecificConfig: Record<string, unknown>,
  test: DbtTest,
): string | Record<string, unknown> {
  const commonConfig: Record<string, string> = {};

  if (test.severity) commonConfig.severity = test.severity;
  if (test.errorIf) commonConfig.error_if = test.errorIf;
  if (test.warnIf) commonConfig.warn_if = test.warnIf;
  if (test.where && test.where.trim() !== "") {
    commonConfig.where = test.where;
  }

  const hasCommonConfig = Object.keys(commonConfig).length > 0;
  const hasTypeSpecificConfig = Object.keys(typeSpecificConfig).length > 0;

  if (!hasCommonConfig && !hasTypeSpecificConfig) {
    return test.type;
  }

  const testConfig: Record<string, unknown> = { ...typeSpecificConfig };
  if (hasCommonConfig) {
    testConfig.config = commonConfig;
  }

  return { [test.type]: testConfig };
}

function transformAcceptedValuesTest(test: DbtTest): Record<string, unknown> {
  if (!test.acceptedValues) return {};

  const values = parseAcceptedValuesForYaml(test.acceptedValues);
  const typeSpecificConfig = {
    arguments: {
      values: values,
      quote: test.quoteValues,
    },
  };

  return buildTestWithConfig(typeSpecificConfig, test) as Record<
    string,
    unknown
  >;
}

function transformRelationshipsTest(test: DbtTest): Record<string, unknown> {
  const typeSpecificConfig = {
    arguments: {
      to: test.sourceName ? `source('${test.sourceName}')` : "",
      field: test.columnName || "",
    },
  };

  return buildTestWithConfig(typeSpecificConfig, test) as Record<
    string,
    unknown
  >;
}

function transformTest(test: DbtTest): string | Record<string, unknown> {
  if (test.type === "custom") {
    return test.name;
  }

  if (test.type === "accepted_values" && test.acceptedValues) {
    return transformAcceptedValuesTest(test);
  }

  if (test.type === "relationships" && (test.sourceName || test.columnName)) {
    return transformRelationshipsTest(test);
  }

  return buildTestWithConfig({}, test);
}

function transformColumn(column: DbtTestColumn): DbtTestColumnConfig {
  const columnConfig: DbtTestColumnConfig = {
    name: column.name,
  };

  if (column.description) {
    columnConfig.description = column.description;
  }

  if (column.tests && column.tests.length > 0) {
    columnConfig.tests = column.tests.map(transformTest);
  }

  return columnConfig;
}

function transformTable(table: DbtTestTable): DbtTestTableConfig {
  const tableConfig: DbtTestTableConfig = {
    name: table.name,
  };

  if (table.description) {
    tableConfig.description = table.description;
  }

  if (table.columns && table.columns.length > 0) {
    tableConfig.columns = table.columns.map(transformColumn);
  }

  return tableConfig;
}

function transformSource(source: DbtTestSource): DbtTestSourceConfig {
  const sourceConfig: DbtTestSourceConfig = {
    name: source.name,
    database: source.database,
    schema: source.schema,
  };

  if (source.tables && source.tables.length > 0) {
    sourceConfig.tables = source.tables.map(transformTable);
  }

  return sourceConfig;
}

function generateDbtSourceYaml(sources: DbtTestSource[]): string {
  const dbtConfig = {
    version: 2,
    sources: sources.map(transformSource),
  };

  return yaml.dump(dbtConfig, {
    indent: 2,
    noRefs: true,
    quotingType: '"',
  });
}

function validateFieldName(value: string): {
  isValid: boolean;
  message?: string;
} {
  const pattern = /^[a-zA-Z0-9_]*$/;

  if (!pattern.test(value)) {
    return {
      isValid: false,
      message: "Only letters, numbers, and underscores are allowed",
    };
  }

  return { isValid: true };
}

function validateDatabaseName(value: string): {
  isValid: boolean;
  message?: string;
} {
  const pattern = /^((sf|ol_latest|ol|backend|file)\.)?[a-zA-Z0-9_]*$/;

  if (!pattern.test(value)) {
    return {
      isValid: false,
      message: "Invalid database pattern",
    };
  }

  return { isValid: true };
}

export { generateDbtSourceYaml, validateFieldName, validateDatabaseName };
