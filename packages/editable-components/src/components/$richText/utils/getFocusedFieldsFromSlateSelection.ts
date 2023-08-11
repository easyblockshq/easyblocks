import type { Editor } from "slate";
import { getAbsoluteRichTextPartPath } from "../getAbsoluteRichTextPartPath";
import { getFocusedRichTextPartsConfigPaths } from "./getFocusedRichTextPartsConfigPaths";

function getFocusedFieldsFromSlateSelection(
  editor: Editor,
  richTextComponentConfigPath: string,
  locale: string
) {
  if (editor.selection === null) {
    return undefined;
  }

  const focusedRichTextPartPaths = getFocusedRichTextPartsConfigPaths(editor);

  const focusedFields = focusedRichTextPartPaths.map((richTextPartPath) =>
    getAbsoluteRichTextPartPath(
      richTextPartPath,
      richTextComponentConfigPath,
      locale
    )
  );
  return focusedFields;
}

export { getFocusedFieldsFromSlateSelection };
