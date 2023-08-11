import { calculatePaddings } from "../BasicCard/BasicCard.controller";

export function bannerCard2SeparateStackModeController(
  config: Record<string, any>
) {
  const [vPos, hPos] = config.backgroundModePosition.split("-");

  let paddingLeft: string = config.backgroundModePaddingLeft;
  let paddingRight: string = config.backgroundModePaddingRight;

  let paddingTop: string = config.backgroundModePaddingTop;
  let paddingBottom: string = config.backgroundModePaddingBottom;

  const horizontalPaddingInfo = calculatePaddings({
    startPaddingType: "internal",
    endPaddingType: "internal",
    values: {
      startPadding: paddingLeft,
      startPaddingExternal: paddingLeft,
      endPadding: paddingRight,
      endPaddingExternal: paddingRight,
    },
    edge: {
      snap: config.backgroundModeEdgeMarginProtection,
      start: config.edgeLeft ?? false,
      startMargin: config.edgeLeftMargin ?? "0px",
      end: config.edgeRight ?? false,
      endMargin: config.edgeRightMargin ?? "0px",
    },
    isCentered: hPos === "center",
  });

  const verticalPaddingInfo = calculatePaddings({
    startPaddingType: "internal",
    endPaddingType: "internal",
    values: {
      startPadding: paddingTop,
      startPaddingExternal: paddingTop,
      endPadding: paddingBottom,
      endPaddingExternal: paddingBottom,
    },
    isCentered: vPos === "center",
  });

  paddingLeft = horizontalPaddingInfo.startPadding;
  paddingRight = horizontalPaddingInfo.endPadding;
  paddingTop = verticalPaddingInfo.startPadding;
  paddingBottom = verticalPaddingInfo.endPadding;

  return {
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    fieldsVertical: verticalPaddingInfo.fields,
    fieldsHorizontal: horizontalPaddingInfo.fields,
    verticalPosition: vPos,
    horizontalPosition: hPos,
  };
}
