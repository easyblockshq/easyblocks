import type {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";

export default function ({
  values,
}: NoCodeComponentStylesFunctionInput<{
  height: string;
  color: string;
}>): NoCodeComponentStylesFunctionResult {
  return {
    styled: {
      Container: {
        minHeight: 9,
        display: "flex",
        alignItems: "center",
        position: "relative",
      },
      Separator: {
        height: values.height + "px",
        width: "100%",
        backgroundColor: values.color,
      },
    },
  };
}
