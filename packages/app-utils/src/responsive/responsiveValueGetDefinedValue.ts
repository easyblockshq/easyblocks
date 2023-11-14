import {
  responsiveValueFindDeviceWithDefinedValue,
  responsiveValueFindHigherDeviceWithDefinedValue,
  responsiveValueFindLowerDeviceWithDefinedValue,
} from "./responsiveValueFindDeviceWithDefinedValue";
import { isTrulyResponsiveValue } from "./isTrulyResponsiveValue";
import {
  TrulyResponsiveValue,
  Devices,
  ResponsiveValue,
} from "@easyblocks/core";

export function responsiveValueGetFirstHigherValue<T>(
  value: TrulyResponsiveValue<T>,
  breakpoint: string,
  devices: Devices,
  widths: TrulyResponsiveValue<number>
) {
  const higherDefinedDevice = responsiveValueFindHigherDeviceWithDefinedValue(
    value,
    breakpoint,
    devices,
    widths
  );

  if (!higherDefinedDevice) {
    return;
  }

  return value[higherDefinedDevice.id] as T;
}

export function responsiveValueGetFirstLowerValue<T>(
  value: TrulyResponsiveValue<T>,
  breakpoint: string,
  devices: Devices,
  widths: TrulyResponsiveValue<number>
) {
  const lowerDefinedDevice = responsiveValueFindLowerDeviceWithDefinedValue(
    value,
    breakpoint,
    devices,
    widths
  );
  if (!lowerDefinedDevice) {
    return;
  }

  return value[lowerDefinedDevice.id] as T;
}

export function responsiveValueGetDefinedValue<T>(
  value: ResponsiveValue<T>,
  breakpoint: string,
  devices: Devices,
  widths?: TrulyResponsiveValue<number>
) {
  if (!isTrulyResponsiveValue(value)) {
    return value;
  }

  const definedDevice = responsiveValueFindDeviceWithDefinedValue(
    value,
    breakpoint,
    devices,
    widths
  );

  if (!definedDevice) {
    return;
  }

  return value[definedDevice.id] as T;
}
