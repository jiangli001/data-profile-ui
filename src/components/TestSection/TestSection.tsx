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
  addTest: (sourceId: string, tableId: string, columnId: string) => void;
}

function TestSection(props: TestSectionProps): React.ReactElement {
  const { tests, sourceId, tableId, columnId } = props;
  const { updateTest, deleteTest } = useTestActions();

  const handleAddTest = () => {
    props.addTest(sourceId, tableId, columnId);
  }


  return (
    <>
      <div className="test-section-header">
        <span className="test-section-title">
          <FlaskConical size={14} className="test-section-title-icon" />
          Tests
        </span>
        <button onClick={handleAddTest} className="test-section-button">
          <Plus size={12} />
          Add Test
        </button>
      </div>
      
      <div className="test-section-list">
        {tests.map((test) => (
          <TestItem
            key={test.id}
            test={test}
            onUpdate={(updates) => updateTest(sourceId, tableId, columnId, test.id, updates)}
            onDelete={() => deleteTest(sourceId, tableId, columnId, test.id)}
          />
        ))}
      </div>
    </>
  );
}

export default TestSection;