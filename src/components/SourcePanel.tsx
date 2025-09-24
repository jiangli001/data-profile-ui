import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Database, Trash2 } from "lucide-react";
import type { DbtTestSource } from "../types";
import "./SourcePanel.css";

interface SourceHeaderProps {
  toggleSource: (sourceId: string) => void;
  deleteSource: (sourceId: string) => void;
  source: DbtTestSource;
}

function SourcePanel(props: SourceHeaderProps): React.ReactElement {
  return (
    <div className="source-panel">
      <button
        onClick={() => props.toggleSource(props.source.id)}
        className="source-panel-toggle"
      >
        {props.source.expanded ? (
          <ChevronDown size={20} />
        ) : (
          <ChevronRight size={20} />
        )}
        <Database size={20} />
        <span className="source-panel-title">
          {props.source.name || "Unnamed Source"}
        </span>
      </button>
      <button
        onClick={() => props.deleteSource(props.source.id)}
        className="source-panel-delete"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

export default SourcePanel;
