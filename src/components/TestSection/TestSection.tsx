import React from "react";
import { FlaskConical, Plus } from "lucide-react";
import type { DbtTest as Test } from "../../types";
import { useTestActions } from "../../contexts/TestActionsContext";
import TestItem from "./TestItem";
import "./TestSection.css";

interface TestSectionProps {
  tests: Test[];
  sourceId: string;
  tableId: string;
  columnId: string;
}

function TestSection(props: TestSectionProps): React.ReactElement {
  const { tests, sourceId, tableId, columnId } = props;
  const { addTest, updateTest, deleteTest } = useTestActions();

  return (
    <>
      <div className="test-section-header">
        <span className="test-section-title">
          <FlaskConical size={14} className="test-section-title-icon" />
          Tests
        </span>
        <button
          onClick={() => addTest(sourceId, tableId, columnId)}
          className="test-section-button"
        >
          <Plus size={12} />
          Add Test
        </button>
      </div>

      <div className="test-section-list">
        {tests.map((test) => (
          <TestItem
            key={test.id}
            test={test}
            onUpdateTest={(updates) =>
              updateTest(sourceId, tableId, columnId, test.id, updates)
            }
            onDeleteTest={() =>
              deleteTest(sourceId, tableId, columnId, test.id)
            }
          />
        ))}
      </div>
    </>
  );
}

export default TestSection;
