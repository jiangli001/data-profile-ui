import React from "react";
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

const TestConfiguration: React.FC<TestConfigurationProps> = ({
  where,
  severity,
  errorIf,
  warnIf,
  onWhereChange,
  onSeverityChange,
  onErrorIfChange,
  onWarnIfChange
}) => {

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
        <select
          value={severity || ""}
          onChange={(e) => onSeverityChange(e.target.value as "error" | "warn" | undefined || undefined)}
          className="test-item-config-input"
        >
          <option value="">Select severity</option>
          <option value="error">error</option>
          <option value="warn">warn</option>
        </select>
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