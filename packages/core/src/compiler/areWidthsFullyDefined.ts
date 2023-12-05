import { TrulyResponsiveValue, Devices } from "../types";

export function areWidthsFullyDefined(
  widths: TrulyResponsiveValue<number>,
  devices: Devices
): boolean {
  let areWidthsFullyDefined = true;

  devices.forEach((device) => {
    if (widths[device.id] === -1) {
      areWidthsFullyDefined = false;
    }
  });

  return areWidthsFullyDefined;
}
