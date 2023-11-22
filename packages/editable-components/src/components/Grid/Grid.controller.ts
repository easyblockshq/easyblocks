import { spacingToPx } from "@easyblocks/app-utils";
import { DeviceRange } from "@easyblocks/core";
import { GridCompiledValues, GridParams } from "./Grid.types";

export function gridContainerController(
  params: GridParams,
  device: DeviceRange
) {
  const escapeMargin = params.escapeMargin ?? true;

  let marginLeftCss = params.edgeLeftMargin ?? "0px";
  let marginRightCss = params.edgeRightMargin ?? "0px";

  if (escapeMargin) {
    marginLeftCss = "0px";
    marginRightCss = "0px";
  }

  const marginLeftNumber = spacingToPx(marginLeftCss, device.w);
  const marginRightNumber = spacingToPx(marginRightCss, device.w);

  let hasMaxWidth: boolean;
  let realWidth: number;

  const widthMinusMargins =
    params.$width - marginLeftNumber - marginRightNumber;

  if (typeof params.maxWidth === "number") {
    hasMaxWidth = true;
    realWidth =
      params.maxWidth < widthMinusMargins ? params.maxWidth : widthMinusMargins;
  } else {
    hasMaxWidth = false;
    realWidth = widthMinusMargins;
  }

  return {
    marginLeft: marginLeftCss,
    marginRight: marginRightCss,
    hasMaxWidth,
    realWidth,
  };
}

export function gridController(
  values: GridCompiledValues,
  params: GridParams,
  device: DeviceRange
) {
  const { marginRight, marginLeft, hasMaxWidth, realWidth } =
    gridContainerController(params, device);

  const gap: number = spacingToPx(values.columnGap, device.w);
  const isSlider = values.variant === "slider";
  const numberOfItems = parseInt(values.numberOfItems);

  const itemsVisible =
    isSlider && device.id === "xs"
      ? numberOfItems + (parseFloat(values.fractionalItemWidth) - 1)
      : numberOfItems;

  const calculateCSSAbsoluteMargin = (margin: string) => {
    return hasMaxWidth
      ? `max(calc(calc(100% - ${params.maxWidth}px) / 2), ${margin})`
      : margin;
  };

  const cssAbsoluteLeftPosition = calculateCSSAbsoluteMargin(marginLeft);
  const cssAbsoluteRightPosition = calculateCSSAbsoluteMargin(marginRight);

  const $widthItem = (realWidth - gap * (itemsVisible - 1)) / itemsVisible;

  return {
    cssAbsoluteLeftPosition,
    cssAbsoluteRightPosition,
    itemsVisible,
    $widthItem,
    $width: realWidth,
  };
}
