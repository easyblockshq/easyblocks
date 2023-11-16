import { NoCodeComponentStylesFunctionInput } from "@easyblocks/core";
import { box } from "../../box";

export function componentContainerStyles({
  values,
}: NoCodeComponentStylesFunctionInput) {
  return {
    Container: box({
      position: "relative",
      display: values.widthAuto ? "inline-flex" : "block",
      maxWidth: values.width === -1 ? "auto" : `${values.width}px`,
    }),
    Component: {
      $width: values.width,
      $widthAuto: values.widthAuto,
    },
  };
}
