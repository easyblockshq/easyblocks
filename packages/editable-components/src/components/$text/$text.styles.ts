import { NoCodeComponentStylesFunctionInput } from "@easyblocks/core";
import { box } from "../../box";

export default function ({
  values,
  params,
}: NoCodeComponentStylesFunctionInput<
  {
    color: string;
    value: string;
    accessibilityRole: string;
    font: Record<string, any>;
  },
  { passedAlign: string }
>) {
  const align = params.passedAlign || "left";

  const fontWithDefaults = {
    fontWeight: "initial",
    fontStyle: "initial",
    ...values.font,
  };

  return {
    Text: box(
      {
        ...fontWithDefaults,
        color: values.color,
        textAlign: align,
        "& textarea::placeholder": {
          color: "currentColor",
          opacity: 0.5,
        },
        "& textarea": {
          // This is important when textarea is globally set in project, here we'll override any global styles.
          ...fontWithDefaults,
          color: values.color,
        },
        border: values.value === "" ? "1px dotted grey" : "none",
      },
      values.accessibilityRole
    ),
  };
}
