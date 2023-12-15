import {
  DeviceRange,
  Devices,
  TrulyResponsiveValue,
  responsiveValueSet,
} from "@easyblocks/core";
import { DecomposedValues, decomposeValues } from "./decomposeValues";

export type ResponsiveAutoCallback = (
  decomposedValues: DecomposedValues,
  extra: {
    config: Record<string, any>;
    devices: Devices;
    device: DeviceRange;
    widths: TrulyResponsiveValue<number>;
  }
) => Record<string, any>;

export function responsiveAuto(
  inputValues: Record<string, any>,
  devices: Devices,
  widths: TrulyResponsiveValue<number>,
  callback: ResponsiveAutoCallback
) {
  const values = { ...inputValues };

  devices.forEach((device) => {
    const decomposedValues = decomposeValues(
      inputValues,
      widths,
      devices,
      device.id
    );

    const result = callback(decomposedValues, {
      config: inputValues,
      device,
      devices,
      widths,
    });

    for (const prop in result) {
      if (values[prop] === undefined) {
        values[prop] = {
          $res: true,
          [device.id]: result[prop],
        };
      } else {
        values[prop] = responsiveValueSet(
          values[prop],
          device.id,
          result[prop],
          devices
        );
      }
    }
  });

  return values;
}
