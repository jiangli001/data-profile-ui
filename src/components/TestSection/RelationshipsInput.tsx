import React from "react";
import "./TestSection.css";

interface RelationshipsInputProps {
  sourceName: string;
  columnName: string;
  onUpdate: (sourceName: string, columnName: string) => void;
}

const RelationshipsInput: React.FC<RelationshipsInputProps> = ({
  sourceName,
  columnName,
  onUpdate
}) => {
  const handleSourceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(e.target.value, columnName);
  };

  const handleColumnNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(sourceName, e.target.value);
  };

  return (
    <div className="test-item-relationships">
      <input
        type="text"
        placeholder="Source name"
        value={sourceName}
        onChange={handleSourceNameChange}
        className="test-item-input margin-bottom"
      />
      <input
        type="text"
        placeholder="Column name"
        value={columnName}
        onChange={handleColumnNameChange}
        className="test-item-input margin-bottom"
      />
    </div>
  );
};

export default RelationshipsInput;