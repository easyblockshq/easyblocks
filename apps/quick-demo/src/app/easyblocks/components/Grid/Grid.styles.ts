import type {
  InferNoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";
import { spacingToPx } from "@easyblocks/core";
import { sectionWrapperStyles } from "../utils/sectionWrapper";
import type { gridComponentDefinition } from "./Grid";
import { calculateGridMarginsAndWidth } from "./calculateGridMarginsAndWidth";
import {
  buildItemPositions,
  buildRows,
  findFirstItemInRows,
} from "./gridHelpers";

function gridStyles({
  values,
  params,
  device,
  isEditing,
}: InferNoCodeComponentStylesFunctionInput<
  typeof gridComponentDefinition
>): NoCodeComponentStylesFunctionResult {
  const sectionStyles = sectionWrapperStyles({
    values,
    params,
    device,
    isEditing,
  });

  const {
    leftArrowOffset,
    leftArrowPlacement,
    rightArrowOffset,
    rightArrowPlacement,
    shouldSliderItemsBeVisibleOnMargin,
    columnGap,
    rowGap,
  } = values;

  const isSlider = values.variant === "slider";
  const numberOfItems = parseInt(values.numberOfItems);

  const {
    marginRight,
    marginLeft,
    hasMaxWidth,
    widthWithoutMargins,
    maxWidth,
  } = calculateGridMarginsAndWidth({
    containerMargin: values.containerMargin,
    containerMaxWidth: values.containerMaxWidth,
    escapeMargin: !!values.escapeMargin,
    device,
    $width: params.$width,
    $widthAuto: params.$widthAuto,
  });

  const gap: number = spacingToPx(values.columnGap, device.w);

  const itemsVisible =
    isSlider && device.id === "xs"
      ? numberOfItems + (parseFloat(values.fractionalItemWidth) - 1)
      : numberOfItems;

  const calculateCSSAbsoluteMargin = (margin: string) => {
    return hasMaxWidth
      ? `max(calc(calc(100% - ${maxWidth}px) / 2), ${margin})`
      : margin;
  };

  const cssAbsoluteLeftPosition = calculateCSSAbsoluteMargin(marginLeft);
  const cssAbsoluteRightPosition = calculateCSSAbsoluteMargin(marginRight);

  const itemWidth =
    (widthWithoutMargins - gap * (itemsVisible - 1)) / itemsVisible;

  const showSliderControls = isSlider && device.id !== "xs";

  let base = "100%";

  if (shouldSliderItemsBeVisibleOnMargin) {
    base = `calc(100% - ${cssAbsoluteLeftPosition} - ${cssAbsoluteRightPosition})`;
  }

  base += ` - calc(${columnGap} * ${itemsVisible - 1})`;
  base = `calc(${base})`;

  const size = `calc(${base} / ${itemsVisible})`;

  let containerDisplay;

  let containerMarginLeft;
  let containerMarginRight;
  let innerContainerDisplay;
  let spacerDisplay: string;
  let itemContainerMarginRight: string;
  let itemContainerWidth: string;
  let gridColumnGap;

  // Default left arrow state
  let leftArrowWrapperDisplay = "none";
  let leftArrowWrapperLeft = "0px";
  const leftArrowWrapperRight = "auto";
  let leftArrowInnerWrapperLeft = "auto";

  // Default right arrow state
  let rightArrowWrapperDisplay = "none";
  const rightArrowWrapperLeft = "auto";
  let rightArrowWrapperRight = "0px";
  let rightArrowInnerWrapperLeft = "auto";

  let spacerLeftWidth = "0px";
  let spacerRightWidth = "0px";

  let paddingLeft = "0px";
  let paddingRight = "0px";
  const paddingTop = "0px";
  const paddingBottom = "0px";

  if (isSlider) {
    containerDisplay = "flex";
    innerContainerDisplay = "flex";
    spacerDisplay = "block";
    itemContainerMarginRight = columnGap;
    gridColumnGap = 0;
    itemContainerWidth = size;

    if (shouldSliderItemsBeVisibleOnMargin) {
      containerMarginLeft = 0;
      containerMarginRight = 0;
      spacerLeftWidth = `calc(${cssAbsoluteLeftPosition} + ${paddingLeft})`;
      spacerRightWidth = `calc(${cssAbsoluteRightPosition} + ${paddingRight})`;
    } else {
      containerMarginLeft = cssAbsoluteLeftPosition;
      containerMarginRight = cssAbsoluteRightPosition;

      spacerLeftWidth = paddingLeft;
      spacerRightWidth = paddingRight;
    }

    paddingLeft = `0px`;
    paddingRight = `0px`;

    // Left arrow
    leftArrowWrapperDisplay = showSliderControls ? "flex" : "none";

    if (leftArrowPlacement === "inside") {
      leftArrowWrapperLeft = `calc(${cssAbsoluteLeftPosition} + ${leftArrowOffset})`;
    } else if (leftArrowPlacement === "outside") {
      leftArrowWrapperLeft = `calc(${cssAbsoluteLeftPosition} - ${leftArrowOffset})`;
      leftArrowInnerWrapperLeft = "-100%";
    } else if (leftArrowPlacement === "center") {
      leftArrowWrapperLeft = cssAbsoluteLeftPosition;
      leftArrowInnerWrapperLeft = "-50%";
    } else {
      leftArrowWrapperLeft = leftArrowOffset;
    }

    // Left arrow
    rightArrowWrapperDisplay = showSliderControls ? "flex" : "none";

    if (rightArrowPlacement === "inside") {
      rightArrowWrapperRight = `calc(${cssAbsoluteRightPosition} + ${rightArrowOffset})`;
    } else if (rightArrowPlacement === "outside") {
      rightArrowWrapperRight = `calc(${cssAbsoluteRightPosition} - ${rightArrowOffset})`;
      rightArrowInnerWrapperLeft = "100%";
    } else if (rightArrowPlacement === "center") {
      rightArrowWrapperRight = cssAbsoluteRightPosition;
      rightArrowInnerWrapperLeft = "50%";
    } else {
      rightArrowWrapperRight = rightArrowOffset;
    }
  } else {
    containerDisplay = "block";
    spacerDisplay = "none";
    itemContainerMarginRight = "0px";
    itemContainerWidth = "auto";
    innerContainerDisplay = "grid";
    containerMarginLeft = cssAbsoluteLeftPosition;
    containerMarginRight = cssAbsoluteRightPosition;
    gridColumnGap = columnGap;
  }

  const gridTemplateColumns = `repeat(${itemsVisible}, minmax(0, 1fr))`;

  const Root = {
    position: "relative",
    paddingLeft: containerMarginLeft,
    paddingRight: containerMarginRight,
  };

  const Container = {
    position: "relative",
    display: containerDisplay,

    overflowX: isSlider ? "auto" : "visible",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    scrollbarWidth: "none",

    width: "100%",

    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
  };

  const InnerContainer = {
    display: innerContainerDisplay,

    flexDirection: "row",
    flexWrap: "nowrap",

    gridTemplateColumns: gridTemplateColumns,
    gridColumnGap: gridColumnGap,
    gridRowGap: rowGap,

    alignItems: "stretch",

    width: "100%",
  };

  const createSpacer = (basis: string) => ({
    display: spacerDisplay,
    height: "1px",
    position: "relative",
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: basis,
    zIndex: 0,
  });

  const SpacerLeft = createSpacer(spacerLeftWidth);
  const SpacerRight = createSpacer(spacerRightWidth);

  const LeftArrowWrapper = {
    display: leftArrowWrapperDisplay,
    position: "absolute",
    top: 0,
    left: leftArrowWrapperLeft,
    right: leftArrowWrapperRight,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
    zIndex: 100,
    transition: "opacity .15s",
    opacity: 0,
  };

  const LeftArrowInnerWrapper = {
    position: "relative",
    left: leftArrowInnerWrapperLeft,
    pointerEvents: "initial",
  };

  const RightArrowWrapper = {
    display: rightArrowWrapperDisplay,
    position: "absolute",
    top: 0,
    left: rightArrowWrapperLeft,
    right: rightArrowWrapperRight,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
    zIndex: 100,
    transition: "opacity .15s",
    opacity: 0,
  };

  const RightArrowInnerWrapper = {
    position: "relative",
    left: rightArrowInnerWrapperLeft,
    pointerEvents: "initial",
  };

  const itemProps: any[] = [];

  // We set default item container for placeholder
  const cardStyles =
    values.Cards.length > 0
      ? values.Cards
      : [
          {
            itemSize: "1x1",
          },
        ];

  const rows = buildRows(cardStyles, isSlider, numberOfItems);
  const itemPositions = buildItemPositions(
    rows,
    cardStyles.length,
    isSlider ? cardStyles.length : numberOfItems
  );

  const colGapPx = spacingToPx(values.columnGap, widthWithoutMargins);
  const rowGapPx = spacingToPx(values.rowGap, widthWithoutMargins);

  const colDiff = colGapPx / 2;
  const rowDiff = rowGapPx / 2;

  const itemContainers = cardStyles.map((card: any, index: number) => {
    // For slider we always return item container

    const baseProps = {
      $widthAuto: false,
      $width: itemWidth,
    };

    if (isSlider) {
      itemProps.push({
        ...baseProps,
      });

      return {
        display: "grid",
        position: "relative",
        marginRight:
          index < cardStyles.length - 1 ? itemContainerMarginRight : 0,
        flexGrow: 0,
        flexShrink: 0,
        width: itemContainerWidth,
      };
    }

    if (card.itemSize === "1x1") {
      itemProps.push({
        ...baseProps,
      });

      return {
        position: "relative",
        display: "grid",
      };
    } else if (card.itemSize === "2x1" || card.itemSize === "2x2") {
      itemProps.push({
        ...baseProps,
        $width: itemWidth * 2 + spacingToPx(columnGap, device.w),
      });

      if (numberOfItems === 1) {
        return {
          position: "relative",
          display: "grid",
        };
      }

      let { row, col } = findFirstItemInRows(rows, index)!;
      row++;
      col++;

      return {
        position: "relative",
        display: "grid",
        gridRow: card.itemSize === "2x1" ? row : `${row} / span 2`,
        gridColumn: `${col} / span 2`,
      };
    } else {
      throw new Error("other modes than 1x1 and 2x1 are not yet supported");
    }
  });

  const itemInnerContainers = cardStyles.map((card) => {
    const verticalAlign =
      card.verticalAlign === "auto" ? values.verticalAlign : card.verticalAlign;

    return {
      display: "grid",
      position: "relative",
      alignItems: verticalAlignToFlexAlign(verticalAlign),
    };
  });

  return {
    styled: {
      ...sectionStyles.styled,
      Root,
      Container,
      InnerContainer,
      SpacerLeft,
      SpacerRight,
      itemContainers,
      itemInnerContainers,
      LeftArrowWrapper,
      LeftArrowInnerWrapper,
      RightArrowWrapper,
      RightArrowInnerWrapper,
    },
    components: {
      ...sectionStyles.components,
      Cards: {
        itemProps,
      },
      LeftArrow: {
        noAction: true,
      },
      RightArrow: {
        noAction: true,
      },
    },
  };
}

function verticalAlignToFlexAlign(align: string) {
  if (align === "bottom") {
    return "flex-end";
  } else if (align === "center" || align === "stretch") {
    return align;
  } else {
    return "flex-start";
  }
}

export { gridStyles };
