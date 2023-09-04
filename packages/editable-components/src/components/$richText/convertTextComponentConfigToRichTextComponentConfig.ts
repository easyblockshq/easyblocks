import { Resource, TextResource } from "@easyblocks/core";
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
  resources: Array<Resource>
): RichTextComponentConfig {
  const value = getResourceValueForResource(
    textComponentConfig.value,
    locale,
    resources
  );

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
  unresolvedResource: TextComponentConfig["value"],
  locale: string,
  resources: Array<Resource>
): string | null | undefined {
  if (unresolvedResource.id === null) {
    return "";
  }

  const textResource = resources.find<TextResource>(
    (r): r is TextResource => true
  );

  return textResource?.value?.[locale];
}

function splitValueByLines(value: string) {
  const valuesByLines = value.split(/(?:\r\n|\r|\n)/);
  return valuesByLines;
}

export { convertTextComponentConfigToRichTextComponentConfig };
