import { spacingToPx } from "@easyblocks/app-utils";
import {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";
import { getBorderCSSProps, getBorderInfo } from "../../borderHelpers";
import { EdgeCompiledValues } from "../../common.types";
import { getEdgeValues } from "../../getEdgeValues";
import { bannerCard2SeparateStackModeController } from "./BannerCard2.controller";
import { BannerCard2CompiledValues } from "./BannerCard2.types";

function styles({
  values,
  params,
  isEditing,
  device,
}: NoCodeComponentStylesFunctionInput<
  BannerCard2CompiledValues,
  EdgeCompiledValues
>): NoCodeComponentStylesFunctionResult {
  // For now only mobile possible
  const { cornerRadius } = values;

  const isNoneMode = values.mode === "none";
  const isBackgroundMode = values.mode === "background";
  const isSideMode = values.mode === "left" || values.mode === "right";
  const isTopBottomMode = values.mode === "top" || values.mode === "bottom";
  const isBackgroundWithSeparateStackMode =
    values.mode === "background-separate-stack";

  let rootStyles: any = {};
  let backgroundStyles: any = {};
  let contentStyles: any = {};

  let $widthCard1 = params.$width;
  let $widthCard2 = params.$width;
  let $widthAutoCard1 = false;

  if (isNoneMode) {
    rootStyles = {
      display: "grid",
    };
    backgroundStyles = {
      display: "none",
    };
  } else if (isBackgroundMode) {
    rootStyles = {
      display: "grid",
    };
    backgroundStyles = {
      gridRow: 1,
      gridColumn: 1,
    };
    contentStyles = {
      gridRow: 1,
      gridColumn: 1,
      pointerEvents: isEditing ? "auto" : "none", // For basic mode Content should be pointer-events: none, so that control on background are reachable
    };
  } else if (isSideMode) {
    rootStyles = {
      display: "flex",
      alignItems: "stretch",
      flexDirection: "row",
    };

    const sideImageWidth = parseInt(values.sideModeWidth) / 100;
    const contentWidth = 1 - sideImageWidth;

    backgroundStyles = {
      flex: `0 0 ${sideImageWidth * 100}%`,
    };

    contentStyles = {
      flex: `0 0 ${contentWidth * 100}%`,
    };

    rootStyles.flexDirection = "row";

    if (values.mode === "right") {
      // backgroundOrder = 1;
      backgroundStyles.order = 1;
    }

    $widthCard1 = $widthCard1 * contentWidth;
    $widthCard2 = $widthCard2 * sideImageWidth;

    // content don't "make height" in side-by-side
    // placeholderPaddingBottom = "auto"
  } else if (isTopBottomMode) {
    rootStyles = {
      display: "flex",
      alignItems: "stretch",
      flexDirection: "column",
    };

    backgroundStyles = {
      flex: "0 0 auto",
    };

    contentStyles = {
      flex: "1 1 auto",
    };

    if (values.mode === "bottom") {
      backgroundStyles.order = 1;
    }
  } else if (isBackgroundWithSeparateStackMode) {
    rootStyles = {
      display: "grid",
      gridTemplateColumns: "1fr",
      gridTemplateRows: "1fr",
    };

    backgroundStyles = {
      gridColumn: "1 / span 1",
      gridRow: "1 / span 1",
    };

    const map: Record<string, string> = {
      left: "start",
      center: "center",
      right: "end",
      top: "start",
      bottom: "end",
    };

    const {
      paddingLeft,
      paddingBottom,
      paddingTop,
      paddingRight,
      verticalPosition,
      horizontalPosition,
    } = bannerCard2SeparateStackModeController({ ...values, ...params });

    $widthCard1 =
      $widthCard1 -
      spacingToPx(paddingLeft, device.w) -
      spacingToPx(paddingRight, device.w);
    $widthAutoCard1 = true;

    contentStyles = {
      gridColumn: "1 / span 1",
      gridRow: "1 / span 1",
      position: "relative",
      marginLeft: paddingLeft,
      marginRight: paddingRight,
      marginTop: paddingTop,
      marginBottom: paddingBottom,
      alignSelf: map[verticalPosition],
      justifySelf: map[horizontalPosition],
    };
  }

  /**
   * shouldActivateCardLink conditions below:
   *
   * If BannerCard is a link, then we want entire banner to be a link AND we want buttons / links inside to work properly.
   * How do we do this?
   * 1. We set pointerEvents to "none" to entire container.
   * 2. We set pointerEvents of global link to pointerEvents: "auto"
   * 3. ButtonGroup has forced pointerEvents: auto"
   * 4. When isEditing, we hide global link and don't do any pointerEvents stuff. It's because if we did, editing wouldn't work properly.
   *
   */

  // const shouldActivateCardLink = !isEditing && config.action.length > 0;
  const shouldActivateCardLink = false; // for now card links are disabled

  const borderInfo = getBorderInfo(values);

  /**
   * Edge margins
   */

  const edgeInfo = getEdgeValues(params);

  const Card1: any = {
    gridBaseLineHeight: values.gridBaseLineHeight,
    $width: $widthCard1,
    $widthAuto: $widthAutoCard1,
    passedSize: "none",
    passedNoBorders: true,

    edgeLeft: false,
    edgeLeftMargin: null,
    edgeRight: false,
    edgeRightMargin: null,
    edgeTop: false,
    edgeBottom: false,

    useExternalPaddingTop: false,
    useExternalPaddingBottom: false,
    useExternalPaddingLeft: false,
    useExternalPaddingRight: false,

    hideBackground: false,
  };

  const Card2: any = {
    gridBaseLineHeight: values.gridBaseLineHeight,
    $width: $widthCard2,
    $widthAuto: false,
    // passedSize: "__undefined__",
    passedNoBorders: true,

    edgeLeft: false,
    edgeLeftMargin: null,
    edgeRight: false,
    edgeRightMargin: null,
    edgeTop: false,
    edgeBottom: false,

    useExternalPaddingTop: false,
    useExternalPaddingBottom: false,
    useExternalPaddingLeft: false,
    useExternalPaddingRight: false,

    hideContent: false,
  };

  if (values.mode === "none") {
    Card1.edgeLeft = borderInfo.left || edgeInfo.edgeLeft;
    Card1.edgeLeftMargin = edgeInfo.edgeLeftMargin;
    Card1.edgeRight = borderInfo.right || edgeInfo.edgeRight;
    Card1.edgeRightMargin = edgeInfo.edgeRightMargin;
    Card1.edgeTop = borderInfo.top || edgeInfo.edgeTop;
    Card1.edgeBottom = borderInfo.bottom || edgeInfo.edgeBottom;

    Card1.passedSize = "__undefined__";
  } else if (values.mode === "background") {
    Card1.edgeLeft = true;
    Card1.edgeLeftMargin = edgeInfo.edgeLeftMargin;
    Card1.edgeRight = true;
    Card1.edgeRightMargin = edgeInfo.edgeRightMargin;
    Card1.edgeTop = true;
    Card1.edgeBottom = true;
    Card1.hideBackground = true;
    Card2.hideContent = true;
  } else if (values.mode === "background-separate-stack") {
    Card2.edgeLeft = edgeInfo.edgeLeft;
    Card2.edgeLeftMargin = edgeInfo.edgeLeftMargin;
    Card2.edgeRight = edgeInfo.edgeRight;
    Card2.edgeRightMargin = edgeInfo.edgeRightMargin;

    Card1.passedNoBorders = false;
  } else if (values.mode === "left" || values.mode === "right") {
    const CardLeft = values.mode === "left" ? Card2 : Card1;
    const CardRight = values.mode === "left" ? Card1 : Card2;

    CardRight.edgeRight = borderInfo.right || edgeInfo.edgeRight;
    CardRight.edgeRightMargin = edgeInfo.edgeRightMargin;
    CardRight.edgeLeft = true;
    CardRight.edgeLeftMargin = null;
    CardRight.edgeTop = true; // we mock edge
    CardRight.edgeBottom = true; // we mock edge
    CardRight.useExternalPaddingTop = !borderInfo.top;
    CardRight.useExternalPaddingBottom = !borderInfo.bottom;

    CardLeft.edgeLeft = borderInfo.left || edgeInfo.edgeLeft;
    CardLeft.edgeLeftMargin = edgeInfo.edgeLeftMargin;
    CardLeft.edgeRight = true;
    CardLeft.edgeRightMargin = null;
    CardLeft.edgeTop = true; // we mock edge
    CardLeft.edgeBottom = true; // we mock edge
    CardLeft.useExternalPaddingTop = !borderInfo.top;
    CardLeft.useExternalPaddingBottom = !borderInfo.bottom;

    Card2.passedNoBorders = false;
  } else if (values.mode === "top" || values.mode === "bottom") {
    Card1.edgeLeft = true;
    Card1.edgeLeftMargin = edgeInfo.edgeLeftMargin;

    Card1.edgeRight = true;
    Card1.edgeRightMargin = edgeInfo.edgeRightMargin;

    Card1.edgeTop = true;
    Card1.edgeBottom = true;
    Card1.useExternalPaddingLeft = !borderInfo.left;
    Card1.useExternalPaddingRight = !borderInfo.right;
    // Card1.passedSize = "auto";

    Card2.edgeLeft = edgeInfo.edgeLeft;
    Card2.edgeLeftMargin = edgeInfo.edgeLeftMargin;
    Card2.edgeRight = edgeInfo.edgeRight;
    Card2.edgeRightMargin = edgeInfo.edgeRightMargin;
    Card2.passedNoBorders = false;
  }

  return {
    styled: {
      Container: {
        position: "relative",
        width: "100%",
        borderRadius: cornerRadius + "px",
        ...getBorderCSSProps(values),
        overflow: cornerRadius !== "0" ? "hidden" : "visible",
        pointerEvents: shouldActivateCardLink ? "none" : "auto",
        ...rootStyles,
      },

      SidePhotoContainer: {
        position: "relative",
        display: "grid",
        ...backgroundStyles,
      },

      ContentContainer: {
        display: "grid",
        ...contentStyles,
      },
    },

    components: {
      Card1,
      Card2,
    },
  };
}
export default styles;
