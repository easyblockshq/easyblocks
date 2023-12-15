import type {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";
import { getPaddingBottomAndHeightFromAspectRatio } from "@easyblocks/editable-components";

export function backgroundColorStyles({
  values,
  params,
}: NoCodeComponentStylesFunctionInput): NoCodeComponentStylesFunctionResult {
  const { height, paddingBottom } = getPaddingBottomAndHeightFromAspectRatio(
    params.passedAspectRatio,
    10,
    params.gridBaseLineHeight
  );

  return {
    styled: {
      Wrapper: {
        position: "relative",
      },
      AspectRatioMaker: {
        position: "relative",
        paddingBottom,
        height,
      },
      Background: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: values.color,
      },
    },
  };
}
