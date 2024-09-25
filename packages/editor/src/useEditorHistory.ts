import { useMemo } from "react";
import ReactDOM from "react-dom";

import type { NoCodeComponentEntry } from "@easyblocks/core";

import { EditorHistory, HistoryEntry } from "./EditorHistory";

export interface EditorHistoryChange {
  config?: NoCodeComponentEntry;
  focusedField: Array<string>;
  type: "undo" | "redo";
}

interface UseEditorHistoryParameters {
  onChange: (editorHistoryChange: EditorHistoryChange) => void;
}

export function useEditorHistory({ onChange }: UseEditorHistoryParameters) {
  const editorHistory = useMemo<EditorHistory>(() => new EditorHistory(), []);

  return useMemo(() => {
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
  }, [editorHistory, onChange]);
}
