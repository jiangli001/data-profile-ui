import React, { useState } from "react";
import { Columns, Plus, Trash2 } from "lucide-react";
import type { DbtTestColumn as Column, DbtTest as Test } from "../types";
import { validateIdentifierName } from "../utils";
import TestSection from "./TestSection";
import "./ColumnSection.css";

interface ColumnSectionProps {
  columns: Column[];
  sourceId: string;
  tableId: string;
  addColumn: (sourceId: string, tableId: string) => void;
  updateColumn: (
    sourceId: string,
    tableId: string,
    columnId: string,
    field: keyof Column,
    value: any,
  ) => void;
  deleteColumn: (sourceId: string, tableId: string, columnId: string) => void;
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
  columnErrors?: Record<string, string>;
}

function ColumnSection(props: ColumnSectionProps): React.ReactElement {
  const { columns, sourceId, tableId } = props;
  const [columnWarnings, setColumnWarnings] = useState<Record<string, string>>({});

  const handleColumnNameChange = (columnId: string, value: string) => {
    const validation = validateIdentifierName(value);
    setColumnWarnings(prev => ({
      ...prev,
      [columnId]: validation.isValid ? "" : validation.message || ""
    }));
    props.updateColumn(sourceId, tableId, columnId, "name", value);
  };

  const getColumnError = (column: Column) => {
    if (columnWarnings[column.id]) return columnWarnings[column.id];
    if (props.columnErrors?.[column.id]) return props.columnErrors[column.id];
    return "";
  };

  const hasColumnValidationError = (column: Column) => {
    return !!getColumnError(column);
  };

  return (
    <>
      <div className="column-section-header">
        <h5 className="column-section-title">
          <Columns size={16} className="column-section-title-icon" />
          Columns
        </h5>
        <button
          onClick={() => props.addColumn(sourceId, tableId)}
          className="column-section-button"
        >
          <Plus size={14} />
          Add Column
        </button>
      </div>

      <div className="column-section-list">
        {columns.map((column) => (
          <div key={column.id} className="column-item">
            <div className="column-item-header">
              <div className="column-item-header-content">
                <div className="column-item-name-group">
                  <Columns size={14} className="column-item-name-icon" />
                  <div className="column-item-input-wrapper">
                    <input
                      type="text"
                      placeholder="Column Name"
                      value={column.name}
                      onChange={(e) => handleColumnNameChange(column.id, e.target.value)}
                      className={`column-item-input ${hasColumnValidationError(column) ? "source-input-control-invalid" : ""}`}
                    />
                  </div>
                </div>
                <div className="column-item-controls">
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={column.description}
                    onChange={(e) =>
                      props.updateColumn(
                        sourceId,
                        tableId,
                        column.id,
                        "description",
                        e.target.value,
                      )
                    }
                    className="column-item-input"
                  />
                  <button
                    onClick={() =>
                      props.deleteColumn(sourceId, tableId, column.id)
                    }
                    className="column-item-delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="column-item-content">
              <TestSection
                tests={column.tests}
                sourceId={sourceId}
                tableId={tableId}
                columnId={column.id}
                addTest={props.addTest}
                updateTest={props.updateTest}
                deleteTest={props.deleteTest}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ColumnSection;
