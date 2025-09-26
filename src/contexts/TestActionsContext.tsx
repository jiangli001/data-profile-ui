import React, { createContext, useContext, type ReactNode } from "react";
import type { DbtTest as Test } from "../types";

interface TestActionsContextType {
  addTest: (sourceId: string, tableId: string, columnId: string) => void;
  updateTest: (
    sourceId: string,
    tableId: string,
    columnId: string,
    testId: string,
    updates: Partial<Test>,
  ) => void;
  deleteTest: (
    sourceId: string,
    tableId: string,
    columnId: string,
    testId: string,
  ) => void;
}

const TestActionsContext = createContext<TestActionsContextType | undefined>(
  undefined,
);

interface TestActionsProviderProps {
  children: ReactNode;
  addTest: TestActionsContextType["addTest"];
  updateTest: TestActionsContextType["updateTest"];
  deleteTest: TestActionsContextType["deleteTest"];
}

export const TestActionsProvider: React.FC<TestActionsProviderProps> = ({
  children,
  addTest,
  updateTest,
  deleteTest,
}) => {
  return (
    <TestActionsContext.Provider value={{ addTest, updateTest, deleteTest }}>
      {children}
    </TestActionsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTestActions = (): TestActionsContextType => {
  const context = useContext(TestActionsContext);
  if (context === undefined) {
    throw new Error("useTestActions must be used within a TestActionsProvider");
  }
  return context;
};
