import React from "react";
import "./TestSection.css";

interface RelationshipsInputProps {
  sourceName: string;
  columnName: string;
  onUpdate: (sourceName: string, columnName: string) => void;
}

function RelationshipsInput({
  sourceName,
  columnName,
  onUpdate,
}: RelationshipsInputProps): React.ReactElement {
  return (
    <div className="test-item-relationships">
      <input
        type="text"
        placeholder="Source name"
        value={sourceName}
        onChange={(e) => onUpdate(e.target.value, columnName)}
        className="test-item-input margin-bottom"
      />
      <input
        type="text"
        placeholder="Column name"
        value={columnName}
        onChange={(e) => onUpdate(sourceName, e.target.value)}
        className="test-item-input margin-bottom"
      />
    </div>
  );
}

export default RelationshipsInput;
