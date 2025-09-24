import React from "react";
import { Database } from "lucide-react";
import "./EmptyState.css";

function EmptyState(): React.ReactElement {
  return (
    <div className="empty-state">
      <Database size={48} className="empty-state-icon" />
      <p className="empty-state-text">
        No sources added yet. Click "Add Source" to get started.
      </p>
    </div>
  );
}

export default EmptyState;
