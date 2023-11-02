import { box } from "../../../box";

const DEFAULT_FONT_VALUES = {
  fontWeight: "initial",
  fontStyle: "initial",
};

interface RichTextPartStateAndProps {
  color: string;
  font: Record<string, any>;
  value: string;
  // textModifier: [CompiledTextModifier] | [];
  __modifierStyles?: Record<string, any>;
}

export default function styles({
  color,
  font,
  __modifierStyles,
}: RichTextPartStateAndProps) {
  const fontWithDefaults = {
    ...DEFAULT_FONT_VALUES,
    ...font,
  };

  return {
    Text: box(
      {
        color,
        ...fontWithDefaults,
        ...__modifierStyles,
        "& *": {
          fontFamily: "inherit",
          fontStyle: "inherit",
          color: "inherit",
          ...__modifierStyles,
        },
      },
      "span"
    ),
  };
}
