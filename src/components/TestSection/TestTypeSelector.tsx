import React from "react";
import { FlaskConical } from "lucide-react";
import { BUILT_IN_TESTS } from "../../types";
import "./TestSection.css";

interface TestTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TestTypeSelector: React.FC<TestTypeSelectorProps> = ({ value, onChange }) => (
  <div className="test-item-type-group">
    <FlaskConical size={12} className="test-item-type-icon" />
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="test-item-select"
    >
      {BUILT_IN_TESTS.map((testType) => (
        <option key={testType} value={testType}>
          {testType}
        </option>
      ))}
    </select>
  </div>
);

export default TestTypeSelector;