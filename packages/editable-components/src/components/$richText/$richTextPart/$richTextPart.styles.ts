import { NoCodeComponentStylesFunctionInput } from "@easyblocks/core";
import { box } from "../../../box";

const DEFAULT_FONT_VALUES = {
  fontWeight: "initial",
  fontStyle: "initial",
};

export interface RichTextPartValues {
  color: string;
  font: Record<string, any>;
  value: string;
  // textModifier: [CompiledTextModifier] | [];
}

export default function styles({
  values: { color, font },
  params: { __modifierStyles },
}: NoCodeComponentStylesFunctionInput<
  RichTextPartValues,
  { __modifierStyles?: Record<string, any> }
>) {
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
