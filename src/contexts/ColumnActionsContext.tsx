import React, { createContext, useContext, type ReactNode } from "react";
import type { DbtTestColumn } from "../types";

interface ColumnActionsContextType {
  addColumn: (sourceId: string, tableId: string) => void;
  updateColumn: (
    sourceId: string,
    tableId: string,
    columnId: string,
    field: keyof DbtTestColumn,
    value: any,
  ) => void;
  deleteColumn: (sourceId: string, tableId: string, columnId: string) => void;
}

const ColumnActionsContext = createContext<
  ColumnActionsContextType | undefined
>(undefined);

interface ColumnActionsProviderProps {
  children: ReactNode;
  addColumn: ColumnActionsContextType["addColumn"];
  updateColumn: ColumnActionsContextType["updateColumn"];
  deleteColumn: ColumnActionsContextType["deleteColumn"];
}

export const ColumnActionsProvider: React.FC<ColumnActionsProviderProps> = ({
  children,
  addColumn,
  updateColumn,
  deleteColumn,
}) => {
  return (
    <ColumnActionsContext.Provider
      value={{ addColumn, updateColumn, deleteColumn }}
    >
      {children}
    </ColumnActionsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useColumnActions = (): ColumnActionsContextType => {
  const context = useContext(ColumnActionsContext);
  if (context === undefined) {
    throw new Error(
      "useColumnActions must be used within a ColumnActionsProvider",
    );
  }
  return context;
};
