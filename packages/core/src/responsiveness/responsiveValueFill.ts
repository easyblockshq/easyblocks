import { getDeviceWidthPairs } from "../compiler/getDeviceWidthPairs";
import { Devices, ResponsiveValue, TrulyResponsiveValue } from "../types";
import { isTrulyResponsiveValue } from "./isTrulyResponsiveValue";

export function responsiveValueFill<T>(
  value: ResponsiveValue<T>,
  devices: Devices,
  widths: TrulyResponsiveValue<number>
): ResponsiveValue<T> {
  if (!isTrulyResponsiveValue(value)) {
    return value;
  }

  const componentWidths = getDeviceWidthPairs(widths, devices);
  const result = {
    ...value,
  };

  componentWidths.forEach(({ width, deviceId }, index) => {
    if (result[deviceId] === undefined) {
      // Let's look for a value up
      for (let i = index + 1; i < componentWidths.length; i++) {
        const valueForHigherWidth = result[componentWidths[i].deviceId];

        if (valueForHigherWidth !== undefined) {
          result[deviceId] = valueForHigherWidth;
          break;
        }
      }

      // If still undefined, let's look for a value down
      if (result[deviceId] === undefined) {
        for (let i = index - 1; i >= 0; i--) {
          const valueForLowerWidth = result[componentWidths[i].deviceId];

          if (valueForLowerWidth !== undefined) {
            result[deviceId] = valueForLowerWidth;
            break;
          }
        }
      }

      if (result[deviceId] === undefined) {
        throw new Error("Can't fill");
      }
    }
  });

  return result;
}
