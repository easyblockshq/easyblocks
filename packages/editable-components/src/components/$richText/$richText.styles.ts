import { Alignment } from "@easyblocks/app-utils";
import { box } from "../../box";

export default function styles(values: Record<string, any>) {
  const align = values.passedAlign ?? values.align;

  return {
    Root: box({
      display: "flex",
      justifyContent: mapAlignmentToFlexAlignment(align),
      textAlign: align,
    }),
    elements: {
      // We store values within $richText to allow for changing them from sidebar, but we use them inside of $richTextBlockElement.
      itemProps: values.elements.map(() => ({
        accessibilityRole: values.accessibilityRole,
        mainColor: values.mainColor,
        mainFont: values.mainFont,
        mainFontSize: values.mainFontSize,
        align,
      })),
    },
    __props: {
      align,
    },
  };
}

export function mapAlignmentToFlexAlignment(align: Alignment) {
  if (align === "center") {
    return "center";
  }

  if (align === "right") {
    return "flex-end";
  }

  return "flex-start";
}
