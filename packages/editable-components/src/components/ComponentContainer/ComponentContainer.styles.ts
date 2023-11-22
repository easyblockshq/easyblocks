import type {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";

export function componentContainerStyles({
  values,
}: NoCodeComponentStylesFunctionInput): NoCodeComponentStylesFunctionResult {
  return {
    styled: {
      Container: {
        position: "relative",
        display: values.widthAuto ? "inline-flex" : "block",
        maxWidth: values.width === -1 ? "auto" : `${values.width}px`,
      },
    },
    components: {
      Component: {
        $width: values.width,
        $widthAuto: values.widthAuto,
      },
    },
  };
}
