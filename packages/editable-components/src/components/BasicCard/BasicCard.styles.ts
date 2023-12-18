import type {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";
import { getBorderCSSProps } from "../../borderHelpers";
import type { EdgeCompiledValues } from "../../common.types";
import { basicCardController } from "./BasicCard.controller";
import type { BasicCardCompiledValues } from "./BasicCard.types";

function styles({
  values,
  params,
}: NoCodeComponentStylesFunctionInput<
  BasicCardCompiledValues,
  EdgeCompiledValues & Record<string, any>
>): NoCodeComponentStylesFunctionResult {
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
    styled: {
      ContentContainer: {
        position: "relative",
        borderRadius: noBorders ? 0 : values.cornerRadius + "px",
        overflow: noBorders || values.cornerRadius === "0" ? "visible" : "auto",
        display: "grid",
        ...(noBorders ? [] : getBorderCSSProps(values)),
      },

      BackgroundContainer: {
        position: "relative",
        gridColumn: "1 / span 1",
        gridRow: "1 / span 1",
        display: hideBackground ? "none" : "grid",
      },

      StackContainer: {
        gridColumn: "1 / span 1",
        gridRow: "1 / span 1",

        display: hideContent || !enableContent ? "none" : "flex",
        justifyContent: flexPosH,
        alignItems: flexPosV,
      },

      StackInnerContainer: {
        position: "relative",
        width: "auto",
        maxWidth: "100%",
      },
    },

    components: {
      Background: {
        aspectRatio: backgroundAspectRatio,
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
    },
  };
}

export default styles;
