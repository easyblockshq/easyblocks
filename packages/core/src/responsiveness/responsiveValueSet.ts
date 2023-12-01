import { Devices, ResponsiveValue, TrulyResponsiveValue } from "../types";
import { isTrulyResponsiveValue } from "./isTrulyResponsiveValue";

export function responsiveValueSet<T>(
  responsiveValue: ResponsiveValue<T>,
  deviceId: string,
  value: T,
  devices: Devices
) {
  let trulyResponsive: TrulyResponsiveValue<T>;

  if (isTrulyResponsiveValue(responsiveValue)) {
    trulyResponsive = { ...responsiveValue };
  } else {
    trulyResponsive = {
      $res: true,
    };
    devices.forEach((device) => {
      trulyResponsive[device.id] = responsiveValue;
    });
  }

  return { ...trulyResponsive, [deviceId]: value };
}
