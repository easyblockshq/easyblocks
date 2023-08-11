import { basicCardController } from "./BasicCard.controller";
import { box } from "../../box";
import { CompiledComponentStylesToolkit } from "../../types";
import { BasicCardCompiledValues } from "./BasicCard.types";
import { getBorderCSSProps } from "../../borderHelpers";

function styles(
  config: BasicCardCompiledValues,
  { $width }: CompiledComponentStylesToolkit
) {
  const {
    padding,
    posH,
    posV,
    noBorders,
    backgroundAspectRatio,
    hideContent,
    hideBackground,
    enableContent,
  } = basicCardController(config);

  if ($width === -1) {
    throw new Error("$BasicCard without width!!!");
  }

  const flexPosH =
    posH === "left" ? "flex-start" : posH === "center" ? "center" : "flex-end";
  const flexPosV =
    posV === "top" ? "flex-start" : posV === "center" ? "center" : "flex-end";

  return {
    ContentContainer: box({
      position: "relative",
      borderRadius: noBorders ? 0 : config.cornerRadius + "px",
      overflow: noBorders || config.cornerRadius === "0" ? "visible" : "auto",
      display: "grid",
      ...(noBorders ? [] : getBorderCSSProps(config)),
    }),

    BackgroundContainer: box({
      position: "relative",
      gridColumn: "1 / span 1",
      gridRow: "1 / span 1",
      display: hideBackground ? "none" : "grid",
    }),

    Background: {
      passedAspectRatio: backgroundAspectRatio, // we set name "passedAspectRatio" to avoid conflict with "aspectRatio" internal prop. For now overriding is risky.
      gridBaseLineHeight: config.gridBaseLineHeight,
      noAction: true,
      noAspectRatio: true,
      noTrace: true,
    },

    Stack: {
      paddingLeft: padding.left,
      paddingRight: padding.right,
      paddingBottom: padding.bottom,
      paddingTop: padding.top,
      $width,
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
