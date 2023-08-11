import { getDevicesWidths } from "../devices";
import { responsiveValueGetHighestDefinedDevice } from "./responsiveValueGetHighestDefinedDevice";
import { responsiveValueGetDefinedValue } from "./responsiveValueGetDefinedValue";
import { isTrulyResponsiveValue } from "./isTrulyResponsiveValue";
import {
  ResponsiveValue,
  Devices,
  TrulyResponsiveValue,
} from "@easyblocks/core";

// Flattens recursively (max 2 levels)
export function responsiveValueFlatten<T>(
  resVal: ResponsiveValue<ResponsiveValue<T>>,
  devices: Devices
): ResponsiveValue<T> {
  if (!isTrulyResponsiveValue(resVal)) {
    return resVal;
  }

  const result: ResponsiveValue<T> = {
    $res: true,
  };

  let activeNestedValue: TrulyResponsiveValue<T> | undefined = undefined;

  // resValCopy has maximum breakpoint always set correctly, otherwise if we have b1, ..., b5 and responsive value is set to b4, then values ABOVE b4 won't be set.
  const resValCopy = { ...resVal };
  const maxDeviceInValue = responsiveValueGetHighestDefinedDevice(
    resValCopy,
    devices
  );
  const maxBreakpoint = devices[devices.length - 1].id;

  // Important condition. Sometimes if b5 is missing, b3 can be responsive and have b5 inside. Then b5 is defined.
  if (
    !resValCopy[maxBreakpoint] &&
    isTrulyResponsiveValue(resValCopy[maxDeviceInValue.id])
  ) {
    activeNestedValue = resValCopy[
      maxDeviceInValue.id
    ] as TrulyResponsiveValue<T>;
  }

  for (let i = devices.length - 1; i >= 0; i--) {
    const breakpoint = devices[i].id;
    const value = resValCopy[breakpoint];

    if (value === undefined) {
      // If active nested value, we take from nested value;
      if (
        activeNestedValue !== undefined &&
        activeNestedValue[breakpoint] !== undefined
      ) {
        result[breakpoint] = responsiveValueGetDefinedValue(
          activeNestedValue,
          breakpoint,
          devices,
          getDevicesWidths(
            devices
          ) /** FOR NOW TOKENS ARE ALWAYS RELATIVE TO SCREEN WIDTH */
        )!;
      }
      continue;
    } else if (!isTrulyResponsiveValue(value as ResponsiveValue<T>)) {
      activeNestedValue = undefined;
      result[breakpoint] = value as T;
    } else {
      activeNestedValue = value as TrulyResponsiveValue<T>;
      result[breakpoint] = responsiveValueGetDefinedValue(
        activeNestedValue,
        breakpoint,
        devices,
        getDevicesWidths(
          devices
        ) /** FOR NOW TOKENS ARE ALWAYS RELATIVE TO SCREEN WIDTH */
      )!;
    }
  }

  return result;
}
