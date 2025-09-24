import React, { useState } from "react";
import { Table, Trash2 } from "lucide-react";
import type {
  DbtTestTable as TableData,
  DbtTestColumn as Column,
  DbtTest as Test,
} from "../types";
import { validateIdentifierName } from "../utils";
import ColumnSection from "./ColumnSection";
import "./TableSection.css";

interface TableSectionProps {
  table: TableData;
  sourceId: string;
  updateTable: (
    sourceId: string,
    tableId: string,
    field: keyof TableData,
    value: any,
  ) => void;
  deleteTable: (sourceId: string, tableId: string) => void;
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
  tableError?: string;
  columnErrors?: Record<string, string>;
}

function TableSection(props: TableSectionProps): React.ReactElement {
  const { table, sourceId } = props;
  const [tableNameWarning, setTableNameWarning] = useState<string>("");

  const handleTableNameChange = (value: string) => {
    const validation = validateIdentifierName(value);
    setTableNameWarning(validation.isValid ? "" : validation.message || "");
    props.updateTable(sourceId, table.id, "name", value);
  };

  const getTableError = () => {
    if (tableNameWarning) return tableNameWarning;
    if (props.tableError) return props.tableError;
    return "";
  };

  const hasValidationError = () => {
    return !!getTableError();
  };

  return (
    <div className="table-section">
      <div className="table-section-header">
        <div className="table-section-header-content">
          <div className="table-section-name-group">
            <Table size={16} className="table-section-name-icon" />
            <div className="table-section-input-wrapper">
              <input
                type="text"
                placeholder="Table Name"
                value={table.name}
                onChange={(e) => handleTableNameChange(e.target.value)}
                className={`table-section-input ${hasValidationError() ? "source-input-control-invalid" : ""}`}
              />
            </div>
          </div>
          <div className="table-section-controls">
            <input
              type="text"
              placeholder="Description (optional)"
              value={table.description}
              onChange={(e) =>
                props.updateTable(
                  sourceId,
                  table.id,
                  "description",
                  e.target.value,
                )
              }
              className="table-section-input"
            />
            <button
              onClick={() => props.deleteTable(sourceId, table.id)}
              className="table-section-delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="table-section-content">
        <ColumnSection
          columns={table.columns}
          sourceId={sourceId}
          tableId={table.id}
          addColumn={props.addColumn}
          updateColumn={props.updateColumn}
          deleteColumn={props.deleteColumn}
          addTest={props.addTest}
          updateTest={props.updateTest}
          deleteTest={props.deleteTest}
          columnErrors={props.columnErrors}
        />
      </div>
    </div>
  );
}

export default TableSection;
