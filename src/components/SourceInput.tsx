import React, { useState } from "react";
import type { DbtTestSource } from "../types";
import { validateFieldName, validateDatabaseName } from "../utils";
import "./SourceInput.css";

interface SourceInputProps {
  source: DbtTestSource;
  updateSource: (
    sourceId: string,
    field: keyof DbtTestSource,
    value: string,
  ) => void;
  error?: string;
}

function SourceInput(props: SourceInputProps): React.ReactElement {
  const invalidClass = props.error ? "source-input-control-invalid" : "";
  const [databaseWarning, setDatabaseWarning] = useState<string>("");
  const [schemaWarning, setSchemaWarning] = useState<string>("");

  const updateSourceName = (database: string, schema: string) => {
    const sourceName =
      database && schema ? `${database}_${schema}`.replace(".", "_") : "";
    props.updateSource(props.source.id, "name", sourceName);
  };

  const handleDatabaseChange = (value: string) => {
    const validation = validateDatabaseName(value);
    setDatabaseWarning(validation.isValid ? "" : validation.message || "");
    props.updateSource(props.source.id, "database", value);
    updateSourceName(value, props.source.schema);
  };

  const handleSchemaChange = (value: string) => {
    const validation = validateFieldName(value);
    setSchemaWarning(validation.isValid ? "" : validation.message || "");
    props.updateSource(props.source.id, "schema", value);
    updateSourceName(props.source.database, value);
  };

  return (
    <div className="source-input-container">
      <div className="source-input-field">
        <label className="source-input-label">Database</label>
        <input
          type="text"
          placeholder="Database"
          value={props.source.database}
          onChange={(e) => handleDatabaseChange(e.target.value)}
          className={`source-input-control ${invalidClass}`}
          required
        />
        {(props.error || databaseWarning) && (
          <div className="source-input-error" role="alert">
            <strong className="source-input-error-icon">!</strong>
            <span className="source-input-error-text">
              {props.error || databaseWarning}
            </span>
          </div>
        )}
      </div>
      <div className="source-input-field">
        <label className="source-input-label">Schema</label>
        <input
          type="text"
          placeholder="Schema"
          value={props.source.schema}
          onChange={(e) => handleSchemaChange(e.target.value)}
          className={`source-input-control ${invalidClass}`}
          required={true}
        />
        {schemaWarning && (
          <div className="source-input-error" role="alert">
            <strong className="source-input-error-icon">!</strong>
            <span className="source-input-error-text">{schemaWarning}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default SourceInput;
