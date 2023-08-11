import type { ComponentConfig } from "@easyblocks/core";
import { useRef } from "react";
import ReactDOM from "react-dom";
import { EditorHistory, HistoryEntry } from "./EditorHistory";

interface UseEditorHistoryParameters {
  onChange: (editorHistoryChange: EditorHistoryChange) => void;
}

interface EditorHistoryChange {
  config?: ComponentConfig;
  focusedField: Array<string>;
  type: "undo" | "redo";
  audiences: string[];
}

function useEditorHistory({ onChange }: UseEditorHistoryParameters) {
  const editorHistory = useRef<EditorHistory>(new EditorHistory()).current;

  function undo(): void {
    ReactDOM.unstable_batchedUpdates(() => {
      const entry = editorHistory.back();

      if (entry === null) {
        return;
      }

      const { focussedField, ...rest } = entry;
      onChange({
        focusedField: focussedField,
        ...rest,
        type: "undo",
      });
    });
  }

  function redo() {
    ReactDOM.unstable_batchedUpdates(() => {
      const entry = editorHistory.forward();

      if (!entry) {
        return null;
      }

      const { focussedField, ...rest } = entry;

      onChange({
        focusedField: focussedField,
        ...rest,
        type: "redo",
      });
    });
  }

  function push(entry: HistoryEntry) {
    editorHistory.push(entry);
  }

  return {
    push,
    redo,
    undo,
    editorHistoryInstance: editorHistory,
  };
}

export { useEditorHistory };
