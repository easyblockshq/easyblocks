import type {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "../../../types";
import { Alignment } from "./$richText.types";

export function richTextStyles({
  values,
  params,
}: NoCodeComponentStylesFunctionInput): NoCodeComponentStylesFunctionResult {
  const align = params.passedAlign ?? values.align;

  return {
    styled: {
      Root: {
        // display: "flex",
        // justifyContent: mapAlignmentToFlexAlignment(align),
        // textAlign: align,
        // color: values.mainColor,
        // ...values.mainFont
      },
    },
    components: {
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
    },
    props: {
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
