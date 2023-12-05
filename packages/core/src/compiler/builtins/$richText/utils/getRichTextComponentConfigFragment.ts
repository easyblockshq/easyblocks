import {
  dotNotationGet as get,
  dotNotationSet as set,
} from "@easyblocks/utils";
import { RichTextComponentConfig } from "../$richText";
import { RichTextPartComponentConfig } from "../$richTextPart/$richTextPart";
import { duplicateConfig } from "../../../duplicateConfig";
import { EditorContextType } from "../../../types";
import { parseFocusedRichTextPartConfigPath } from "./parseRichTextPartConfigPath";
import { stripRichTextPartSelection } from "./stripRichTextTextPartSelection";

function getRichTextComponentConfigFragment(
  sourceRichTextComponentConfig: RichTextComponentConfig,
  editorContext: EditorContextType
): RichTextComponentConfig & {
  _itemProps?: Record<string, unknown>;
} {
  const { focussedField, form, contextParams } = editorContext;

  const newRichTextComponentConfig: RichTextComponentConfig = {
    ...sourceRichTextComponentConfig,
    elements: {
      [contextParams.locale]: [],
    },
  };

  focussedField.forEach((focusedField) => {
    const textPartConfig: RichTextPartComponentConfig = get(
      form.values,
      stripRichTextPartSelection(focusedField)
    );

    const { path, range } = parseFocusedRichTextPartConfigPath(focusedField);

    const newTextPartConfig = duplicateConfig(textPartConfig, editorContext);

    if (range) {
      newTextPartConfig.value = textPartConfig.value.slice(...range);
    }

    let lastParentConfigPath = `elements.${contextParams.locale}`;

    path.slice(0, -1).forEach((pathIndex, index) => {
      let currentConfigPath = lastParentConfigPath;

      if (index === 0) {
        currentConfigPath += `.${pathIndex}`;
      } else {
        const parentConfig = get(
          newRichTextComponentConfig,
          lastParentConfigPath
        );

        currentConfigPath += `.elements.${Math.min(
          parentConfig.elements.length,
          pathIndex
        )}`;
      }

      const currentConfig = get(newRichTextComponentConfig, currentConfigPath);

      if (!currentConfig) {
        const sourceConfigPath =
          lastParentConfigPath +
          (index === 0 ? `.${pathIndex}` : `.elements.${pathIndex}`);

        const sourceConfig = get(
          sourceRichTextComponentConfig,
          sourceConfigPath
        );

        const configCopy = {
          ...sourceConfig,
          elements: [],
        };

        set(newRichTextComponentConfig, currentConfigPath, configCopy);
      }

      lastParentConfigPath = currentConfigPath;
    });

    const textPartParentConfig = get(
      newRichTextComponentConfig,
      lastParentConfigPath
    );

    set(newRichTextComponentConfig, lastParentConfigPath, {
      ...textPartParentConfig,
      elements: [...textPartParentConfig.elements, newTextPartConfig],
    });
  });

  return newRichTextComponentConfig;
}

export { getRichTextComponentConfigFragment };
