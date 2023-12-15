import type {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";
import { getPaddingBottomAndHeightFromAspectRatio } from "@easyblocks/editable-components";

export interface VimeoPlayerValues {
  aspectRatio: string;
  areControlsDisabled: boolean;
  isAutoPlay: boolean;
  isLoop: boolean;
  isMuted: string;
  videoId: string;
}

export function vimeoStyles({
  values,
}: NoCodeComponentStylesFunctionInput<VimeoPlayerValues>): NoCodeComponentStylesFunctionResult {
  const { height, paddingBottom } = getPaddingBottomAndHeightFromAspectRatio(
    values.aspectRatio
  );

  return {
    styled: {
      Wrapper: {
        position: "relative",
      },
      ContentWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      },
      Placeholder: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage:
          "linear-gradient(45deg, #ccc 25%, transparent 25%,linear-gradient(135deg, #ccc 25%, transparent 25%,linear-gradient(45deg, transparent 75%, #ccc 75%,linear-gradient(135deg, transparent 75%, #ccc 75%);",
        backgroundSize: "25px 25px;",
        backgroundPosition: "0 0, 12.5px 0, 12.5px -12.5px, 0px 12.5px;",
      },
      AspectRatioMaker: {
        position: "relative",
        paddingBottom,
        height,
      },
      PlayerContainer: {
        height: "100%",
        width: "100%",
        overflow: "hidden",
      },
      ErrorContainer: {
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
      },
    },
  };
}
