import type {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";

export function solidColorStyles({
  values,
}: NoCodeComponentStylesFunctionInput): NoCodeComponentStylesFunctionResult {
  return {
    styled: {
      Root: {
        position: "relative",
        backgroundColor: values.color,
      },
    },
  };
}
