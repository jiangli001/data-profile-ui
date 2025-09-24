import React from "react";
import { Table, Plus } from "lucide-react";
import type { DbtTestSource } from "../types";
import "./TableHeader.css";

interface TableHeaderProps {
  addTable: (sourceId: string) => void;
  source: DbtTestSource;
}

export function TableHeader({
  addTable,
  source,
}: TableHeaderProps): React.ReactElement {
  return (
    <div className="table-header">
      <h4 className="table-header-title">
        <Table size={18} className="table-header-icon" />
        Tables
      </h4>
      <button
        onClick={() => addTable(source.id)}
        className="table-header-button"
      >
        <Plus size={16} />
        Add Table
      </button>
    </div>
  );
}

export default TableHeader;
