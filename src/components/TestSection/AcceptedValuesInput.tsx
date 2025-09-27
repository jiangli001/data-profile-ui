import React from "react";
import "./TestSection.css";

interface AcceptedValuesInputProps {
  acceptedValues: string;
  quote: boolean;
  onUpdate: (values: string, quote: boolean) => void;
}

function AcceptedValuesInput({
  acceptedValues,
  quote,
  onUpdate,
}: AcceptedValuesInputProps): React.ReactElement {
  return (
    <div className="test-item-accepted-values">
      <input
        type="text"
        placeholder="Enter accepted values separated by commas (e.g., 1, 2, 3, 4)"
        value={acceptedValues}
        onChange={(e) => onUpdate(e.target.value, quote)}
        className="test-item-input margin-bottom"
      />
      <label className="test-item-checkbox-label">
        <input
          type="checkbox"
          checked={quote}
          onChange={(e) => onUpdate(acceptedValues, e.target.checked)}
          className="test-item-checkbox"
        />
        Quote values
      </label>
    </div>
  );
}

export default AcceptedValuesInput;
