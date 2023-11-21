import type {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";
import { getPaddingBottomAndHeightFromAspectRatio } from "../../parseAspectRatio";

export function cardPlaceholderStyles({
  values,
}: NoCodeComponentStylesFunctionInput): NoCodeComponentStylesFunctionResult {
  const paddingBottom = getPaddingBottomAndHeightFromAspectRatio(
    values.aspectRatio,
    undefined,
    "1"
  );

  return {
    styled: {
      Root: {
        position: "relative",
      },
      AspectRatioMaker: {
        position: "relative",
        ...paddingBottom,
      },
      ImageContainer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: values.backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#D8D8D8",
      },

      TextContainer: {
        marginTop: "12px",
        ...values.font,
      },
    },
  };
}
