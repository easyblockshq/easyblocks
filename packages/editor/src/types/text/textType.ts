import type { SchemaPropDefinitionProviders } from "@easyblocks/compiler";
import { getFallbackForLocale } from "@easyblocks/core";
import { uniqueId } from "@easyblocks/utils";

import { EditorContextType } from "../../EditorContext";
export const textProvider: SchemaPropDefinitionProviders["text"] = (
  schemaProp,
  compilationContext
) => {
  const checkIfValid = (x: any) => {
    if (typeof x !== "object" || x === null) {
      return false;
    }

    if (typeof x.id !== "string") {
      return false;
    }

    if (x.id.startsWith("local.")) {
      // for local values "value" must be object
      if (typeof x.value !== "object" || x.value === null) {
        return false;
      }
    }

    return true;
  };

  return {
    normalize: (x: any) => {
      if (x === undefined || x === null) {
        return {
          id: "local." + uniqueId(),
          value: {
            [compilationContext.contextParams.locale]:
              schemaProp.defaultValue ?? "Lorem ipsum",
          },
        };
      }

      if (checkIfValid(x)) {
        return x;
      }

      throw new Error(`incorrect text type: ${x}`);
    },
    compile: (x) => {
      if (x.id === null) {
        throw new Error("text cant be null");
      }

      if (!x.value) {
        throw new Error("text value cant be empty");
      }

      let value = x.value[compilationContext.contextParams.locale];

      // Let's apply fallback when we're editing
      const editorContext = compilationContext as EditorContextType;
      if (editorContext.locales && typeof value !== "string") {
        value =
          getFallbackForLocale(
            x.value,
            compilationContext.contextParams.locale,
            editorContext.locales
          ) ?? "";
      }

      return {
        id: x.id,
        value,
      };
    },
    getHash: (value) => {
      // TODO: those conditions will be removed after we merge external-local texts update
      if (typeof value === "string") {
        return value;
      }
      if (value === null) {
        return undefined;
      }

      return value.id ?? undefined;
    },
  };
};
