import { dotNotationGet, last } from "@easyblocks/utils";
import type { Selection } from "slate";
import { parseFocusedRichTextPartConfigPath } from "./parseRichTextPartConfigPath";

function getEditorSelectionFromFocusedFields(
  focusedFields: Array<string>,
  form: any
): Selection {
  try {
    const anchorFocusedField = focusedFields[0];
    const focusFocusedField = last(focusedFields);
    const parsedAnchorField =
      parseFocusedRichTextPartConfigPath(anchorFocusedField);
    const parsedFocusedField =
      parseFocusedRichTextPartConfigPath(focusFocusedField);

    if (!parsedAnchorField.path.length || !parsedFocusedField.path.length) {
      return null;
    }

    return {
      anchor: {
        offset: parsedAnchorField.range ? parsedAnchorField.range[0] : 0,
        path: parsedAnchorField.path,
      },
      focus: {
        offset: parsedFocusedField.range
          ? parsedFocusedField.range[1]
          : dotNotationGet(form.values, focusFocusedField).value.length,
        path: parsedFocusedField.path,
      },
    };
  } catch {
    return null;
  }
}

export { getEditorSelectionFromFocusedFields };
