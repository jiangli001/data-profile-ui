import React from "react";
import type {
  DbtTestSource,
  DbtTestTable as TableData,
  DbtTestTable,
  DbtTestColumn,
} from "../types";
import SourcePanel from "./SourcePanel";
import SourceInput from "./SourceInput";
import TableHeader from "./TableHeader";
import TableSection from "./TableSection";
import "./SourcesListSection.css";

interface SourcesListSectionProps {
  sources: DbtTestSource[];
  toggleSource: (sourceId: string) => void;
  deleteSource: (sourceId: string) => void;
  updateSource: (
    sourceId: string,
    field: keyof DbtTestSource,
    value: string | boolean | DbtTestTable[],
  ) => void;
  addTable: (sourceId: string) => void;
  updateTable: (
    sourceId: string,
    tableId: string,
    field: keyof TableData,
    value: string | DbtTestColumn[],
  ) => void;
  deleteTable: (sourceId: string, tableId: string) => void;
  errors?: Record<string, string>;
  tableErrors?: Record<string, string>;
  columnErrors?: Record<string, string>;
}

function SourcesListSection(
  props: SourcesListSectionProps,
): React.ReactElement {
  const { sources, errors, tableErrors, columnErrors } = props;

  return (
    <div className="sources-list">
      {sources.map((source) => (
        <div key={source.id} className="source-item">
          <SourcePanel
            toggleSource={props.toggleSource}
            deleteSource={props.deleteSource}
            source={source}
          />

          {source.expanded && (
            <div className="source-item-content">
              <SourceInput
                source={source}
                updateSource={props.updateSource}
                error={errors?.[source.id]}
              />

              <div className="source-item-tables">
                <TableHeader addTable={props.addTable} source={source} />
                <div className="source-item-tables-list">
                  {(source.tables || []).map((table) => (
                    <TableSection
                      key={table.id}
                      table={table}
                      sourceId={source.id}
                      updateTable={props.updateTable}
                      deleteTable={props.deleteTable}
                      tableError={tableErrors?.[table.id]}
                      columnErrors={columnErrors}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default SourcesListSection;
