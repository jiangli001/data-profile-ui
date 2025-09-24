import * as yaml from 'js-yaml';
import type { DbtTestSource } from "./types";

function generateDbtSourceYaml(sources: DbtTestSource[]): string {
  const dbtConfig = {
    version: 2,
    sources: sources.map(source => {
      const sourceConfig: any = {
        name: source.name,
        database: source.database,
        schema: source.schema
      };

      if (source.tables.length > 0) {
        sourceConfig.tables = source.tables.map(table => {
          const tableConfig: any = {
            name: table.name
          };

          if (table.description) {
            tableConfig.description = table.description;
          }

          if (table.columns.length > 0) {
            tableConfig.columns = table.columns.map(column => {
              const columnConfig: any = {
                name: column.name
              };

              if (column.description) {
                columnConfig.description = column.description;
              }

              if (column.tests.length > 0) {
                columnConfig.tests = column.tests.map(test => {
                  if (test.type === "custom") {
                    return test.name;
                  } else if (test.arguments && (Object.keys(test.arguments).length > 0 || test.type === "accepted_values")) {
                    let args = test.arguments;

                    // Ensure accepted_values has proper structure
                    if (test.type === "accepted_values") {
                      args = {
                        args: {
                          values: test.arguments.values || [],
                          quote: test.arguments.quote !== undefined ? test.arguments.quote : false
                        }
                      };
                    }

                    const testConfig: any = {
                      [test.type]: args
                    };

                    if (test.where) {
                      testConfig[test.type].where = test.where;
                    }

                    if (test.config) {
                      testConfig[test.type].config = test.config;
                    }

                    return testConfig;
                  } else {
                    const testConfig: any = test.type;

                    if (test.where || test.config) {
                      const extendedTest: any = { [test.type]: {} };

                      if (test.where) {
                        extendedTest[test.type].where = test.where;
                      }

                      if (test.config) {
                        extendedTest[test.type].config = test.config;
                      }

                      return extendedTest;
                    }

                    return testConfig;
                  }
                });
              }

              return columnConfig;
            });
          }

          return tableConfig;
        });
      }

      return sourceConfig;
    })
  };

  return yaml.dump(dbtConfig, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
    quotingType: '"'
  });
}

// Validate that input contains only alphanumeric characters and underscores
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
      message: 'Dot a valid database pattern'
    };
  }

  return { isValid: true };
}

export { generateDbtSourceYaml, validateIdentifierName, validateDatabaseName };
