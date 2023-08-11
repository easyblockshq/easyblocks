import { EditorContextType } from "./EditorContext";
import {
  findComponentDefinitionById,
  isSchemaPropAction,
  isSchemaPropActionTextModifier,
  isSchemaPropTextModifier,
  parsePath,
} from "@easyblocks/app-utils";
import { SchemaProp } from "@easyblocks/core";

export function pathToCompiledPath(
  path: string,
  editorContext: EditorContextType
): string {
  const pathInfo = parsePath(path, editorContext.form);

  if (pathInfo.parent) {
    const definition = findComponentDefinitionById(
      pathInfo.parent.templateId,
      editorContext
    )!;

    const schemaProp = definition.schema.find(
      (schemaProp) => schemaProp.prop === pathInfo.parent!.fieldName
    )!;

    const result = `${pathToCompiledPath(
      pathInfo.parent.path,
      editorContext
    )}.${getPropertyNameFromSchemaProp(schemaProp)}.${
      pathInfo.parent.fieldName
    }.${pathInfo.index!}`;

    if (result.startsWith(".")) {
      return result.substring(1);
    }

    return result;
  }

  return "";
}

function getPropertyNameFromSchemaProp(schemaProp: SchemaProp) {
  if (isSchemaPropAction(schemaProp)) {
    return "actions";
  }

  if (
    isSchemaPropTextModifier(schemaProp) ||
    isSchemaPropActionTextModifier(schemaProp)
  ) {
    return "textModifiers";
  }

  return "components";
}
