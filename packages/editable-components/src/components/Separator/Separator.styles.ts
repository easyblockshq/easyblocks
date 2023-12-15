import type {
  InferNoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";
import type { separatorDefinition } from "./Separator";

export default function ({
  values,
}: InferNoCodeComponentStylesFunctionInput<
  typeof separatorDefinition
>): NoCodeComponentStylesFunctionResult {
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
