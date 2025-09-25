import { useState } from "react";
import type {
  DbtTestSource,
  DbtTestTable as TableData,
  DbtTestColumn as Column,
  DbtTest as Test,
} from "../types";

export function useSources() {
  const [sources, setSources] = useState<DbtTestSource[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tableErrors, setTableErrors] = useState<Record<string, string>>({});
  const [columnErrors, setColumnErrors] = useState<Record<string, string>>({});

  const updateNested = <T extends { id: string }>(
    items: T[],
    id: string,
    updater: (item: T) => T
  ): T[] => {
    return items.map(item => item.id === id ? updater(item) : item);
  };

  const updateSource = (sourceId: string, updater: (source: DbtTestSource) => DbtTestSource): void => {
    setSources(sources => updateNested(sources, sourceId, updater));
  };

  const updateTable = (sourceId: string, tableId: string, updater: (table: TableData) => TableData): void => {
    updateSource(sourceId, source => ({
      ...source,
      tables: updateNested(source.tables || [], tableId, updater)
    }));
  };

  const updateColumn = (sourceId: string, tableId: string, columnId: string, updater: (column: Column) => Column): void => {
    updateTable(sourceId, tableId, table => ({
      ...table,
      columns: updateNested(table.columns || [], columnId, updater)
    }));
  };

  const updateTest = (sourceId: string, tableId: string, columnId: string, testId: string, updater: (test: Test) => Test): void => {
    updateColumn(sourceId, tableId, columnId, column => ({
      ...column,
      tests: updateNested(column.tests || [], testId, updater)
    }));
  };

  const addSource = (): void => {
    const newSource: DbtTestSource = {
      id: 'source_' + Date.now().toString(),
      name: "",
      database: "",
      schema: "",
      tables: [],
      expanded: true,
    };
    setSources([...sources, newSource]);
  };

  const updateSourceField = (
    sourceId: string,
    field: keyof DbtTestSource,
    value: string,
  ): void => {
    updateSource(sourceId, source => ({ ...source, [field]: value }));
    if (field === 'database' || field === 'schema') {
      setErrors(prev => {
        if (!prev[sourceId]) return prev;
        // removes the sourceId entry from the errors object
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [sourceId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  // set a per-source inline error if a required field value is missing.
  // Returns true when an error was set (i.e. value is empty).
  const showMissingFieldError = (
    sourceId: string,
    values?: string[],
  ): boolean => {
    if (!values) return false;

    for (const value of values) {
      if (!value || value.trim() === "") {
        setErrors(prev => ({ ...prev, [sourceId]: 'All fields are required' }));
        return true;
      }
    }
    return false;
  };

  const deleteSource = (sourceId: string): void => {
    setSources(sources.filter((s) => s.id !== sourceId));
  };

  const toggleSource = (sourceId: string): void => {
    setSources(
      sources.map((s) =>
        s.id === sourceId ? { ...s, expanded: !s.expanded } : s,
      ),
    );
  };

  const addTable = (sourceId: string): void => {
    const newTable: TableData = {
      id: 'table_' + Date.now().toString(),
      name: "",
      description: "",
      columns: [],
    };
    const currentSource = sources.find(s => s.id === sourceId);
    // If the source exists but has no database, set an inline error keyed by source id
    if (currentSource && showMissingFieldError(sourceId, [currentSource.database, currentSource.schema])) {
      return;
    }

    updateSource(sourceId, source => ({
      ...source,
      tables: [...(source.tables || []), newTable]
    }));
  };

  const updateTableField = (
    sourceId: string,
    tableId: string,
    field: keyof TableData,
    value: string,
  ): void => {
    updateTable(sourceId, tableId, table => ({ ...table, [field]: value }));
    if (field === 'name') {
      setTableErrors(prev => {
        if (!prev[tableId]) return prev;
        // removes the tableId entry from the errors object
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [tableId]: _, ...rest } = prev;
        return rest;
      });
    }
  };


  const deleteTable = (sourceId: string, tableId: string): void => {
    updateSource(sourceId, source => ({
      ...source,
      tables: (source.tables || []).filter(t => t.id !== tableId)
    }));
  };

  const addColumn = (sourceId: string, tableId: string): void => {
    const newColumn: Column = {
      id: 'column_' + Date.now().toString(),
      name: "",
      description: "",
      tests: [],
    };
    updateTable(sourceId, tableId, table => ({
      ...table,
      columns: [...(table.columns || []), newColumn]
    }));
  };

  const updateColumnField = (
    sourceId: string,
    tableId: string,
    columnId: string,
    field: keyof Column,
    value: string,
  ): void => {
    updateColumn(sourceId, tableId, columnId, column => ({ ...column, [field]: value }));
    if (field === 'name') {
      setColumnErrors(prev => {
        if (!prev[columnId]) return prev;
        // removes the columnId entry from the errors object
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [columnId]: _, ...rest } = prev;
        return rest;
      });
    }
  };


  const deleteColumn = (
    sourceId: string,
    tableId: string,
    columnId: string,
  ): void => {
    updateTable(sourceId, tableId, table => ({
      ...table,
      columns: (table.columns || []).filter(c => c.id !== columnId)
    }));
  };

  const addTest = (sourceId: string, tableId: string, columnId: string): void => {
    const newTest: Test = {
      id: 'test_' + Date.now().toString(),
      name: "",
      type: "not_null",
      where: "",
    };
    updateColumn(sourceId, tableId, columnId, column => ({
      ...column,
      tests: [...(column.tests || []), newTest]
    }));
  };

  const updateTestPartial = (
    sourceId: string,
    tableId: string,
    columnId: string,
    testId: string,
    updates: Partial<Test>,
  ): void => {
    updateTest(sourceId, tableId, columnId, testId, test => ({ ...test, ...updates }));
  };

  const deleteTest = (
    sourceId: string,
    tableId: string,
    columnId: string,
    testId: string,
  ): void => {
    updateColumn(sourceId, tableId, columnId, column => ({
      ...column,
      tests: (column.tests || []).filter(test => test.id !== testId)
    }));
  };

  return {
    sources,
    errors,
    tableErrors,
    columnErrors,
    addSource,
    updateSource: updateSourceField,
    deleteSource,
    toggleSource,
    addTable,
    updateTable: updateTableField,
    deleteTable,
    addColumn,
    updateColumn: updateColumnField,
    deleteColumn,
    addTest,
    updateTest: updateTestPartial,
    deleteTest,
  };
}
