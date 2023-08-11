import { Devices, TrulyResponsiveValue } from "@easyblocks/core";
import { responsiveValueForceGet } from "./responsive/responsiveValueGet";

export type DeviceWidthPair = {
  width: number;
  deviceId: string;
};

export type DeviceWidthPairs = DeviceWidthPair[];

export function getDeviceWidthPairs(
  widths: TrulyResponsiveValue<number>,
  devices: Devices
): DeviceWidthPairs {
  const componentWidths: DeviceWidthPairs = [];

  for (const key in widths) {
    if (key === "$res") {
      continue;
    }
    componentWidths.push({
      width: responsiveValueForceGet(widths, key),
      deviceId: key,
    });
  }

  componentWidths.sort((x, y) => {
    if (x.width === y.width) {
      const xDevicesIndex = devices.findIndex((d) => d.id === x.deviceId);
      const yDevicesIndex = devices.findIndex((d) => d.id === y.deviceId);
      return xDevicesIndex > yDevicesIndex ? 1 : -1;
    }

    return x.width === y.width ? 0 : x.width > y.width ? 1 : -1;
  });

  return componentWidths;
}

export function getDeviceWidthPairsFromDevices(devices: Devices) {
  return devices.map((d) => ({
    width: d.w,
    deviceId: d.id,
  }));
}
