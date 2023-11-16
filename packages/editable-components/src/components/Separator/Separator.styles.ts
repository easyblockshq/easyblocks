import { NoCodeComponentStylesFunctionInput } from "@easyblocks/core";
import { box } from "../../box";

export default function ({
  values,
}: NoCodeComponentStylesFunctionInput<{ height: string; color: string }>) {
  return {
    Container: box({
      minHeight: 9,
      display: "flex",
      alignItems: "center",
      position: "relative",
    }),
    Separator: box({
      height: values.height + "px",
      width: "100%",
      backgroundColor: values.color,
    }),
  };
}
