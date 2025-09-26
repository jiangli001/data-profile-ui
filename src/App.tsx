import React from "react";
import YamlPreviewPanel from "./components/YamlPreview";
import ConfigHeader from "./components/ConfigHeader";
import SourcesListSection from "./components/SourcesListSection";
import EmptyState from "./components/EmptyState";
import { useSources } from "./hooks/useSources";
import { TestActionsProvider } from "./contexts/TestActionsContext";
import { ColumnActionsProvider } from "./contexts/ColumnActionsContext";

function App(): React.ReactElement {
  const {
    sources,
    errors,
    tableErrors,
    columnErrors,
    addSource,
    updateSource,
    deleteSource,
    toggleSource,
    addTable,
    updateTable,
    deleteTable,
    addColumn,
    updateColumn,
    deleteColumn,
    addTest,
    updateTest,
    deleteTest,
  } = useSources();

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 shadow-lg">
        <h1 className="text-2xl font-bold text-white">
          DBT Source YAML Generator
        </h1>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 bg-white overflow-y-auto">
          <ConfigHeader addSource={addSource} />

          <div className="p-6">
            {sources.length === 0 ? (
              <EmptyState />
            ) : (
              <TestActionsProvider
                addTest={addTest}
                updateTest={updateTest}
                deleteTest={deleteTest}
              >
                <ColumnActionsProvider
                  addColumn={addColumn}
                  updateColumn={updateColumn}
                  deleteColumn={deleteColumn}
                >
                  <SourcesListSection
                    sources={sources}
                    errors={errors}
                    tableErrors={tableErrors}
                    columnErrors={columnErrors}
                    toggleSource={toggleSource}
                    deleteSource={deleteSource}
                    updateSource={updateSource}
                    addTable={addTable}
                    updateTable={updateTable}
                    deleteTable={deleteTable}
                  />
                </ColumnActionsProvider>
              </TestActionsProvider>
            )}
          </div>
        </div>
        <YamlPreviewPanel sources={sources} />
      </div>
    </div>
  );
}

export default App;
