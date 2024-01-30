import type {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";
import { getPaddingBottomFromAspectRatio } from "../utils/parseAspectRatio";

export interface VimeoPlayerValues {
  aspectRatio: string;
  areControlsDisabled: boolean;
  isAutoPlay: boolean;
  isLoop: boolean;
  isMuted: string;
  videoId: string;
}

export function vimeoStyles({
  params,
  values,
}: NoCodeComponentStylesFunctionInput<VimeoPlayerValues>): NoCodeComponentStylesFunctionResult {
  const aspectRatio = params.aspectRatio ?? values.aspectRatio;
  const isNaturalAspectRatio = aspectRatio === "natural";

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
        paddingBottom: isNaturalAspectRatio
          ? "56.25%"
          : getPaddingBottomFromAspectRatio(aspectRatio), // we don't know natural size for vimeo so we set it to 16:9
      },
      PlayerContainer: {
        height: "100%",
        width: "100%",
        overflow: "hidden",
        display: "grid",
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
