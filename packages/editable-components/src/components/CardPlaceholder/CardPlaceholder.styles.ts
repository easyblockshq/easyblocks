import { NoCodeComponentStylesFunctionInput } from "@easyblocks/core";
import { box } from "../../box";
import { getPaddingBottomAndHeightFromAspectRatio } from "../../parseAspectRatio";

export function cardPlaceholderStyles({
  values,
}: NoCodeComponentStylesFunctionInput) {
  const paddingBottom = getPaddingBottomAndHeightFromAspectRatio(
    values.aspectRatio,
    undefined,
    "1"
  );

  return {
    Root: box({
      position: "relative",
    }),
    AspectRatioMaker: box({
      position: "relative",
      ...paddingBottom,
    }),
    ImageContainer: box({
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
    }),

    TextContainer: box({
      marginTop: "12px",
      ...values.font,
    }),
  };
}
