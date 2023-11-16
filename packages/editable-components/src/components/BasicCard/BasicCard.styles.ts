import { NoCodeComponentStylesFunctionInput } from "@easyblocks/core";
import { getBorderCSSProps } from "../../borderHelpers";
import { box } from "../../box";
import { EdgeCompiledValues } from "../../common.types";
import { basicCardController } from "./BasicCard.controller";
import { BasicCardCompiledValues } from "./BasicCard.types";

function styles({
  values,
  params,
}: NoCodeComponentStylesFunctionInput<
  BasicCardCompiledValues,
  EdgeCompiledValues & Record<string, any>
>) {
  const {
    padding,
    posH,
    posV,
    noBorders,
    backgroundAspectRatio,
    hideContent,
    hideBackground,
    enableContent,
  } = basicCardController({ values, params });

  const flexPosH =
    posH === "left" ? "flex-start" : posH === "center" ? "center" : "flex-end";
  const flexPosV =
    posV === "top" ? "flex-start" : posV === "center" ? "center" : "flex-end";

  return {
    ContentContainer: box({
      position: "relative",
      borderRadius: noBorders ? 0 : values.cornerRadius + "px",
      overflow: noBorders || values.cornerRadius === "0" ? "visible" : "auto",
      display: "grid",
      ...(noBorders ? [] : getBorderCSSProps(values)),
    }),

    BackgroundContainer: box({
      position: "relative",
      gridColumn: "1 / span 1",
      gridRow: "1 / span 1",
      display: hideBackground ? "none" : "grid",
    }),

    Background: {
      passedAspectRatio: backgroundAspectRatio, // we set name "passedAspectRatio" to avoid conflict with "aspectRatio" internal prop. For now overriding is risky.
      gridBaseLineHeight: params.gridBaseLineHeight,
      noAction: true,
      noAspectRatio: true,
      noTrace: true,
    },

    Stack: {
      paddingLeft: padding.left,
      paddingRight: padding.right,
      paddingBottom: padding.bottom,
      paddingTop: padding.top,
      $width: params.$width,
      $widthAuto: true,
    },

    StackContainer: box({
      gridColumn: "1 / span 1",
      gridRow: "1 / span 1",

      display: hideContent || !enableContent ? "none" : "flex",
      justifyContent: flexPosH,
      alignItems: flexPosV,
    }),

    StackInnerContainer: box({
      position: "relative",
      width: "auto",
      maxWidth: "100%",
    }),
  };
}

export default styles;
