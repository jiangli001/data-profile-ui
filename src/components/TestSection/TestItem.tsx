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
  onUpdate: (updates: Partial<Test>) => void;
  onDelete: () => void;
}

const TestItem = memo<TestItemProps>(({ test, onUpdate, onDelete }) => {
  const handleTypeChange = (newType: string) => {
    try {
      const updates: Partial<Test> = { type: newType };

      // Reset all fields when switching type
      updates.acceptedValues = undefined;
      updates.sourceName = undefined;
      updates.columnName = undefined;
      updates.where = "";

      // If switching to accepted_values, initialize acceptedValues
      if (newType === TEST_TYPES.ACCEPTED_VALUES) {
        updates.acceptedValues = "";
        updates.quoteValues = false;
      }

      onUpdate(updates);
    } catch (error) {
      console.error("Error updating test type:", error);
    }
  };

  const handleAcceptedValuesUpdate = (values: string, quote: boolean) => {
    try {
      onUpdate({ acceptedValues: values, quoteValues: quote });
    } catch (error) {
      console.error("Error updating accepted values:", error);
    }
  };

  const handleRelationshipUpdate = (sourceName: string, columnName: string) => {
    try {
      onUpdate({ sourceName, columnName });
    } catch (error) {
      console.error("Error updating relationship:", error);
    }
  };

  const handleWhereChange = (value: string) => {
    onUpdate({ where: value });
  };

  const handleSeverityChange = (severity: "error" | "warn" | undefined) => {
    onUpdate({ severity });
  };

  const handleErrorIfChange = (errorIf: string) => {
    onUpdate({ errorIf });
  };

  const handleWarnIfChange = (warnIf: string) => {
    onUpdate({ warnIf });
  };

  return (
    <div className="test-item">
      <div className="test-item-header">
        <TestTypeSelector 
          value={test.type} 
          onChange={handleTypeChange} 
        />
        <button onClick={onDelete} className="test-item-delete">
          <Trash2 size={12} />
        </button>
      </div>

      {test.type === TEST_TYPES.ACCEPTED_VALUES && (
        <AcceptedValuesInput
          acceptedValues={test.acceptedValues || ""}
          quote={test.quoteValues ?? false}
          onUpdate={handleAcceptedValuesUpdate}
        />
      )}

      {test.type === TEST_TYPES.RELATIONSHIPS && (
        <RelationshipsInput
          sourceName={test.sourceName || ""}
          columnName={test.columnName || ""}
          onUpdate={handleRelationshipUpdate}
        />
      )}

      <TestConfiguration
        where={test.where || ""}
        severity={test.severity}
        errorIf={test.errorIf || ""}
        warnIf={test.warnIf || ""}
        onWhereChange={handleWhereChange}
        onSeverityChange={handleSeverityChange}
        onErrorIfChange={handleErrorIfChange}
        onWarnIfChange={handleWarnIfChange}
      />
    </div>
  );
});

TestItem.displayName = 'TestItem';

export default TestItem;