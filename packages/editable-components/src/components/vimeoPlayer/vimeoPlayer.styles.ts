import { NoCodeComponentStylesFunctionInput } from "@easyblocks/core";
import { box } from "../../box";
import { getPaddingBottomAndHeightFromAspectRatio } from "../../parseAspectRatio";

export interface VimeoPlayerValues {
  aspectRatio: string;
  areControlsDisabled: boolean;
  isAutoPlay: boolean;
  isLoop: boolean;
  isMuted: string;
  videoId: string;
}

export default function styles({
  values,
}: NoCodeComponentStylesFunctionInput<VimeoPlayerValues>) {
  const { height, paddingBottom } = getPaddingBottomAndHeightFromAspectRatio(
    values.aspectRatio
  );

  return {
    Wrapper: box({
      position: "relative",
    }),
    ContentWrapper: box({
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    }),
    Placeholder: box({
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage:
        "linear-gradient(45deg, #ccc 25%, transparent 25%),linear-gradient(135deg, #ccc 25%, transparent 25%),linear-gradient(45deg, transparent 75%, #ccc 75%),linear-gradient(135deg, transparent 75%, #ccc 75%);",
      backgroundSize: "25px 25px;",
      backgroundPosition: "0 0, 12.5px 0, 12.5px -12.5px, 0px 12.5px;",
    }),
    AspectRatioMaker: box({
      position: "relative",
      paddingBottom,
      height,
    }),
    PlayerContainer: box({
      height: "100%",
      width: "100%",
      overflow: "hidden",
    }),
    ErrorContainer: box({
      position: "absolute",
      boxSizing: "border-box",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "#fafafa",
      color: "grey",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "sans-serif",
      textAlign: "center",
      padding: 32,
    }),
  };
}
