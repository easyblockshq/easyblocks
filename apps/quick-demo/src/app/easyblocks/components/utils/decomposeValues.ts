import {
  DeviceRange,
  Devices,
  ResponsiveValue,
  TrulyResponsiveValue,
  isTrulyResponsiveValue,
  responsiveValueFindDeviceWithDefinedValue,
  responsiveValueFindHigherDeviceWithDefinedValue,
  responsiveValueFindLowerDeviceWithDefinedValue,
  responsiveValueGetDefinedValue,
  responsiveValueGetFirstHigherValue,
  responsiveValueGetFirstLowerValue,
} from "@easyblocks/core";

export type ValueForWidth = { value: any; width: number; device: DeviceRange };

export type DecomposedValues = {
  values: Record<string, any>;
  width: number;
  lowerDefinedValues: Record<string, ValueForWidth>;
  higherDefinedValues: Record<string, ValueForWidth>;
  closestDefinedValues: Record<string, ValueForWidth>;
};

export function decomposeValues(
  config: Record<string, any>,
  widths: TrulyResponsiveValue<number>,
  devices: Devices,
  deviceId: string
): DecomposedValues {
  const width = widths[deviceId]! as number;
  const device = devices.find((device) => device.id === deviceId)!;

  const result: DecomposedValues = {
    values: {},
    width,
    lowerDefinedValues: {},
    higherDefinedValues: {},
    closestDefinedValues: {},
  };

  for (const key in config) {
    const value: ResponsiveValue<any> = config[key];

    if (!isTrulyResponsiveValue(value)) {
      result.values[key] = value;

      const definedValues = {
        value,
        width,
        device,
      };

      result.closestDefinedValues[key] = definedValues;
      result.lowerDefinedValues[key] = definedValues;
      result.higherDefinedValues[key] = definedValues;
    } else {
      result.values[key] = isTrulyResponsiveValue(value)
        ? value[deviceId]
        : value;

      const defaultDefinedDevice = responsiveValueFindDeviceWithDefinedValue(
        value,
        deviceId,
        devices,
        widths
      );

      if (defaultDefinedDevice) {
        result.closestDefinedValues[key] = {
          value: responsiveValueGetDefinedValue(
            value,
            deviceId,
            devices,
            widths
          ),
          width: responsiveValueGetDefinedValue(
            widths,
            defaultDefinedDevice.id,
            devices,
            widths
          )!,
          device: defaultDefinedDevice,
        };
      }

      const lowerDefinedDevice = responsiveValueFindLowerDeviceWithDefinedValue(
        value,
        deviceId,
        devices,
        widths
      );

      if (lowerDefinedDevice) {
        result.lowerDefinedValues[key] = {
          value: responsiveValueGetFirstLowerValue(
            value,
            deviceId,
            devices,
            widths
          ),
          width: responsiveValueGetDefinedValue(
            widths,
            lowerDefinedDevice.id,
            devices,
            widths
          )!,
          device: lowerDefinedDevice,
        };
      }

      const higherDefinedDevice =
        responsiveValueFindHigherDeviceWithDefinedValue(
          value,
          deviceId,
          devices,
          widths
        );

      if (higherDefinedDevice) {
        result.higherDefinedValues[key] = {
          value: responsiveValueGetFirstHigherValue(
            value,
            deviceId,
            devices,
            widths
          ),
          width: responsiveValueGetDefinedValue(
            widths,
            higherDefinedDevice.id,
            devices,
            widths
          )!,
          device: higherDefinedDevice,
        };
      }
    }
  }

  return result;
}
