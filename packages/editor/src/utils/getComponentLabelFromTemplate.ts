import { AnyTemplate, isSpecialTemplate } from "@easyblocks/app-utils";
import { EditorContextType } from "../EditorContext";

export function getComponentLabelFromTemplate(
  template: AnyTemplate,
  editorContext: EditorContextType
) {
  if (isSpecialTemplate(template)) {
    return template.label ?? "unknown";
  }

  const namesMap: Record<string, string> = {};

  Object.values(editorContext.definitions).forEach((definitions) => {
    definitions.forEach((definition) => {
      namesMap[definition.id] = definition.label ?? definition.id;
    });
  });

  return namesMap[template.config._template];
}
