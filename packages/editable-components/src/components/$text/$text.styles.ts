import { box } from "../../box";

export default function (configProps: any) {
  const align = configProps.passedAlign || "left";

  const fontWithDefaults = {
    fontWeight: "initial",
    fontStyle: "initial",
    ...configProps.font,
  };

  return {
    Text: box(
      {
        ...fontWithDefaults,
        color: configProps.color,
        textAlign: align,
        "& textarea::placeholder": {
          color: "currentColor",
          opacity: 0.5,
        },
        "& textarea": {
          // This is important when textarea is globally set in project, here we'll override any global styles.
          ...fontWithDefaults,
          color: configProps.color,
        },
        border: configProps.value === "" ? "1px dotted grey" : "none",
      },
      configProps.accessibilityRole
    ),
  };
}
