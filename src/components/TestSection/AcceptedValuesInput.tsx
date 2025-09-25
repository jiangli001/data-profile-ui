import React from "react";
import "./TestSection.css";

interface AcceptedValuesInputProps {
  acceptedValues: string;
  quote: boolean;
  onUpdate: (values: string, quote: boolean) => void;
}

const AcceptedValuesInput: React.FC<AcceptedValuesInputProps> = ({
  acceptedValues,
  quote,
  onUpdate
}) => {
  const handleValuesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(e.target.value, quote);
  };

  const handleQuoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(acceptedValues, e.target.checked);
  };

  return (
    <div className="test-item-accepted-values">
      <input
        type="text"
        placeholder="Enter accepted values separated by commas (e.g., 1, 2, 3, 4)"
        value={acceptedValues}
        onChange={handleValuesChange}
        className="test-item-input margin-bottom"
      />
      <label className="test-item-checkbox-label">
        <input
          type="checkbox"
          checked={quote}
          onChange={handleQuoteChange}
          className="test-item-checkbox"
        />
        Quote values
      </label>
    </div>
  );
};

export default AcceptedValuesInput;