import {
  CompilationContextType,
  responsiveValueSet,
} from "@easyblocks/app-utils";
import { DeviceRange, TrulyResponsiveValue } from "@easyblocks/core";
import { DecomposedValues, decomposeValues } from "./decomposeValues";

export type ResponsiveAutoCallback = (
  decomposedValues: DecomposedValues,
  extra: {
    config: Record<string, any>;
    compilationContext: CompilationContextType;
    device: DeviceRange;
    widths: TrulyResponsiveValue<number>;
  }
) => Record<string, any>;

export function responsiveAuto(
  inputValues: Record<string, any>,
  compilationContext: CompilationContextType,
  widths: TrulyResponsiveValue<number>,
  callback: ResponsiveAutoCallback
) {
  const values = { ...inputValues };

  compilationContext.devices.forEach((device) => {
    const decomposedValues = decomposeValues(
      inputValues,
      widths,
      compilationContext.devices,
      device.id
    );

    const result = callback(decomposedValues, {
      config: inputValues,
      device,
      compilationContext,
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
          compilationContext.devices
        );
      }
    }
  });

  return values;
}
