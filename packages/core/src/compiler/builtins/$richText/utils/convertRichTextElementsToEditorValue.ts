import { uniqueId } from "@easyblocks/utils";
import type { Text } from "slate";
import { RichTextComponentConfig } from "../$richText";
import type { BlockElement } from "../$richText.types";
import { RichTextBlockElementComponentConfig } from "../$richTextBlockElement/$richTextBlockElement";
import { RichTextPartComponentConfig } from "../$richTextPart/$richTextPart";
import { isRichTextInlineWrapperElementNoCodeEntry } from "./checkers";

function convertRichTextElementsToEditorValue(
  richTextElements: RichTextComponentConfig["elements"][string] | undefined
): Array<BlockElement> {
  if (!richTextElements || richTextElements.length === 0) {
    return getPlaceholderRichTextElements();
  }

  return richTextElements.map((richTextBlockElementComponentConfig) => {
    return convertRichTextBlockElementComponentConfigToEditorElement(
      richTextBlockElementComponentConfig
    );
  });
}

export { convertRichTextElementsToEditorValue };

function convertRichTextPartComponentConfigToEditorText(
  richTextPartComponentConfig: RichTextPartComponentConfig
): Text {
  return {
    color: richTextPartComponentConfig.color,
    font: richTextPartComponentConfig.font,
    id: richTextPartComponentConfig._id,
    text: richTextPartComponentConfig.value,
  };
}

function convertRichTextBlockElementComponentConfigToEditorElement(
  blockElementComponentConfig: RichTextBlockElementComponentConfig
): BlockElement {
  if (
    blockElementComponentConfig.type === "bulleted-list" ||
    blockElementComponentConfig.type === "numbered-list"
  ) {
    return {
      id: blockElementComponentConfig._id,
      type: blockElementComponentConfig.type,
      children: blockElementComponentConfig.elements.map(
        (lineElementComponentConfig) => {
          return {
            type: "list-item",
            id: lineElementComponentConfig._id,
            children: lineElementComponentConfig.elements.map(
              (childComponentConfig) => {
                if (
                  isRichTextInlineWrapperElementNoCodeEntry(
                    childComponentConfig
                  )
                ) {
                  return {
                    id: childComponentConfig._id,
                    type: "inline-wrapper",
                    children: childComponentConfig.elements.map(
                      (textPartComponentConfig) => {
                        return convertRichTextPartComponentConfigToEditorText(
                          textPartComponentConfig
                        );
                      }
                    ),
                    action: childComponentConfig.action,
                    actionTextModifier: childComponentConfig.actionTextModifier,
                    textModifier: childComponentConfig.textModifier,
                  };
                }

                return convertRichTextPartComponentConfigToEditorText(
                  childComponentConfig
                );
              }
            ),
          };
        }
      ),
    };
  }

  return {
    id: blockElementComponentConfig._id,
    type: blockElementComponentConfig.type,
    children: blockElementComponentConfig.elements.map(
      (lineElementComponentConfig) => {
        return {
          type: "text-line",
          id: lineElementComponentConfig._id,
          children: lineElementComponentConfig.elements.map(
            (childComponentConfig) => {
              if (
                isRichTextInlineWrapperElementNoCodeEntry(childComponentConfig)
              ) {
                return {
                  id: childComponentConfig._id,
                  type: "inline-wrapper",
                  children: childComponentConfig.elements.map(
                    (textPartComponentConfig) => {
                      return convertRichTextPartComponentConfigToEditorText(
                        textPartComponentConfig
                      );
                    }
                  ),
                  action: childComponentConfig.action,
                  actionTextModifier: childComponentConfig.actionTextModifier,
                  textModifier: childComponentConfig.textModifier,
                };
              }

              return convertRichTextPartComponentConfigToEditorText(
                childComponentConfig
              );
            }
          ),
        };
      }
    ),
  };
}

function getPlaceholderRichTextElements(): Array<BlockElement> {
  return [
    {
      id: uniqueId(),
      type: "paragraph",
      children: [
        {
          id: uniqueId(),
          type: "text-line",
          children: [
            {
              id: uniqueId(),
              color: {
                ref: "black",
                value: "black",
              },
              font: {
                ref: "$body",
                value: "",
              },
              text: "",
            },
          ],
        },
      ],
    },
  ];
}
