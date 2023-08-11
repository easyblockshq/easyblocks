import { getPaddingBottomAndHeightFromAspectRatio } from "../../parseAspectRatio";
import { box } from "../../box";

export function backgroundColorStyles(configProps: any) {
  const { height, paddingBottom } = getPaddingBottomAndHeightFromAspectRatio(
    configProps.passedAspectRatio,
    10,
    configProps.gridBaseLineHeight
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
      backgroundColor: configProps.color,
    }),
  };
}
