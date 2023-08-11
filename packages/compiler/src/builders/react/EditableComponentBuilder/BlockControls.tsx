import {
  isConfigPathRichTextPart,
  RICH_TEXT_PART_CONFIG_PATH_REGEXP,
} from "@easyblocks/app-utils";
import React from "react";
import { SelectionFrameController } from "./SelectionFrameController";

interface BlocksControlsProps {
  children: React.ReactChild | React.ReactChild[];
  path: string;
  disabled?: boolean;
  meta: any;
}
export function BlocksControls({
  children,
  path,
  disabled,
  meta,
}: BlocksControlsProps) {
  const { focussedField, setFocussedField } =
    window.parent.editorWindowAPI.editorContext;

  if (disabled) {
    return <>{children}</>;
  }

  const isActive = focussedField
    .map((focusedField: string) => {
      // If the focused field is rich text part path, we want to show the frame around rich text parent component.
      if (isConfigPathRichTextPart(focusedField)) {
        return focusedField.replace(RICH_TEXT_PART_CONFIG_PATH_REGEXP, "");
      }

      return focusedField;
    })
    .includes(path);

  const childIsActive = focussedField.some((focusedField: string) =>
    focusedField.startsWith(path)
  );

  const focusOnBlock = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();

    const closestEditableElementFromTarget = (
      event.target as HTMLElement
    ).closest('[contenteditable="true"]');

    const isActiveElementContentEditable =
      document.activeElement?.getAttribute("contenteditable") === "true";

    // If target of event is within a content editable element we don't want to focus block.
    // If active element is a content editable element, we also don't want to focus block.
    // The latter is helpful when we start text selection within the content editable element
    // and end selection outside of anchor element.
    if (closestEditableElementFromTarget || isActiveElementContentEditable) {
      return;
    }

    const isMultipleSelection = event.shiftKey;

    function getNextFocusedField() {
      if (isMultipleSelection) {
        if (focussedField.includes(path)) {
          const result = focussedField.filter(
            (fieldName: string) => fieldName !== path
          );

          if (result.length > 0) {
            return result;
          }

          return [];
        }

        return [...focussedField, path];
      }

      return path;
    }

    const nextFocusedField = getNextFocusedField();

    setFocussedField(nextFocusedField);

    if (isMultipleSelection) {
      document.getSelection()?.removeAllRanges();
    }
  };

  return (
    <SelectionFrameController
      isActive={isActive}
      isChildrenSelectionDisabled={!isActive && !childIsActive}
      onSelect={focusOnBlock}
      stitches={meta.shopstoryProviderContext.stitches}
    >
      {children}
    </SelectionFrameController>
  );
}
