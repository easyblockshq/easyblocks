import { getDefaultLocale } from "@easyblocks/core";
import { uniqueId } from "@easyblocks/utils";

import type { EditorContextType } from "../../EditorContext";
import type { TextExternal } from "../../types";

export function buildText(
  x: string,
  editorContext: EditorContextType
): TextExternal {
  const defaultLocale = getDefaultLocale(editorContext.locales);

  return {
    id: "locale." + uniqueId(),
    value: {
      [defaultLocale.code]: x,
    },
  };
}
