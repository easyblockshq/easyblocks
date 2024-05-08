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
  focussedField: EditorContextType["focussedField"],
  locale: EditorContextType["contextParams"]["locale"],
  formValues: EditorContextType["form"]["values"],
  definitions: EditorContextType["definitions"]
): RichTextComponentConfig & {
  _itemProps?: Record<string, unknown>;
} {
  const newRichTextComponentConfig: RichTextComponentConfig = {
    ...sourceRichTextComponentConfig,
    elements: {
      [locale]: [],
    },
  };

  focussedField.forEach((focusedField) => {
    const textPartConfig: RichTextPartComponentConfig = get(
      formValues,
      stripRichTextPartSelection(focusedField)
    );

    const { path, range } = parseFocusedRichTextPartConfigPath(focusedField);

    const newTextPartConfig = duplicateConfig(textPartConfig, { definitions });

    if (range) {
      newTextPartConfig.value = textPartConfig.value.slice(...range);
    }

    let lastParentConfigPath = `elements.${locale}`;

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
