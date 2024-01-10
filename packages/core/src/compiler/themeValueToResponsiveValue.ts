import { isTrulyResponsiveValue } from "../responsiveness";
import { Devices, ResponsiveValue, TrulyResponsiveValue } from "../types";

export function themeScalarValueToResponsiveValue<T>(
  input: ResponsiveValue<T>,
  devices: Devices
): ResponsiveValue<T> {
  if (!isTrulyResponsiveValue(input)) {
    return input;
  }

  const output: TrulyResponsiveValue<T> = { $res: true };

  devices.forEach((device) => {
    const val = input[device.id];

    if (val !== undefined) {
      output[device.id] = val;
    }
  });

  return output;
}

export function themeObjectValueToResponsiveValue(
  input: { [key: string]: any },
  devices: Devices
): ResponsiveValue<{ [key: string]: any }> {
  const maxBreakpoint = devices[devices.length - 1].id;

  let output: ResponsiveValue<{ [key: string]: any }> = { $res: true };
  let defaultValue: { [key: string]: any } = {};

  if (isTrulyResponsiveValue(input)) {
    output = {
      ...input,
    };
  } else {
    defaultValue = {
      ...input,
    };
  }

  // Let's clear move default values and @initial values into max breakpoint
  const maxBreakpointValue: { [key: string]: any } = {};

  // most important is maxBreakpoint, then @default values
  Object.assign(maxBreakpointValue, defaultValue);
  Object.assign(maxBreakpointValue, output[maxBreakpoint]);

  if (Object.keys(maxBreakpointValue).length > 0) {
    output[maxBreakpoint] = maxBreakpointValue;
  }

  let lastActiveBreakpointValue = output[maxBreakpoint] || {};

  for (let i = devices.length - 2; i >= 0; i--) {
    const breakpoint = devices[i].id;

    if (!input[breakpoint]) {
      continue;
    }

    output[breakpoint] = {
      ...lastActiveBreakpointValue,
      ...output[breakpoint],
    };
    lastActiveBreakpointValue = output[breakpoint];
  }

  return output;
}
