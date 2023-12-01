import { EditorContextType } from "./EditorContext";
import { getAllComponentTypes } from "./getAllComponentTypes";
import { normalizeToStringArray } from "./normalizeToStringArray";
import { getAllComponentsOfType } from "./getAllComponentsOfType";
import { findComponentDefinitionById } from "@easyblocks/core/_internals";
import { ComponentDefinitionShared } from "@easyblocks/core";

export function unrollAcceptsFieldIntoComponents(
  accepts: string | string[] | undefined,
  editorContext: EditorContextType
) {
  const allComponentTypes = getAllComponentTypes(editorContext);
  const idsSet = new Set<ComponentDefinitionShared>();

  normalizeToStringArray(accepts).forEach((acceptsEntry) => {
    if (allComponentTypes.includes(acceptsEntry)) {
      const componentType = acceptsEntry;
      const components = getAllComponentsOfType(componentType, editorContext);

      components.forEach((component) => {
        idsSet.add(component);
      });
    } else {
      const componentId = acceptsEntry;
      const component = findComponentDefinitionById(componentId, editorContext);
      if (component) {
        idsSet.add(component);
      }
    }
  });

  return Array.from(idsSet);
}
