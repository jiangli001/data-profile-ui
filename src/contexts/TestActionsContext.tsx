import React, { createContext, useContext, type ReactNode } from 'react';
import type { DbtTest as Test } from '../types';

interface TestActionsContextType {
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

const TestActionsContext = createContext<TestActionsContextType | undefined>(undefined);

interface TestActionsProviderProps {
  children: ReactNode;
  updateTest: TestActionsContextType['updateTest'];
  deleteTest: TestActionsContextType['deleteTest'];
}

export const TestActionsProvider: React.FC<TestActionsProviderProps> = ({
  children,
  updateTest,
  deleteTest,
}) => {
  return (
    <TestActionsContext.Provider value={{ updateTest, deleteTest }}>
      {children}
    </TestActionsContext.Provider>
  );
};

export const useTestActions = (): TestActionsContextType => {
  const context = useContext(TestActionsContext);
  if (context === undefined) {
    throw new Error('useTestActions must be used within a TestActionsProvider');
  }
  return context;
};