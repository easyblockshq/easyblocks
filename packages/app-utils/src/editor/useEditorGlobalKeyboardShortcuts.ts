import {
  EditorContextType,
  duplicateConfig,
} from "@easyblocks/core/_internals";
import { dotNotationGet, preOrderPathComparator } from "@easyblocks/utils";
import { useEffect } from "react";

const GLOBAL_SHORTCUTS_KEYS = [
  "Delete",
  "Backspace",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "l",
  "L",
];

export const DATA_TRANSFER_FORMAT = "text/x-shopstory";

function useEditorGlobalKeyboardShortcuts(editorContext: EditorContextType) {
  useEffect(() => {
    const { focussedField: focusedFields, actions } = editorContext;

    function handleKeydown(event: KeyboardEvent): void {
      if (isTargetInputElement(event.target)) {
        return;
      }

      if (!isGlobalShortcut(event) || !isAnyFieldSelected(focusedFields)) {
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        actions.removeItems(focusedFields);
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        actions.moveItems(focusedFields, "top");
      } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        actions.moveItems(focusedFields, "bottom");
      } else if (event.key.toUpperCase() === "L") {
        actions.logSelectedItems();
      }
    }

    function handleCopy(event: ClipboardEvent): void {
      if (!canHandleCopyPaste(focusedFields, event)) {
        return;
      }

      const configs = getConfigsToCopy(focusedFields, editorContext);

      event.preventDefault();
      event.clipboardData?.setData(
        DATA_TRANSFER_FORMAT,
        JSON.stringify(configs)
      );
    }

    function handleCut(event: ClipboardEvent): void {
      if (!canHandleCopyPaste(focusedFields, event)) {
        return;
      }

      const configs = getConfigsToCopy(focusedFields, editorContext);

      event.preventDefault();
      event.clipboardData?.setData(
        DATA_TRANSFER_FORMAT,
        JSON.stringify(configs)
      );

      actions.removeItems(focusedFields);
    }

    function handlePaste(event: ClipboardEvent): void {
      if (!canHandleCopyPaste(focusedFields, event)) {
        return;
      }

      const rawData = event.clipboardData?.getData(DATA_TRANSFER_FORMAT);

      if (!rawData || rawData === "") {
        return;
      }

      try {
        const parsedData = JSON.parse(rawData);

        const data = Array.isArray(parsedData) ? parsedData : [parsedData];

        actions.pasteItems(data);
        event.preventDefault();
      } catch (e) {
        console.error(e);
        return;
      }
    }

    window.document.addEventListener("keydown", handleKeydown);
    window.document.addEventListener("copy", handleCopy);
    window.document.addEventListener("cut", handleCut);
    window.document.addEventListener("paste", handlePaste);

    return () => {
      window.document.removeEventListener("keydown", handleKeydown);
      window.document.removeEventListener("copy", handleCopy);
      window.document.removeEventListener("cut", handleCut);
      window.document.removeEventListener("paste", handlePaste);
    };
  });
}

function isTargetInputElement(target: EventTarget | null): boolean {
  return (
    isTargetHtmlElement(target) &&
    (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
      (target.tagName === "DIV" && target.getAttribute("role") === "textbox"))
  );
}

function isTargetHtmlElement(
  element: EventTarget | null
): element is HTMLElement {
  return element !== null;
}

function getConfigsToCopy(paths: string[], editorContext: EditorContextType) {
  const sortedPaths = [...paths].sort(preOrderPathComparator("ascending"));
  return sortedPaths.map((path) => {
    const config = dotNotationGet(editorContext.form.values, path);
    return duplicateConfig(config, editorContext);
  });
}

function canHandleCopyPaste(focusedFields: string[], event: ClipboardEvent) {
  const notInsideInputElement = !(
    isTargetInputElement(event.target) ||
    isTargetInputElement(document.activeElement)
  );

  const insideEditorIFrame = window.frameElement;
  const focusedFieldsSelected = isAnyFieldSelected(focusedFields);

  return notInsideInputElement && insideEditorIFrame && focusedFieldsSelected;
}

function isGlobalShortcut(event: KeyboardEvent): boolean {
  return GLOBAL_SHORTCUTS_KEYS.includes(event.key);
}

// FIXME: This is my mistake, because I was lazy at the beginning and it was easier for me to introduce changes
// by assuming that non empty array with empty string means no fields selected.
// IMO this is stupid and can lead to confusion.
function isAnyFieldSelected(focusedFields: string[]) {
  return focusedFields.length > 0 && focusedFields[0] !== "";
}

export { useEditorGlobalKeyboardShortcuts };
