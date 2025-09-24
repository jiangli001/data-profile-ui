import React from "react";
import { FlaskConical, Plus, Trash2 } from "lucide-react";
import type { DbtTest as Test } from "../types";
import "./TestSection.css";

const BUILT_IN_TESTS = [
  "unique",
  "not_null",
  "accepted_values",
  "relationships",
  // "dbt_utils.unique_combination_of_columns",
  // "dbt_utils.expression_is_true",
  // "dbt_utils.recency",
  // "dbt_utils.at_least_one",
  // "dbt_utils.not_constant",
  // "custom",
];

interface TestSectionProps {
  tests: Test[];
  sourceId: string;
  tableId: string;
  columnId: string;
  addTest: (sourceId: string, tableId: string, columnId: string) => void;
  updateTest: (
    sourceId: string,
    tableId: string,
    columnId: string,
    testId: string,
    updates: Partial<Test>,
  ) => void;
  deleteTest: (
    sourceId: string,
    tableId: string,
    columnId: string,
    testId: string,
  ) => void;
}

function TestSection(props: TestSectionProps): React.ReactElement {
  const { tests, sourceId, tableId, columnId } = props;

  const parseArguments = (value: string) => {
    if (!value || value.trim() === "") {
      return {};
    }
    try {
      const parsed = JSON.parse(value);
      return parsed;
    } catch {
      // If JSON parsing fails, store as string for now
      // This prevents crashes while user is typing
      return value;
    }
  };

  return (
    <>
      <div className="test-section-header">
        <span className="test-section-title">
          <FlaskConical size={14} className="test-section-title-icon" />
          Tests
        </span>
        <button
          onClick={() => props.addTest(sourceId, tableId, columnId)}
          className="test-section-button"
        >
          <Plus size={12} />
          Add Test
        </button>
      </div>

      <div className="test-section-list">
        {tests.map((test) => (
          <div key={test.id} className="test-item">
            <div className="test-item-header">
              <div className="test-item-type-group">
                <FlaskConical size={12} className="test-item-type-icon" />
                <select
                  value={test.type}
                  onChange={(e) => {
                    try {
                      const newType = e.target.value;
                      const updates: any = { type: newType };

                      // Initialize arguments for accepted_values if switching to it
                      if (newType === "accepted_values" && (!test.arguments || !test.arguments.values)) {
                        updates.arguments = {
                          values: [],
                          valuesString: "",
                          quote: false
                        };
                      }

                      props.updateTest(sourceId, tableId, columnId, test.id, updates);
                    } catch (error) {
                      console.error("Error updating test type:", error);
                    }
                  }}
                  className="test-item-select"
                >
                  {BUILT_IN_TESTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() =>
                  props.deleteTest(sourceId, tableId, columnId, test.id)
                }
                className="test-item-delete"
              >
                <Trash2 size={12} />
              </button>
            </div>

            {test.type === "accepted_values" && (
              <div className="test-item-accepted-values">
                <input
                  type="text"
                  placeholder="Enter accepted values separated by commas (e.g., 1, 2, 3, 4)"
                  value={test.arguments?.valuesString || ""}
                  onChange={(e) => {
                    try {
                      const inputValue = e.target.value;

                      // Parse the values for YAML generation
                      const values = inputValue.trim() === "" ? [] : inputValue
                        .split(",")
                        .map(v => v.trim())
                        .filter(v => v !== "")
                        .map(v => {
                          // Try to parse as number, otherwise keep as string
                          const num = Number(v);
                          return !isNaN(num) && isFinite(num) ? num : v;
                        });

                      props.updateTest(sourceId, tableId, columnId, test.id, {
                        arguments: {
                          values: values,
                          valuesString: inputValue, // Store the raw input for display
                          quote: test.arguments?.quote ?? false
                        }
                      });
                    } catch (error) {
                      console.error("Error updating accepted values:", error);
                    }
                  }}
                  className="test-item-input margin-bottom"
                />
                <label className="test-item-checkbox-label">
                  <input
                    type="checkbox"
                    checked={test.arguments?.quote ?? false}
                    onChange={(e) => {
                      try {
                        props.updateTest(sourceId, tableId, columnId, test.id, {
                          arguments: {
                            ...(test.arguments || {}),
                            quote: e.target.checked
                          }
                        });
                      } catch (error) {
                        console.error("Error updating quote option:", error);
                      }
                    }}
                    className="test-item-checkbox"
                  />
                  Quote values
                </label>
              </div>
            )}

            {test.type === "relationships" && (
              <input
                type="text"
                placeholder='Arguments (e.g., {"to": "ref(table)", "field": "id"})'
                value={
                  typeof test.arguments === "object" && test.arguments !== null
                    ? JSON.stringify(test.arguments)
                    : String(test.arguments || "")
                }
                onChange={(e) => {
                  try {
                    props.updateTest(sourceId, tableId, columnId, test.id, {
                      arguments: parseArguments(e.target.value),
                    });
                  } catch (error) {
                    console.error("Error updating test arguments:", error);
                  }
                }}
                className="test-item-input margin-bottom"
              />
            )}

            <div className="test-item-controls">
              <input
                type="text"
                placeholder="Where clause (optional)"
                value={test.where || ""}
                onChange={(e) =>
                  props.updateTest(sourceId, tableId, columnId, test.id, {
                    where: e.target.value,
                  })
                }
                className="test-item-input"
              />

              <div className="test-item-config-grid">
                <input
                  type="text"
                  placeholder="Severity"
                  value={test.config?.severity || ""}
                  onChange={(e) =>
                    props.updateTest(sourceId, tableId, columnId, test.id, {
                      config: {
                        ...(test.config || {}),
                        severity: e.target.value,
                      },
                    })
                  }
                  className="test-item-config-input"
                />
                <input
                  type="text"
                  placeholder="Error if"
                  value={test.config?.error_if || ""}
                  onChange={(e) =>
                    props.updateTest(sourceId, tableId, columnId, test.id, {
                      config: {
                        ...(test.config || {}),
                        error_if: e.target.value,
                      },
                    })
                  }
                  className="test-item-config-input"
                />
                <input
                  type="text"
                  placeholder="Warn if"
                  value={test.config?.warn_if || ""}
                  onChange={(e) =>
                    props.updateTest(sourceId, tableId, columnId, test.id, {
                      config: {
                        ...(test.config || {}),
                        warn_if: e.target.value,
                      },
                    })
                  }
                  className="test-item-config-input"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default TestSection;
