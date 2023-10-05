import {
  ExternalData,
  getExternalReferenceLocationKey,
} from "@easyblocks/core";
import { TextComponentConfig } from "../$text/$text";
import {
  RichTextAccessibilityRole,
  RichTextComponentConfig,
} from "./$richText";
import {
  buildRichTextComponentConfig,
  buildRichTextLineElementComponentConfig,
  buildRichTextParagraphBlockElementComponentConfig,
  buildRichTextPartComponentConfig,
} from "./builders";

function convertTextComponentConfigToRichTextComponentConfig(
  textComponentConfig: TextComponentConfig,
  locale: string,
  externalData: ExternalData
): RichTextComponentConfig {
  const value = getResourceValueForResource(textComponentConfig, externalData);

  if (value === null || value === undefined) {
    throw new Error("Case not implemented yet");
  }

  const valueByLines = splitValueByLines(value);
  const richTextComponentConfig = buildRichTextComponentConfig({
    accessibilityRole:
      textComponentConfig.accessibilityRole === "p"
        ? "div"
        : (textComponentConfig.accessibilityRole as RichTextAccessibilityRole),
    elements: [
      buildRichTextParagraphBlockElementComponentConfig({
        elements: valueByLines.map((value) => {
          return buildRichTextLineElementComponentConfig({
            elements: [
              buildRichTextPartComponentConfig({
                color: textComponentConfig.color,
                font: textComponentConfig.font,
                value,
              }),
            ],
          });
        }),
      }),
    ],
    // @ts-ignore
    compilationContext: { contextParams: { locale } },
    mainColor: textComponentConfig.color,
    mainFont: textComponentConfig.font,
  });

  return richTextComponentConfig;
}

function getResourceValueForResource(
  textComponentConfig: TextComponentConfig,
  externalData: ExternalData
): string | null | undefined {
  if (textComponentConfig.value.id === null) {
    return "";
  }

  const locationKey = getExternalReferenceLocationKey(
    textComponentConfig._id,
    "value"
  );
  const textResource = externalData[locationKey];

  return "value" in textResource && textResource.type === "text"
    ? (textResource.value as string)
    : null;
}

function splitValueByLines(value: string) {
  const valuesByLines = value.split(/(?:\r\n|\r|\n)/);
  return valuesByLines;
}

export { convertTextComponentConfigToRichTextComponentConfig };
