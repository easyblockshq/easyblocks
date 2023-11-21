import type {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";

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
>): NoCodeComponentStylesFunctionResult {
  const fontWithDefaults = {
    ...DEFAULT_FONT_VALUES,
    ...font,
  };

  return {
    styled: {
      Text: {
        __as: "span",
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
    },
  };
}
