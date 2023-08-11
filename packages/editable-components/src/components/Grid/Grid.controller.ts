import { spacingToPx } from "@easyblocks/app-utils";
import { DeviceRange } from "@easyblocks/core";
import { GridCompiledValues } from "./Grid.types";

export function gridContainerController(
  config: GridCompiledValues,
  containerWidth: number,
  device: DeviceRange
) {
  const escapeMargin = config.escapeMargin ?? true;

  let marginLeftCss = config.edgeLeftMargin ?? "0px";
  let marginRightCss = config.edgeRightMargin ?? "0px";

  if (escapeMargin) {
    marginLeftCss = "0px";
    marginRightCss = "0px";
  }

  const marginLeftNumber = spacingToPx(marginLeftCss, device.w);
  const marginRightNumber = spacingToPx(marginRightCss, device.w);

  let hasMaxWidth: boolean;
  let realWidth: number;

  const widthMinusMargins =
    containerWidth - marginLeftNumber - marginRightNumber;

  if (typeof config.maxWidth === "number") {
    hasMaxWidth = true;
    realWidth =
      config.maxWidth < widthMinusMargins ? config.maxWidth : widthMinusMargins;
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
  config: GridCompiledValues,
  $width: number,
  device: DeviceRange
) {
  const { marginRight, marginLeft, hasMaxWidth, realWidth } =
    gridContainerController(config, $width, device);

  const gap: number = spacingToPx(config.columnGap, device.w);
  const isSlider = config.variant === "slider";
  const numberOfItems = parseInt(config.numberOfItems);

  const itemsVisible =
    isSlider && device.id === "xs"
      ? numberOfItems + (parseFloat(config.fractionalItemWidth) - 1)
      : numberOfItems;

  const calculateCSSAbsoluteMargin = (margin: string) => {
    return hasMaxWidth
      ? `max(calc(calc(100% - ${config.maxWidth}px) / 2), ${margin})`
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
