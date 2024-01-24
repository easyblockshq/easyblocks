import { isTrulyResponsiveValue } from "../responsiveness";
import { Devices, ResponsiveValue, TrulyResponsiveValue } from "../types";

export function themeScalarValueToResponsiveValue<T>(
  input: ResponsiveValue<T>,
  devices: Devices
): ResponsiveValue<T> {
  if (!isTrulyResponsiveValue(input)) {
    return input;
  }

  const output: TrulyResponsiveValue<T> = { $res: true };

  devices.forEach((device) => {
    const val = input[device.id];

    if (val !== undefined) {
      output[device.id] = val;
    }
  });

  return output;
}
