import React from "react";
import Select, { type SingleValue } from "react-select";
import { FlaskConical } from "lucide-react";
import { BUILT_IN_TESTS } from "../../types";
import "./TestSection.css";

interface TestTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

interface OptionType {
  value: string;
  label: string;
}

const TestTypeSelector: React.FC<TestTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  const options: OptionType[] = BUILT_IN_TESTS.map((testType) => ({
    value: testType,
    label: testType,
  }));

  const selectedOption =
    options.find((option) => option.value === value) || null;

  const handleChange = (selectedOption: SingleValue<OptionType>) => {
    if (selectedOption) {
      onChange(selectedOption.value);
    }
  };

  return (
    <div className="test-item-type-group">
      <FlaskConical size={12} className="test-item-type-icon" />
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
        placeholder="Select Test Type"
        isSearchable={true}
        className="react-select-container-test-type"
        classNamePrefix="react-select-test-type"
        menuPortalTarget={document.body}
        menuPosition="fixed"
      />
    </div>
  );
};

export default TestTypeSelector;
