import { NoCodeComponentStylesFunctionInput } from "@easyblocks/core";
import { box } from "../../box";
import { getPaddingBottomAndHeightFromAspectRatio } from "../../parseAspectRatio";

export function backgroundColorStyles({
  values,
  params,
}: NoCodeComponentStylesFunctionInput) {
  const { height, paddingBottom } = getPaddingBottomAndHeightFromAspectRatio(
    params.passedAspectRatio,
    10,
    params.gridBaseLineHeight
  );

  return {
    Wrapper: box({
      position: "relative",
    }),
    AspectRatioMaker: box({
      position: "relative",
      paddingBottom,
      height,
    }),
    Background: box({
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: values.color,
    }),
  };
}
