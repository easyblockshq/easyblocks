import { uniqueId } from "@easyblocks/utils";
import { SetOptional } from "type-fest";
import type { TokenValue } from "../../../types";
import type { RichTextComponentConfig } from "./$richText";
import type {
  RichTextBlockElementComponentConfig,
  RichTextBlockElementType,
} from "./$richTextBlockElement/$richTextBlockElement";
import type { RichTextLineElementComponentConfig } from "./$richTextLineElement/$richTextLineElement";
import type { RichTextPartComponentConfig } from "./$richTextPart/$richTextPart";

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
                TextWrapper: [],
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
  locale,
  elements,
  isListStyleAuto,
  mainColor,
  mainFont,
}: Pick<RichTextComponentConfig, "mainColor" | "mainFont"> &
  Partial<
    Pick<RichTextComponentConfig, "accessibilityRole" | "isListStyleAuto">
  > & {
    locale: string;
    elements: RichTextComponentConfig["elements"][string];
  }): RichTextComponentConfig {
  return {
    _id: uniqueId(),
    _template: "@easyblocks/rich-text",
    accessibilityRole: accessibilityRole ?? "div",
    elements: {
      [locale]: elements,
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

function buildRichTextPartComponentConfig({
  color,
  font,
  value,
  id,
  TextWrapper,
}: SetOptional<
  Omit<RichTextPartComponentConfig, "$$$refs" | "_id" | "_template"> &
    Partial<Identity>,
  "TextWrapper"
>): RichTextPartComponentConfig {
  return {
    _id: id ?? uniqueId(),
    _template: "@easyblocks/rich-text-part",
    color,
    font,
    value,
    TextWrapper: TextWrapper ?? [],
  };
}

export {
  buildRichTextBlockElementComponentConfig,
  buildRichTextBulletedListBlockElementComponentConfig,
  buildRichTextComponentConfig,
  buildRichTextLineElementComponentConfig,
  buildRichTextNoCodeEntry,
  buildRichTextParagraphBlockElementComponentConfig,
  buildRichTextPartComponentConfig,
};
