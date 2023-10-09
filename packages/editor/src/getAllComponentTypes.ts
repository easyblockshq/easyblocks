import { EditorContextType } from "./EditorContext";
import { ComponentDefinitionShared } from "@easyblocks/core";
import { normalizeToStringArray } from "./normalizeToStringArray";

export function getAllComponentTypes(editorContext: EditorContextType) {
  const componentTypes = getComponentTypesFromDefinitions(
    editorContext.definitions.components
  );
  const actionTypes = getComponentTypesFromDefinitions(
    editorContext.definitions.actions
  );
  const linkTypes = getComponentTypesFromDefinitions(
    editorContext.definitions.links
  );
  const textModifierTypes = getComponentTypesFromDefinitions(
    editorContext.definitions.textModifiers
  );

  return Array.from(
    new Set([
      ...componentTypes,
      ...actionTypes,
      ...linkTypes,
      ...textModifierTypes,
    ])
  );
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
