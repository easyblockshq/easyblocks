import { spacingToPx } from "@easyblocks/app-utils";
import { box } from "../../box";
import { getEdgeValues } from "../../getEdgeValues";
import { CompiledComponentStylesToolkit } from "../../types";
import { TwoCardsCompiledValues } from "./TwoCards.types";
import { TWO_CARDS_COL_NUM } from "./twoCardsConstants";

function styles(
  config: TwoCardsCompiledValues,
  { $width, device }: CompiledComponentStylesToolkit
) {
  if ($width === -1) {
    throw new Error("$TwoCards without width!!!");
  }

  const edgeInfo = getEdgeValues(config);

  const edgeLeftMargin = edgeInfo.edgeLeftMargin ?? "0px";
  const edgeRightMargin = edgeInfo.edgeRightMargin ?? "0px";

  const card1Width = parseInt(config.card1Width);
  const card2Width = parseInt(config.card2Width);

  let alignItems = "";

  if (config.verticalLayout === "center") {
    alignItems = "center";
  } else if (
    config.verticalLayout === "align-top" ||
    config.verticalLayout === "irregular"
  ) {
    alignItems = "start";
  } else if (config.verticalLayout === "align-bottom") {
    alignItems = "end";
  } else if (config.verticalLayout === "fit") {
    alignItems = "stretch";
  } else {
    throw new Error("[TwoCards] unknown verticalLayout value");
  }

  const verticalOffset = parseInt(config.verticalOffset);

  const containerWidthCalc = `calc(100% - ${edgeLeftMargin} - ${edgeRightMargin})`;

  // Init state is for "non-collapsed" state
  let card1ContainerStyles;
  let card2ContainerStyles;

  let card1Props: any;
  let card2Props: any;

  const horizontalGap: string =
    card1Width + card2Width === TWO_CARDS_COL_NUM && config.collapse === false
      ? config.gap
      : "0px";

  const horizontalGapNumber = spacingToPx(horizontalGap, device.w);

  const edgeLeftMarginNumber = spacingToPx(edgeLeftMargin, device.w);
  const edgeRightMarginNumber = spacingToPx(edgeRightMargin, device.w);

  const $widthContainer = $width - edgeLeftMarginNumber - edgeRightMarginNumber;
  let $widthContainer1 =
    (card1Width / TWO_CARDS_COL_NUM) * ($widthContainer - horizontalGapNumber);
  let $widthContainer2 =
    (card2Width / TWO_CARDS_COL_NUM) * ($widthContainer - horizontalGapNumber);

  const container1WidthCalc = `calc(${
    card1Width / TWO_CARDS_COL_NUM
  } * ${containerWidthCalc})`;
  const container2WidthCalc = `calc(${
    card2Width / TWO_CARDS_COL_NUM
  } * ${containerWidthCalc})`;

  if (!config.collapse) {
    card1ContainerStyles = {
      marginLeft: edgeLeftMargin,
      marginRight: 0,
      position: "relative",
      marginTop:
        config.verticalLayout === "irregular" && verticalOffset > 0
          ? `calc(${containerWidthCalc} / ${TWO_CARDS_COL_NUM} * ${verticalOffset})`
          : 0,
      width: container1WidthCalc,
    };

    card2ContainerStyles = {
      marginLeft: 0,
      marginRight: edgeRightMargin,
      marginTop:
        config.verticalLayout === "irregular" && verticalOffset < 0
          ? `calc(${containerWidthCalc} / ${TWO_CARDS_COL_NUM} * ${-verticalOffset})`
          : 0,
      width: container2WidthCalc,
    };

    card1Props = {
      edgeLeft: false,
      edgeRight: false,
      edgeLeftMargin: null,
      edgeRightMargin: null,
    };

    card2Props = {
      edgeLeft: false,
      edgeRight: false,
      edgeLeftMargin: null,
      edgeRightMargin: null,
    };

    if (config.card1EscapeMargin) {
      card1ContainerStyles.marginLeft = "0px";
      card1ContainerStyles.width = `calc(${container1WidthCalc} + ${edgeLeftMargin})`;
      card1Props.edgeLeft = true;
      card1Props.edgeLeftMargin = edgeInfo.edgeLeftMargin;

      $widthContainer1 = $widthContainer1 + edgeLeftMarginNumber;
    }

    if (config.card2EscapeMargin) {
      card2ContainerStyles.marginRight = "0px";
      card2ContainerStyles.width = `calc(${container2WidthCalc} + ${edgeRightMargin})`;
      card2Props.edgeRight = true;
      card2Props.edgeRightMargin = edgeInfo.edgeRightMargin;

      $widthContainer2 = $widthContainer2 + edgeRightMarginNumber;
    }
  } else {
    card1ContainerStyles = {
      marginLeft: edgeLeftMargin,
      marginRight: edgeRightMargin,
      alignSelf: "start",
      width: container1WidthCalc,
    };

    card2ContainerStyles = {
      marginLeft: edgeLeftMargin,
      marginRight: edgeRightMargin,
      alignSelf: "end",
      width: container2WidthCalc,
    };

    card1Props = {
      edgeLeft: false,
      edgeRight: false,
      edgeLeftMargin: "0px",
      edgeRightMargin: "0px",
    };

    card2Props = {
      edgeLeft: false,
      edgeRight: false,
      edgeLeftMargin: "0px",
      edgeRightMargin: "0px",
    };

    if (config.card1EscapeMargin) {
      card1ContainerStyles.marginLeft = "0px";
      card1ContainerStyles.marginRight = "0px";

      if (card1Width === TWO_CARDS_COL_NUM) {
        card1ContainerStyles.width = "100%";

        card1Props.edgeLeft = true;
        card1Props.edgeLeftMargin = edgeInfo.edgeLeftMargin;

        card1Props.edgeRight = true;
        card1Props.edgeRightMargin = edgeInfo.edgeRightMargin;

        $widthContainer1 = $width;
      } else {
        card1ContainerStyles.width = `calc(${container1WidthCalc} + ${edgeLeftMargin})`;
        card1Props.edgeLeft = true;
        card1Props.edgeLeftMargin = edgeInfo.edgeLeftMargin;

        $widthContainer1 = $widthContainer1 + edgeLeftMarginNumber;
      }
    }

    if (config.card2EscapeMargin) {
      card2ContainerStyles.marginLeft = "0px";
      card2ContainerStyles.marginRight = "0px";

      if (card2Width === TWO_CARDS_COL_NUM) {
        card2ContainerStyles.width = "100%";

        card2Props.edgeLeft = true;
        card2Props.edgeLeftMargin = edgeInfo.edgeLeftMargin;

        card2Props.edgeRight = true;
        card2Props.edgeRightMargin = edgeInfo.edgeRightMargin;

        $widthContainer2 = $width;
      } else {
        card2ContainerStyles.width = `calc(${container2WidthCalc} + ${edgeRightMargin})`;
        card2Props.edgeRight = true;
        card2Props.edgeRightMargin = edgeInfo.edgeRightMargin;

        $widthContainer2 = $widthContainer2 + edgeRightMarginNumber;
      }
    }
  }

  const invert = config.collapse && config.invertCollapsed;

  return {
    Root: box({
      display: "flex",
      flexDirection: config.collapse ? "column" : "row",
      justifyContent: "space-between",
      gap: config.collapse ? config.verticalGap : horizontalGap,
      alignItems,
    }),

    Card1: {
      ...card1Props,
      $width: $widthContainer1,
      $widthAuto: false,
    },

    Card2: {
      ...card2Props,
      $width: $widthContainer2,
      $widthAuto: false,
    },

    Card1Container: box({
      display: "grid",
      order: invert ? 2 : 0,
      ...card1ContainerStyles,
    }),

    Card2Container: box({
      display: "grid",
      ...card2ContainerStyles,
    }),
  };
}

export default styles;
