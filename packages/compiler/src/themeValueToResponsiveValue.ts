import {
  Devices,
  ResponsiveValue,
  TrulyResponsiveValue,
} from "@easyblocks/core";

export function themeScalarValueToResponsiveValue<T>(
  input: T | { [key: string]: T },
  devices: Devices
): ResponsiveValue<T> {
  if (typeof input !== "object") {
    return input;
  }

  const objectInput = { ...input } as { [key: string]: T };

  const maxBreakpoint = devices[devices.length - 1].id;

  if (objectInput["@initial"] !== undefined) {
    // If max resolution range is defined and initial is also defined, max range wins
    if (objectInput["@" + maxBreakpoint] === undefined) {
      objectInput["@" + maxBreakpoint] = objectInput["@initial"];
    }
    delete objectInput["@initial"];
  }

  const output: TrulyResponsiveValue<T> = { $res: true };

  devices.forEach((device) => {
    const val = objectInput["@" + device.id];
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

  const output: ResponsiveValue<{ [key: string]: any }> = { $res: true };

  const defaultValue: { [key: string]: any } = {};

  let initial: { [key: string]: any } = {};

  for (const key in input) {
    // if breakpoint
    if (key.startsWith("@")) {
      if (devices.find((device) => device.id === key.substr(1))) {
        output[key.substr(1)] = input[key];
      } else if (key === "@initial") {
        initial = input[key];
      }
    }
    // if non-breakpoint, it's just a key of default value
    else {
      defaultValue[key] = input[key];
    }
  }

  // Let's clear move default values and @initial values into max breakpoint
  const maxBreakpointValue: { [key: string]: any } = {};

  // most important is maxBreakpoint, then @initial and at the end default values
  Object.assign(maxBreakpointValue, defaultValue);
  Object.assign(maxBreakpointValue, initial);
  Object.assign(maxBreakpointValue, output[maxBreakpoint]);

  if (Object.keys(maxBreakpointValue).length > 0) {
    output[maxBreakpoint] = maxBreakpointValue;
  }

  let lastActiveBreakpointValue = output[maxBreakpoint] || {};

  for (let i = devices.length - 2; i >= 0; i--) {
    const breakpoint = devices[i].id;

    if (!input["@" + breakpoint]) {
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
