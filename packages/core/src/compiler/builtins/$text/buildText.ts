import { uniqueId } from "@easyblocks/utils";
import { getDefaultLocale } from "../../../locales";
import { EditorContextType } from "../../types";

export function buildText(x: string, editorContext: EditorContextType) {
  const defaultLocale = getDefaultLocale(editorContext.locales);

  return {
    id: "locale." + uniqueId(),
    value: {
      [defaultLocale.code]: x,
    },
  };
}
