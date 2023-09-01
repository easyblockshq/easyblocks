import { Alignment } from "@easyblocks/app-utils";
import { box } from "../../box";

export default function styles(values: Record<string, any>) {
  return {
    Root: box({
      display: "flex",
      justifyContent: mapAlignmentToFlexAlignment(values.align),
      textAlign: values.align,
      fontSize: "initial",
    }),
    elements: {
      // We store values within $richText to allow for changing them from sidebar, but we use them inside of $richTextBlockElement.
      itemProps: values.elements.map(() => ({
        accessibilityRole: values.accessibilityRole,
        mainColor: values.mainColor,
        mainFont: values.mainFont,
        mainFontSize: values.mainFontSize,
        align: values.align,
      })),
    },
    __props: {
      align: values.align,
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
