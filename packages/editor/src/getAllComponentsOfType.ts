import { EditorContextType } from "./EditorContext";
import {
  ComponentDefinitionShared,
  isNoCodeComponentOfType,
} from "@easyblocks/core";

export function getAllComponentsOfType(
  type: string,
  editorContext: EditorContextType
) {
  return [
    ...getAllComponentsOfTypeFromDefinitionsArray(
      type,
      editorContext.definitions.components
    ),
    ...getAllComponentsOfTypeFromDefinitionsArray(
      type,
      editorContext.definitions.links
    ),
    ...getAllComponentsOfTypeFromDefinitionsArray(
      type,
      editorContext.definitions.actions
    ),
    ...getAllComponentsOfTypeFromDefinitionsArray(
      type,
      editorContext.definitions.textModifiers
    ),
  ];
}

function getAllComponentsOfTypeFromDefinitionsArray(
  type: string,
  definitions: ComponentDefinitionShared[]
) {
  return definitions.filter((definition) =>
    isNoCodeComponentOfType(definition, type)
  );
}
