import { Devices, ResponsiveValue } from "@easyblocks/core";
import React from "react";
import { isTrulyResponsiveValue } from "./isTrulyResponsiveValue";

export function responsiveValueToSelectivelyDisplayedComponents<T>(
  input: ResponsiveValue<T | undefined>,
  callback: (
    arg: T | undefined,
    breakpointIndex?: string
  ) => React.ReactElement,
  devices: Devices,
  stitches: any,
  removeFromDom?: boolean
): React.ReactElement[] | React.ReactElement {
  if (!isTrulyResponsiveValue(input)) {
    return callback(input);
  }

  const rangesWithValues: Array<{
    from: number;
    to: number | null;
    value: T | undefined;
    breakpointIndex: string;
  }> = [];

  devices.forEach((device) => {
    if (!(device.id in input)) {
      return;
    }

    const value = input[device.id] as T | undefined;

    if (rangesWithValues.length === 0) {
      rangesWithValues.push({
        from: 0,
        to: device.breakpoint,
        value,
        breakpointIndex: device.id,
      });
    } else {
      rangesWithValues.push({
        from: rangesWithValues[rangesWithValues.length - 1].to! + 1,
        to: device.breakpoint,
        value,
        breakpointIndex: device.id,
      });
    }
  });

  if (rangesWithValues.length === 0) {
    throw new Error("should never happen");
  }

  if (rangesWithValues.length === 1) {
    return callback(rangesWithValues[0].value);
  }

  rangesWithValues[rangesWithValues.length - 1].to = 99999;

  const elements: React.ReactElement[] = [];

  rangesWithValues.forEach(({ from, to, value, breakpointIndex }) => {
    const mediaString = `(min-width: ${from}px) and (max-width: ${to! - 1}px)`;

    const displayStyles = stitches.css({
      display: "none",
      [`@media ${mediaString}`]: {
        display: "contents",
      },
    });

    // If removeFromDOM is set then we remove from DOM unnecessary items
    if (!(removeFromDom && !window.matchMedia(mediaString).matches)) {
      elements.push(
        <div className={displayStyles()} key={mediaString}>
          {callback(value, breakpointIndex)}
        </div>
      );
    }
  });

  return elements;
}
