import React from "react";
import { Plus } from "lucide-react";
import "./ConfigHeader.css";

interface ConfigHeaderProps {
  addSource: () => void;
}

function ConfigHeader({ addSource }: ConfigHeaderProps): React.ReactElement {
  return (
    <div className="config-header">
      <div className="config-header-content">
        <h2 className="config-header-title">Sources Configuration</h2>
        <button onClick={addSource} className="config-header-button">
          <Plus size={20} />
          Add Source
        </button>
      </div>
    </div>
  );
}

export default ConfigHeader;
