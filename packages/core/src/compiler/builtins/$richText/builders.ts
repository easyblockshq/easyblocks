import { uniqueId } from "@easyblocks/utils";
import { CompilationContextType } from "../../types";
import type { RichTextComponentConfig } from "./$richText";
import type {
  RichTextBlockElementComponentConfig,
  RichTextBlockElementType,
} from "./$richTextBlockElement/$richTextBlockElement";
import type { RichTextInlineWrapperElementEditableComponentConfig } from "./$richTextInlineWrapperElement/$richTextInlineWrapperElement";
import type { RichTextLineElementComponentConfig } from "./$richTextLineElement/$richTextLineElement";
import type { RichTextPartComponentConfig } from "./$richTextPart/$richTextPart";
import { TokenValue } from "../../..";

interface Identity {
  id: string;
}

function buildRichTextNoCodeEntry(options?: {
  text?: string;
  font?: string;
  color?: string;
  accessibilityRole?: string;
  locale?: string;
}) {
  const { accessibilityRole, font, color, text, locale = "en" } = options ?? {};

  const colorTokenValue: TokenValue = {
    value: "#000000",
    widgetId: "@easyblocks/color",
  };

  if (color) {
    colorTokenValue.tokenId = color;
  }

  const fontTokenValue: TokenValue = {
    value: {
      fontFamily: "sans-serif",
      fontSize: "16px",
    },
    widgetId: "@easyblocks/font",
  };

  if (font) {
    fontTokenValue.tokenId = font;
  }

  return {
    _id: uniqueId(),
    _template: "@easyblocks/rich-text",
    accessibilityRole: accessibilityRole ?? "div",
    elements: {
      [locale ?? "en"]: [
        buildRichTextBlockElementComponentConfig("paragraph", [
          buildRichTextLineElementComponentConfig({
            elements: [
              buildRichTextPartComponentConfig({
                color: colorTokenValue,
                font: fontTokenValue,
                value: text ?? "Lorem ipsum",
              }),
            ],
          }),
        ]),
      ],
    },
    isListStyleAuto: true,
    mainColor: colorTokenValue,
    mainFont: fontTokenValue,
  };
}

function buildRichTextComponentConfig({
  accessibilityRole,
  compilationContext,
  elements,
  isListStyleAuto,
  mainColor,
  mainFont,
}: Pick<RichTextComponentConfig, "mainColor" | "mainFont"> &
  Partial<
    Pick<RichTextComponentConfig, "accessibilityRole" | "isListStyleAuto">
  > & {
    compilationContext: CompilationContextType;
    elements: RichTextComponentConfig["elements"][string];
  }): RichTextComponentConfig {
  return {
    _id: uniqueId(),
    _template: "@easyblocks/rich-text",
    accessibilityRole: accessibilityRole ?? "div",
    elements: {
      [compilationContext.contextParams.locale]: elements,
    },
    isListStyleAuto: isListStyleAuto ?? true,
    mainColor,
    mainFont,
  };
}

function buildRichTextBlockElementComponentConfig(
  type: RichTextBlockElementType,
  elements: RichTextBlockElementComponentConfig["elements"]
): RichTextBlockElementComponentConfig {
  return {
    _template: "@easyblocks/rich-text-block-element",
    elements,
    type,
    _id: uniqueId(),
  };
}

function buildRichTextParagraphBlockElementComponentConfig({
  elements,
}: Pick<
  RichTextBlockElementComponentConfig,
  "elements"
>): RichTextBlockElementComponentConfig {
  return {
    _template: "@easyblocks/rich-text-block-element",
    elements,
    type: "paragraph",
    _id: uniqueId(),
  };
}

function buildRichTextBulletedListBlockElementComponentConfig({
  elements,
}: Pick<
  RichTextBlockElementComponentConfig,
  "elements"
>): RichTextBlockElementComponentConfig {
  return {
    _template: "@easyblocks/rich-text-block-element",
    elements,
    type: "bulleted-list",
    _id: uniqueId(),
  };
}

function buildRichTextLineElementComponentConfig({
  elements,
}: Pick<
  RichTextLineElementComponentConfig,
  "elements"
>): RichTextLineElementComponentConfig {
  return {
    _template: "@easyblocks/rich-text-line-element",
    elements,
    _id: uniqueId(),
  };
}

function buildRichTextInlineWrapperElementComponentConfig({
  id,
  elements,
  action,
  textModifier,
  actionTextModifier,
}: Pick<RichTextInlineWrapperElementEditableComponentConfig, "elements"> &
  Partial<
    Identity &
      Pick<
        RichTextInlineWrapperElementEditableComponentConfig,
        "textModifier" | "actionTextModifier" | "action"
      >
  >): RichTextInlineWrapperElementEditableComponentConfig {
  return {
    _id: id ?? uniqueId(),
    _template: "@easyblocks/rich-text-inline-wrapper-element",
    elements,
    action: action ?? [],
    textModifier: textModifier ?? [],
    actionTextModifier: actionTextModifier ?? [],
  };
}

function buildRichTextPartComponentConfig({
  color,
  font,
  value,
  id,
}: Pick<RichTextPartComponentConfig, "color" | "font" | "value"> &
  Partial<Identity>): RichTextPartComponentConfig {
  return {
    _id: id ?? uniqueId(),
    _template: "@easyblocks/rich-text-part",
    color,
    font,
    value,
  };
}

export {
  buildRichTextNoCodeEntry,
  buildRichTextComponentConfig,
  buildRichTextBlockElementComponentConfig,
  buildRichTextBulletedListBlockElementComponentConfig,
  buildRichTextParagraphBlockElementComponentConfig,
  buildRichTextLineElementComponentConfig,
  buildRichTextInlineWrapperElementComponentConfig,
  buildRichTextPartComponentConfig,
};
