import type {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";
import { spacingToPx } from "@easyblocks/core";
import { parseAspectRatio } from "../../parseAspectRatio";
import { gridController } from "./Grid.controller";
import type { GridCompiledValues, GridParams } from "./Grid.types";
import {
  buildItemPositions,
  buildRows,
  findFirstItemInRows,
} from "./gridHelpers";

function styles({
  values,
  params,
  device,
}: NoCodeComponentStylesFunctionInput<
  GridCompiledValues,
  GridParams
>): NoCodeComponentStylesFunctionResult {
  const {
    cssAbsoluteLeftPosition,
    cssAbsoluteRightPosition,
    itemsVisible,
    $widthItem,
  } = gridController(values, params, device);

  const numberOfItems = parseInt(values.numberOfItems);

  const isSlider = values.variant === "slider";

  const {
    shouldSliderItemsBeVisibleOnMargin,
    rightArrowOffset,
    rightArrowPlacement,
    leftArrowPlacement,
    leftArrowOffset,
  } = values;

  let columnGap = values.columnGap;
  let rowGap = values.rowGap;

  if (values.borderEnabled) {
    columnGap = `max(${columnGap}, ${values.borderInner}px)`;
    rowGap = `max(${rowGap}, ${values.borderInner}px)`;
  }

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

  let paddingLeft =
    values.borderEnabled &&
    (values.borderLeft !== "0" ||
      values.borderTop !== "0" ||
      values.borderBottom !== "0")
      ? values.paddingLeft
      : "0px";
  let paddingRight =
    values.borderEnabled &&
    (values.borderRight !== "0" ||
      values.borderTop !== "0" ||
      values.borderBottom !== "0")
      ? values.paddingRight
      : "0px";
  const paddingTop =
    values.borderEnabled && values.borderTop !== "0"
      ? values.paddingTop
      : "0px";
  const paddingBottom =
    values.borderEnabled && values.borderBottom !== "0"
      ? values.paddingBottom
      : "0px";

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

    borderTop: values.borderEnabled
      ? `${values.borderTop}px solid ${values.borderColor}`
      : "none",
    borderBottom: values.borderEnabled
      ? `${values.borderBottom}px solid ${values.borderColor}`
      : "none",
    borderLeft: values.borderEnabled
      ? `${values.borderLeft}px solid ${values.borderColor}`
      : "none",
    borderRight: values.borderEnabled
      ? `${values.borderRight}px solid ${values.borderColor}`
      : "none",

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

  // This is tricky. Ask Andrzej in case of questions. vw is problematic because of potential scrollbar, but we should introduce global CSS var with correct vw.
  const sizeWithVw = size.replace(
    /100%/g,
    "var(--shopstory-viewport-width, 100vw)"
  );

  const GRID_BASELINE_ASPECT_RATIO = parseAspectRatio(
    values.gridMainObjectAspectRatio
  );
  const gridBaseLineHeight = `calc(${sizeWithVw} * ${GRID_BASELINE_ASPECT_RATIO})`;

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

  const colGapPx = spacingToPx(values.columnGap, params.$width);
  const rowGapPx = spacingToPx(values.rowGap, params.$width);
  const borderWidthPx = parseInt(values.borderInner);

  const colDiff = (colGapPx - borderWidthPx) / 2;
  const rowDiff = (rowGapPx - borderWidthPx) / 2;

  const itemContainers = cardStyles.map((card: any, index: number) => {
    // For slider we always return item container

    const baseProps = {
      gridBaseLineHeight,
      $widthAuto: false,
      $width: $widthItem,
      edgeLeft: calculateEdge(
        values.borderEnabled,
        params.$width,
        paddingLeft,
        values.borderLeft,
        itemPositions[index].isFirstColumn,
        params.escapeMargin,
        colDiff
      ),
      edgeRight: calculateEdge(
        values.borderEnabled,
        params.$width,
        paddingRight,
        values.borderRight,
        itemPositions[index].isLastColumn,
        params.escapeMargin,
        colDiff
      ),
      edgeTop: calculateEdge(
        values.borderEnabled,
        params.$width,
        paddingTop,
        values.borderTop,
        itemPositions[index].isFirstRow,
        false,
        rowDiff
      ),
      edgeBottom: calculateEdge(
        values.borderEnabled,
        params.$width,
        paddingBottom,
        values.borderBottom,
        itemPositions[index].isLastRow,
        false,
        rowDiff
      ),
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
        $width: $widthItem * 2 + spacingToPx(columnGap, device.w),
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

  const verticalLines = cardStyles.map((_, index) => {
    if (!values.borderEnabled) {
      return {
        display: "none",
      };
    }

    if (itemPositions[index].isLastColumn) {
      return {
        position: "absolute",
        display: "none",
      };
    }

    const halfRowGap = `calc(${rowGap} / 2)`;
    const halfRowGapNegative = `calc(${rowGap} / -2)`;

    let top;
    let height;

    if (itemPositions[index].isFirstRow && itemPositions[index].isLastRow) {
      top = `calc(${paddingTop} * -1)`;
      height = `calc(100% + ${paddingTop} + ${paddingBottom})`;
    } else if (itemPositions[index].isFirstRow) {
      top = `calc(${paddingTop} * -1)`;
      height = `calc(100% + ${halfRowGap} + ${paddingTop})`;
    } else if (itemPositions[index].isLastRow) {
      top = halfRowGapNegative;
      height = `calc(100% + ${halfRowGap} + ${paddingBottom})`;
    } else {
      top = halfRowGapNegative;
      height = `calc(100% + ${rowGap})`;
    }

    return {
      position: "absolute",
      top,
      right: getLineEndPosition(values.borderInner + "px", columnGap),
      width: `${values.borderInner}px`,
      height,
      background: values.borderColor,
      zIndex: 50,
    };
  });

  const horizontalLines = cardStyles.map((_, index) => {
    if (!values.borderEnabled) {
      return {
        display: "none",
      };
    }

    if (
      itemPositions[index].isLastRow /* || !itemPositions[index].isFirstColumn*/
    ) {
      return {
        position: "absolute",
        display: "none",
      };
    }

    let width;
    let left;

    const halfColGap = `calc(${columnGap} / 2)`;
    const halfColGapNegative = `calc(${columnGap} / -2)`;

    if (
      itemPositions[index].isFirstColumn &&
      itemPositions[index].isLastColumn
    ) {
      width = `calc(100% + ${paddingLeft} + ${paddingRight})`;
      left = `calc(${paddingLeft} * -1)`;
    } else if (itemPositions[index].isFirstColumn) {
      width = `calc(100% + ${paddingLeft} + ${halfColGap})`;
      left = `calc(${paddingLeft} * -1)`;
    } else if (itemPositions[index].isLastColumn) {
      width = `calc(100% + ${paddingRight} + ${halfColGap})`;
      left = halfColGapNegative;
    } else {
      width = `calc(100% + ${columnGap})`;
      left = halfColGapNegative;
    }

    return {
      position: "absolute",
      bottom: getLineEndPosition(values.borderInner + "px", rowGap), // this min() is required to have at least 1px. This is super important for zero gaps.
      width,
      left,
      height: `${values.borderInner}px`,
      background: values.borderColor,
      zIndex: 50,
    };
  });

  return {
    styled: {
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
      horizontalLines,
      verticalLines,
    },
    components: {
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

const THRESHOLD = 4;

function calculateEdge(
  borderEnabled: boolean,
  width: number,
  padding: string,
  border: string,
  isAtEdge: boolean,
  touching: boolean,
  innerDiff: number
) {
  const paddingPx = spacingToPx(padding, width);
  const hasBorder = borderEnabled && border !== "0";
  return (
    (isAtEdge && !hasBorder && touching) ||
    (isAtEdge && hasBorder && paddingPx < THRESHOLD) ||
    (!isAtEdge && innerDiff < THRESHOLD)
  );
}

function getLineEndPosition(borderWidth: string, gap: string) {
  return `min(-1px, calc(calc(${gap} / -2) + calc(${borderWidth} / -2)))`;
}

export default styles;
