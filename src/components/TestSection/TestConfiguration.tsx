import React from "react";
import Select, { type SingleValue } from "react-select";
import "./TestSection.css";

interface TestConfigurationProps {
  where: string;
  severity?: "error" | "warn";
  errorIf: string;
  warnIf: string;
  onWhereChange: (value: string) => void;
  onSeverityChange: (severity: "error" | "warn" | undefined) => void;
  onErrorIfChange: (errorIf: string) => void;
  onWarnIfChange: (warnIf: string) => void;
}

interface SeverityOptionType {
  value: "error" | "warn" | "";
  label: string;
}

const TestConfiguration: React.FC<TestConfigurationProps> = ({
  where,
  severity,
  errorIf,
  warnIf,
  onWhereChange,
  onSeverityChange,
  onErrorIfChange,
  onWarnIfChange,
}) => {
  const severityOptions: SeverityOptionType[] = [
    { value: "error", label: "error" },
    { value: "warn", label: "warn" },
  ];

  const selectedSeverity =
    severityOptions.find((option) => option.value === severity) || null;

  const handleSeverityChange = (
    selectedOption: SingleValue<SeverityOptionType>,
  ) => {
    if (selectedOption) {
      const value =
        selectedOption.value === ""
          ? undefined
          : (selectedOption.value as "error" | "warn");
      onSeverityChange(value);
    }
  };

  return (
    <div className="test-item-controls">
      <input
        type="text"
        placeholder="Where clause (optional)"
        value={where}
        onChange={(e) => onWhereChange(e.target.value)}
        className="test-item-input"
      />

      <div className="test-item-config-grid">
        <Select
          value={selectedSeverity}
          onChange={handleSeverityChange}
          options={severityOptions}
          isSearchable={true}
          placeholder="Select Severity"
          className="react-select-container-severity"
          classNamePrefix="react-select-severity"
          menuPortalTarget={document.body}
          menuPosition="fixed"
        />
        <input
          type="text"
          placeholder="Error if"
          value={errorIf}
          onChange={(e) => onErrorIfChange(e.target.value)}
          className="test-item-config-input"
        />
        <input
          type="text"
          placeholder="Warn if"
          value={warnIf}
          onChange={(e) => onWarnIfChange(e.target.value)}
          className="test-item-config-input"
        />
      </div>
    </div>
  );
};

export default TestConfiguration;
