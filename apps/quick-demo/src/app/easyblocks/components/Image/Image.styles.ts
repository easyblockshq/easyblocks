import type {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";
import { getPaddingBottomAndHeightFromAspectRatio } from "../utils/parseAspectRatio";

export function imageStyles({
  values,
  params,
}: NoCodeComponentStylesFunctionInput): NoCodeComponentStylesFunctionResult {
  const aspectRatioMakerStyles = getPaddingBottomAndHeightFromAspectRatio(
    params.aspectRatio ?? values.aspectRatio
  );

  const isNaturalAspectRatio = values.aspectRatio === "natural";

  return {
    styled: {
      Wrapper: {
        position: "relative",
      },
      ImageWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        "& img": {
          objectFit: "cover",
        },
      },
      AspectRatioMaker: {
        position: "relative",
        display: isNaturalAspectRatio ? "none" : "block",
        ...aspectRatioMakerStyles,
      },
      // Right now, we don't pass external data to `styles` function so we leave setting correct `paddingBottom`
      // to the component
      NaturalAspectRatioMaker: {
        position: "relative",
        display: isNaturalAspectRatio ? "block" : "none",
        height: "auto",
      },
    },
  };
}
