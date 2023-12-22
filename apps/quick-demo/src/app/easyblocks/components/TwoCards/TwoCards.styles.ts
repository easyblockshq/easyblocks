import type {
  InferNoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";
import { spacingToPx } from "@easyblocks/core";
import {
  sectionWrapperCalculateMarginAndMaxWidth,
  sectionWrapperStyles,
} from "../utils/sectionWrapper/sectionWrapperHelpers";
import { twoCardsComponentDefinition } from "./TwoCards.definition";
import { TWO_CARDS_COL_NUM } from "./twoCardsConstants";

function twoCardsStyles({
  values,
  params,
  device,
  isEditing,
}: InferNoCodeComponentStylesFunctionInput<
  typeof twoCardsComponentDefinition
>): NoCodeComponentStylesFunctionResult {
  const sectionStyles = sectionWrapperStyles({
    values,
    params,
    device,
    isEditing,
  });

  const { margin, containerWidth } = sectionWrapperCalculateMarginAndMaxWidth(
    values.containerMargin,
    values.containerMaxWidth,
    device
  );
  const marginLeft = margin.css;
  const marginRight = margin.css;

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

  const containerWidthCalc = `calc(100% - ${marginLeft} - ${marginRight})`;

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

  const edgeLeftMarginPx = margin.px;
  const edgeRightMarginPx = margin.px;

  let $widthContainer1 =
    (card1Width / TWO_CARDS_COL_NUM) *
    (containerWidth.px - horizontalGapNumber);
  let $widthContainer2 =
    (card2Width / TWO_CARDS_COL_NUM) *
    (containerWidth.px - horizontalGapNumber);

  const container1WidthCalc = `calc(${
    card1Width / TWO_CARDS_COL_NUM
  } * ${containerWidthCalc})`;
  const container2WidthCalc = `calc(${
    card2Width / TWO_CARDS_COL_NUM
  } * ${containerWidthCalc})`;

  if (!values.collapse) {
    card1ContainerStyles = {
      marginLeft: marginLeft,
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
      marginRight: marginRight,
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
      card1ContainerStyles.width = `calc(${container1WidthCalc} + ${marginLeft})`;
      card1Props.edgeLeft = true;
      card1Props.edgeLeftMargin = marginLeft;

      $widthContainer1 = $widthContainer1 + edgeLeftMarginPx;
    }

    if (values.card2EscapeMargin) {
      card2ContainerStyles.marginRight = "0px";
      card2ContainerStyles.width = `calc(${container2WidthCalc} + ${marginRight})`;
      card2Props.edgeRight = true;
      card2Props.edgeRightMargin = marginRight;

      $widthContainer2 = $widthContainer2 + edgeRightMarginPx;
    }
  } else {
    card1ContainerStyles = {
      marginLeft: marginLeft,
      marginRight: marginRight,
      alignSelf: "start",
      width: container1WidthCalc,
    };

    card2ContainerStyles = {
      marginLeft: marginLeft,
      marginRight: marginRight,
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
        card1Props.edgeLeftMargin = marginLeft;

        card1Props.edgeRight = true;
        card1Props.edgeRightMargin = marginRight;

        $widthContainer1 = containerWidth.px;
      } else {
        card1ContainerStyles.width = `calc(${container1WidthCalc} + ${marginLeft})`;
        card1Props.edgeLeft = true;
        card1Props.edgeLeftMargin = marginLeft;

        $widthContainer1 = $widthContainer1 + edgeLeftMarginPx;
      }
    }

    if (values.card2EscapeMargin) {
      card2ContainerStyles.marginLeft = "0px";
      card2ContainerStyles.marginRight = "0px";

      if (card2Width === TWO_CARDS_COL_NUM) {
        card2ContainerStyles.width = "100%";

        card2Props.edgeLeft = true;
        card2Props.edgeLeftMargin = marginLeft;

        card2Props.edgeRight = true;
        card2Props.edgeRightMargin = marginRight;

        $widthContainer2 = containerWidth.px;
      } else {
        card2ContainerStyles.width = `calc(${container2WidthCalc} + ${marginRight})`;
        card2Props.edgeRight = true;
        card2Props.edgeRightMargin = marginRight;

        $widthContainer2 = $widthContainer2 + edgeRightMarginPx;
      }
    }
  }

  const invert = values.collapse && values.invertCollapsed;

  return {
    styled: {
      ...sectionStyles.styled,
      Root: {
        display: "flex",
        flexDirection: values.collapse ? "column" : "row",
        justifyContent: "space-between",
        gap: values.collapse ? values.verticalGap : horizontalGap,
        alignItems,
      },
      Card1Container: {
        display: "grid",
        order: invert ? 2 : 0,
        ...card1ContainerStyles,
      },

      Card2Container: {
        display: "grid",
        ...card2ContainerStyles,
      },
    },

    components: {
      ...sectionStyles.components,
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
    },
  };
}

export { twoCardsStyles };
