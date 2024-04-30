import {
  EditorContextType,
  duplicateConfig,
  useEasyblocksCanvasContext,
} from "@easyblocks/core/_internals";
import { dotNotationGet, preOrderPathComparator } from "@easyblocks/utils";
import { useEffect } from "react";
import { AnyContextWithDefinitions } from "../../core/dist/types/compiler/types";

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

const DATA_TRANSFER_FORMAT = "text/x-shopstory";

const actions = {
  removeItems: (paths: string[]) => {
    window.parent.postMessage(
      {
        type: "@easyblocks-editor/remove-items",
        payload: {
          paths,
        },
      },
      "*"
    );
  },
  moveItems: (paths: string[], direction: "top" | "bottom") => {
    window.parent.postMessage(
      {
        type: "@easyblocks-editor/move-items",
        payload: {
          paths,
          direction,
        },
      },
      "*"
    );
  },
  logSelectedItems: () => {
    window.parent.postMessage(
      {
        type: "@easyblocks-editor/log-selected-items",
        payload: {},
      },
      "*"
    );
  },
  pasteItems: (configs: any[]) => {
    window.parent.postMessage(
      {
        type: "@easyblocks-editor/paste-items",
        payload: {
          configs,
        },
      },
      "*"
    );
  },
};

function useCanvasGlobalKeyboardShortcuts() {
  const { formValues, definitions, focussedField } =
    useEasyblocksCanvasContext();

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent): void {
      if (isTargetInputElement(event.target)) {
        return;
      }

      if (!isGlobalShortcut(event) || !isAnyFieldSelected(focussedField)) {
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        actions.removeItems(focussedField);
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        actions.moveItems(focussedField, "top");
      } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        actions.moveItems(focussedField, "bottom");
      } else if (event.key.toUpperCase() === "L") {
        actions.logSelectedItems();
      }
    }

    function handleCopy(event: ClipboardEvent): void {
      if (!canHandleCopyPaste(focussedField, event)) {
        return;
      }
      const configs = getConfigsToCopy(focussedField, formValues, definitions);

      event.preventDefault();
      event.clipboardData?.setData(
        DATA_TRANSFER_FORMAT,
        JSON.stringify(configs)
      );
    }

    function handleCut(event: ClipboardEvent): void {
      if (!canHandleCopyPaste(focussedField, event)) {
        return;
      }

      const configs = getConfigsToCopy(focussedField, formValues, definitions);

      event.preventDefault();
      event.clipboardData?.setData(
        DATA_TRANSFER_FORMAT,
        JSON.stringify(configs)
      );

      actions.removeItems(focussedField);
    }

    function handlePaste(event: ClipboardEvent): void {
      if (!canHandleCopyPaste(focussedField, event)) {
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

function getConfigsToCopy(
  paths: string[],
  formValues: any,
  definitions: AnyContextWithDefinitions
) {
  const sortedPaths = [...paths].sort(preOrderPathComparator("ascending"));
  return sortedPaths.map((path) => {
    const config = dotNotationGet(formValues, path);
    return duplicateConfig(config, definitions);
  });
}

function canHandleCopyPaste(focussedField: string[], event: ClipboardEvent) {
  const notInsideInputElement = !(
    isTargetInputElement(event.target) ||
    isTargetInputElement(document.activeElement)
  );

  const insideEditorIFrame = window.self !== window.top;
  const focussedFieldSelected = isAnyFieldSelected(focussedField);
  return notInsideInputElement && insideEditorIFrame && focussedFieldSelected;
}

function isGlobalShortcut(event: KeyboardEvent): boolean {
  return GLOBAL_SHORTCUTS_KEYS.includes(event.key);
}

// FIXME: This is my mistake, because I was lazy at the beginning and it was easier for me to introduce changes
// by assuming that non empty array with empty string means no fields selected.
// IMO this is stupid and can lead to confusion.
function isAnyFieldSelected(focussedField: string[]) {
  return focussedField.length > 0 && focussedField[0] !== "";
}

export { useCanvasGlobalKeyboardShortcuts };
