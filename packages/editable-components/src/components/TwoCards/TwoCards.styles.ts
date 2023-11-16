import { spacingToPx } from "@easyblocks/app-utils";
import { NoCodeComponentStylesFunctionInput } from "@easyblocks/core";
import { box } from "../../box";
import { EdgeCompiledValues } from "../../common.types";
import { getEdgeValues } from "../../getEdgeValues";
import { TwoCardsCompiledValues } from "./TwoCards.types";
import { TWO_CARDS_COL_NUM } from "./twoCardsConstants";

function styles({
  values,
  params,
  device,
}: NoCodeComponentStylesFunctionInput<
  TwoCardsCompiledValues,
  EdgeCompiledValues
>) {
  const edgeInfo = getEdgeValues(params);

  const edgeLeftMargin = edgeInfo.edgeLeftMargin ?? "0px";
  const edgeRightMargin = edgeInfo.edgeRightMargin ?? "0px";

  const card1Width = parseInt(values.card1Width);
  const card2Width = parseInt(values.card2Width);

  let alignItems = "";

  if (values.verticalLayout === "center") {
    alignItems = "center";
  } else if (
    values.verticalLayout === "align-top" ||
    values.verticalLayout === "irregular"
  ) {
    alignItems = "start";
  } else if (values.verticalLayout === "align-bottom") {
    alignItems = "end";
  } else if (values.verticalLayout === "fit") {
    alignItems = "stretch";
  } else {
    throw new Error("[TwoCards] unknown verticalLayout value");
  }

  const verticalOffset = parseInt(values.verticalOffset);

  const containerWidthCalc = `calc(100% - ${edgeLeftMargin} - ${edgeRightMargin})`;

  // Init state is for "non-collapsed" state
  let card1ContainerStyles;
  let card2ContainerStyles;

  let card1Props: any;
  let card2Props: any;

  const horizontalGap: string =
    card1Width + card2Width === TWO_CARDS_COL_NUM && values.collapse === false
      ? values.gap
      : "0px";

  const horizontalGapNumber = spacingToPx(horizontalGap, device.w);

  const edgeLeftMarginNumber = spacingToPx(edgeLeftMargin, device.w);
  const edgeRightMarginNumber = spacingToPx(edgeRightMargin, device.w);

  const $widthContainer =
    params.$width - edgeLeftMarginNumber - edgeRightMarginNumber;
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

  if (!values.collapse) {
    card1ContainerStyles = {
      marginLeft: edgeLeftMargin,
      marginRight: 0,
      position: "relative",
      marginTop:
        values.verticalLayout === "irregular" && verticalOffset > 0
          ? `calc(${containerWidthCalc} / ${TWO_CARDS_COL_NUM} * ${verticalOffset})`
          : 0,
      width: container1WidthCalc,
    };

    card2ContainerStyles = {
      marginLeft: 0,
      marginRight: edgeRightMargin,
      marginTop:
        values.verticalLayout === "irregular" && verticalOffset < 0
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

    if (values.card1EscapeMargin) {
      card1ContainerStyles.marginLeft = "0px";
      card1ContainerStyles.width = `calc(${container1WidthCalc} + ${edgeLeftMargin})`;
      card1Props.edgeLeft = true;
      card1Props.edgeLeftMargin = edgeInfo.edgeLeftMargin;

      $widthContainer1 = $widthContainer1 + edgeLeftMarginNumber;
    }

    if (values.card2EscapeMargin) {
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

    if (values.card1EscapeMargin) {
      card1ContainerStyles.marginLeft = "0px";
      card1ContainerStyles.marginRight = "0px";

      if (card1Width === TWO_CARDS_COL_NUM) {
        card1ContainerStyles.width = "100%";

        card1Props.edgeLeft = true;
        card1Props.edgeLeftMargin = edgeInfo.edgeLeftMargin;

        card1Props.edgeRight = true;
        card1Props.edgeRightMargin = edgeInfo.edgeRightMargin;

        $widthContainer1 = params.$width;
      } else {
        card1ContainerStyles.width = `calc(${container1WidthCalc} + ${edgeLeftMargin})`;
        card1Props.edgeLeft = true;
        card1Props.edgeLeftMargin = edgeInfo.edgeLeftMargin;

        $widthContainer1 = $widthContainer1 + edgeLeftMarginNumber;
      }
    }

    if (values.card2EscapeMargin) {
      card2ContainerStyles.marginLeft = "0px";
      card2ContainerStyles.marginRight = "0px";

      if (card2Width === TWO_CARDS_COL_NUM) {
        card2ContainerStyles.width = "100%";

        card2Props.edgeLeft = true;
        card2Props.edgeLeftMargin = edgeInfo.edgeLeftMargin;

        card2Props.edgeRight = true;
        card2Props.edgeRightMargin = edgeInfo.edgeRightMargin;

        $widthContainer2 = params.$width;
      } else {
        card2ContainerStyles.width = `calc(${container2WidthCalc} + ${edgeRightMargin})`;
        card2Props.edgeRight = true;
        card2Props.edgeRightMargin = edgeInfo.edgeRightMargin;

        $widthContainer2 = $widthContainer2 + edgeRightMarginNumber;
      }
    }
  }

  const invert = values.collapse && values.invertCollapsed;

  return {
    Root: box({
      display: "flex",
      flexDirection: values.collapse ? "column" : "row",
      justifyContent: "space-between",
      gap: values.collapse ? values.verticalGap : horizontalGap,
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
