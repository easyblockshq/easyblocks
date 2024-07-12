import { DeviceRange, Devices } from "../types";
import { flattenResponsiveStyles } from "./flattenResponsiveStyles";

export function getBoxStyles(styles: { [key: string]: any }, devices: Devices) {
  const flattenStyles = flattenResponsiveStyles(styles);
  const ret: Record<string, any> = {};

  // First copy all the non-responsive values
  for (const key in flattenStyles) {
    if (!key.startsWith("@") && key !== "__isBox" && key !== "__hash") {
      ret[key] = flattenStyles[key];
    }
  }

  // now copy breakpoint values in correct order
  for (let i = devices.length - 1; i >= 0; i--) {
    const device = devices[i];
    const breakpoint = device.id;

    // correct order!
    if (flattenStyles["@" + breakpoint]) {
      const resolvedKey = resolveDeviceIdToMediaQuery(device);
      ret[resolvedKey] = flattenStyles["@" + breakpoint];
    }
  }

  return ret;
}

function resolveDeviceIdToMediaQuery(device: DeviceRange) {
  return `@media (max-width: ${device.breakpoint! - 1}px)`;
}
