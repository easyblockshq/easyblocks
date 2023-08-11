import { spacingToPx } from "@easyblocks/app-utils";
import { box } from "../../box";
import { parseAspectRatio } from "../../parseAspectRatio";
import { CompiledComponentStylesToolkit } from "../../types";
import { gridController } from "./Grid.controller";
import { GridCompiledValues } from "./Grid.types";
import {
  buildItemPositions,
  buildRows,
  findFirstItemInRows,
} from "./gridHelpers";

function styles(
  config: GridCompiledValues,
  { $width, device }: CompiledComponentStylesToolkit
) {
  if ($width === -1) {
    throw new Error("$GridCard without width!!!");
  }

  const {
    cssAbsoluteLeftPosition,
    cssAbsoluteRightPosition,
    itemsVisible,
    $widthItem,
  } = gridController(config, $width, device);

  const numberOfItems = parseInt(config.numberOfItems);

  const isSlider = config.variant === "slider";

  const {
    shouldSliderItemsBeVisibleOnMargin,
    rightArrowOffset,
    rightArrowPlacement,
    leftArrowPlacement,
    leftArrowOffset,
  } = config;

  let columnGap = config.columnGap;
  let rowGap = config.rowGap;

  if (config.borderEnabled) {
    columnGap = `max(${columnGap}, ${config.borderInner}px)`;
    rowGap = `max(${rowGap}, ${config.borderInner}px)`;
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
    config.borderEnabled &&
    (config.borderLeft !== "0" ||
      config.borderTop !== "0" ||
      config.borderBottom !== "0")
      ? config.paddingLeft
      : "0px";
  let paddingRight =
    config.borderEnabled &&
    (config.borderRight !== "0" ||
      config.borderTop !== "0" ||
      config.borderBottom !== "0")
      ? config.paddingRight
      : "0px";
  const paddingTop =
    config.borderEnabled && config.borderTop !== "0"
      ? config.paddingTop
      : "0px";
  const paddingBottom =
    config.borderEnabled && config.borderBottom !== "0"
      ? config.paddingBottom
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

  const Root = box({
    position: "relative",
    paddingLeft: containerMarginLeft,
    paddingRight: containerMarginRight,
  });

  const Container = box({
    position: "relative",
    display: containerDisplay,

    overflowX: isSlider ? "auto" : "visible",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    scrollbarWidth: "none",

    width: "100%",

    borderTop: config.borderEnabled
      ? `${config.borderTop}px solid ${config.borderColor}`
      : "none",
    borderBottom: config.borderEnabled
      ? `${config.borderBottom}px solid ${config.borderColor}`
      : "none",
    borderLeft: config.borderEnabled
      ? `${config.borderLeft}px solid ${config.borderColor}`
      : "none",
    borderRight: config.borderEnabled
      ? `${config.borderRight}px solid ${config.borderColor}`
      : "none",

    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
  });

  const InnerContainer = box({
    display: innerContainerDisplay,

    flexDirection: "row",
    flexWrap: "nowrap",

    gridTemplateColumns: gridTemplateColumns,
    gridColumnGap: gridColumnGap,
    gridRowGap: rowGap,

    alignItems: "stretch",

    width: "100%",
  });

  const createSpacer = (basis: string) =>
    box({
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

  const LeftArrowWrapper = box({
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
  });

  const LeftArrowInnerWrapper = box({
    position: "relative",
    left: leftArrowInnerWrapperLeft,
    pointerEvents: "initial",
  });

  const RightArrowWrapper = box({
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
  });

  const RightArrowInnerWrapper = box({
    position: "relative",
    left: rightArrowInnerWrapperLeft,
    pointerEvents: "initial",
  });

  const itemProps: any[] = [];

  // This is tricky. Ask Andrzej in case of questions. vw is problematic because of potential scrollbar, but we should introduce global CSS var with correct vw.
  const sizeWithVw = size.replace(
    /100%/g,
    "var(--shopstory-viewport-width, 100vw)"
  );

  const GRID_BASELINE_ASPECT_RATIO = parseAspectRatio(
    config.gridMainObjectAspectRatio
  );
  const gridBaseLineHeight = `calc(${sizeWithVw} * ${GRID_BASELINE_ASPECT_RATIO})`;

  // We set default item container for placeholder
  const cardStyles =
    config.Cards.length > 0
      ? config.Cards
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

  const colGapPx = spacingToPx(config.columnGap, $width);
  const rowGapPx = spacingToPx(config.rowGap, $width);
  const borderWidthPx = parseInt(config.borderInner);

  const colDiff = (colGapPx - borderWidthPx) / 2;
  const rowDiff = (rowGapPx - borderWidthPx) / 2;

  const itemContainers = cardStyles.map((card: any, index: number) => {
    // For slider we always return item container

    const baseProps = {
      gridBaseLineHeight,
      $widthAuto: false,
      $width: $widthItem,
      edgeLeft: calculateEdge(
        config.borderEnabled,
        $width,
        paddingLeft,
        config.borderLeft,
        itemPositions[index].isFirstColumn,
        config.escapeMargin,
        colDiff
      ),
      edgeRight: calculateEdge(
        config.borderEnabled,
        $width,
        paddingRight,
        config.borderRight,
        itemPositions[index].isLastColumn,
        config.escapeMargin,
        colDiff
      ),
      edgeTop: calculateEdge(
        config.borderEnabled,
        $width,
        paddingTop,
        config.borderTop,
        itemPositions[index].isFirstRow,
        false,
        rowDiff
      ),
      edgeBottom: calculateEdge(
        config.borderEnabled,
        $width,
        paddingBottom,
        config.borderBottom,
        itemPositions[index].isLastRow,
        false,
        rowDiff
      ),
    };

    if (isSlider) {
      itemProps.push({
        ...baseProps,
      });

      return box({
        display: "grid",
        position: "relative",
        marginRight:
          index < cardStyles.length - 1 ? itemContainerMarginRight : 0,
        flexGrow: 0,
        flexShrink: 0,
        width: itemContainerWidth,
      });
    }

    if (card.itemSize === "1x1") {
      itemProps.push({
        ...baseProps,
      });

      return box({
        position: "relative",
        display: "grid",
      });
    } else if (card.itemSize === "2x1" || card.itemSize === "2x2") {
      itemProps.push({
        ...baseProps,
        $width: $widthItem * 2 + spacingToPx(columnGap, device.w),
      });

      if (numberOfItems === 1) {
        return box({
          position: "relative",
          display: "grid",
        });
      }

      let { row, col } = findFirstItemInRows(rows, index)!;
      row++;
      col++;

      return box({
        position: "relative",
        display: "grid",
        gridRow: card.itemSize === "2x1" ? row : `${row} / span 2`,
        gridColumn: `${col} / span 2`,
      });
    } else {
      throw new Error("other modes than 1x1 and 2x1 are not yet supported");
    }
  });

  const itemInnerContainers = cardStyles.map((card) => {
    const verticalAlign =
      card.verticalAlign === "auto" ? config.verticalAlign : card.verticalAlign;

    return box({
      display: "grid",
      position: "relative",
      alignItems: verticalAlignToFlexAlign(verticalAlign),
    });
  });

  const verticalLines = cardStyles.map((_, index) => {
    if (!config.borderEnabled) {
      return box({
        display: "none",
      });
    }

    if (itemPositions[index].isLastColumn) {
      return box({
        position: "absolute",
        display: "none",
      });
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

    return box({
      position: "absolute",
      top,
      right: getLineEndPosition(config.borderInner + "px", columnGap),
      width: `${config.borderInner}px`,
      height,
      background: config.borderColor,
      zIndex: 50,
    });
  });

  const horizontalLines = cardStyles.map((_, index) => {
    if (!config.borderEnabled) {
      return box({
        display: "none",
      });
    }

    if (
      itemPositions[index].isLastRow /* || !itemPositions[index].isFirstColumn*/
    ) {
      return box({
        position: "absolute",
        display: "none",
      });
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

    return box({
      position: "absolute",
      bottom: getLineEndPosition(config.borderInner + "px", rowGap), // this min() is required to have at least 1px. This is super important for zero gaps.
      width,
      left,
      height: `${config.borderInner}px`,
      background: config.borderColor,
      zIndex: 50,
    });
  });

  return {
    Root,
    Container,
    InnerContainer,
    SpacerLeft,
    SpacerRight,
    itemContainers,
    itemInnerContainers,
    Cards: {
      itemProps,
    },
    LeftArrowWrapper,
    LeftArrowInnerWrapper,
    LeftArrow: {
      noAction: true,
    },
    RightArrowWrapper,
    RightArrowInnerWrapper,
    RightArrow: {
      noAction: true,
    },
    horizontalLines,
    verticalLines,
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
