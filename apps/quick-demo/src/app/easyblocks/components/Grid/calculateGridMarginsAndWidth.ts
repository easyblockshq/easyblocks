import { DeviceRange, spacingToPx } from "@easyblocks/core";
import { GridCompiledValues, GridParams } from "./Grid.types";

export function calculateGridMarginsAndWidth(args: {
  containerMargin: string;
  escapeMargin: boolean;
  containerMaxWidth: string;
  device: DeviceRange;
  $width: number;
  $widthAuto: boolean;
}) {
  const { containerMargin, escapeMargin, containerMaxWidth, device, $width } =
    args;

  const maxWidth = containerMaxWidth === "none" ? undefined : containerMaxWidth;

  let marginLeftCss = containerMargin;
  let marginRightCss = containerMargin;

  if (escapeMargin) {
    marginLeftCss = "0px";
    marginRightCss = "0px";
  }

  const marginLeftNumber = spacingToPx(marginLeftCss, device.w);
  const marginRightNumber = spacingToPx(marginRightCss, device.w);

  let hasMaxWidth: boolean;
  let widthWithoutMargins: number;

  const widthMinusMargins = $width - marginLeftNumber - marginRightNumber;

  if (typeof maxWidth === "number") {
    hasMaxWidth = true;
    widthWithoutMargins =
      maxWidth < widthMinusMargins ? maxWidth : widthMinusMargins;
  } else {
    hasMaxWidth = false;
    widthWithoutMargins = widthMinusMargins;
  }

  return {
    marginLeft: marginLeftCss,
    marginRight: marginRightCss,
    hasMaxWidth,
    maxWidth,
    widthWithoutMargins,
  };
}
