import { memo } from "react";
import { Trash2 } from "lucide-react";
import type { DbtTest as Test } from "../../types";
import { TEST_TYPES } from "../../types";
import TestTypeSelector from "./TestTypeSelector";
import AcceptedValuesInput from "./AcceptedValuesInput";
import RelationshipsInput from "./RelationshipsInput";
import TestConfiguration from "./TestConfiguration";
import "./TestSection.css";

interface TestItemProps {
  test: Test;
  onUpdateTest: (updates: Partial<Test>) => void;
  onDeleteTest: () => void;
}

const TestItem = memo<TestItemProps>(({ test, onUpdateTest, onDeleteTest }) => {
  const handleTypeChange = (newType: string) => {
    try {
      const updates: Partial<Test> = { type: newType };

      // // Reset all fields when switching type
      // updates.acceptedValues = undefined;
      // updates.sourceName = undefined;
      // updates.columnName = undefined;
      // updates.where = "";

      onUpdateTest(updates);
    } catch (error) {
      console.error("Error updating test type:", error);
    }
  };

  return (
    <div className="test-item">
      <div className="test-item-header">
        <TestTypeSelector value={test.type} onChange={handleTypeChange} />
        <button onClick={onDeleteTest} className="test-item-delete">
          <Trash2 size={12} />
        </button>
      </div>

      {test.type === TEST_TYPES.ACCEPTED_VALUES && (
        <AcceptedValuesInput
          acceptedValues={test.acceptedValues || ""}
          quote={test.quoteValues ?? false}
          onUpdate={(values, quote) =>
            onUpdateTest({ acceptedValues: values, quoteValues: quote })
          }
        />
      )}

      {test.type === TEST_TYPES.RELATIONSHIPS && (
        <RelationshipsInput
          sourceName={test.sourceName || ""}
          columnName={test.columnName || ""}
          onUpdate={(sourceName, columnName) =>
            onUpdateTest({ sourceName, columnName })
          }
        />
      )}

      <TestConfiguration
        where={test.where || ""}
        severity={test.severity}
        errorIf={test.errorIf || ""}
        warnIf={test.warnIf || ""}
        onWhereChange={(value) => onUpdateTest({ where: value })}
        onSeverityChange={(severity) => onUpdateTest({ severity })}
        onErrorIfChange={(errorIf) => onUpdateTest({ errorIf })}
        onWarnIfChange={(warnIf) => onUpdateTest({ warnIf })}
      />
    </div>
  );
});

TestItem.displayName = "TestItem";

export default TestItem;
