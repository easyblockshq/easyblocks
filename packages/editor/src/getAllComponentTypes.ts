import { EditorContextType } from "./EditorContext";
import { ComponentDefinitionShared } from "@easyblocks/core";
import { normalizeToStringArray } from "./normalizeToStringArray";

export function getAllComponentTypes(editorContext: EditorContextType) {
  const componentTypes = getComponentTypesFromDefinitions(
    editorContext.definitions.components
  );
  return Array.from(new Set([...componentTypes]));
}

function getComponentTypesFromDefinitions(
  definitions: ComponentDefinitionShared[]
) {
  const types = new Set<string>();

  definitions.forEach(({ type }) => {
    normalizeToStringArray(type).forEach((componentType) => {
      types.add(componentType);
    });
  });

  return Array.from(types);
}
