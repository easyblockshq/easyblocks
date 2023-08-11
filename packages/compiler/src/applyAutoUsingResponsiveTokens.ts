import {
  RefValue,
  ResponsiveValue,
  TrulyResponsiveValue,
} from "@easyblocks/core";
import {
  CompilationContextType,
  responsiveValueGetHighestDefinedDevice,
  responsiveValueForceGet,
  responsiveValueGet,
  isTrulyResponsiveValue,
} from "@easyblocks/app-utils";

export function applyAutoUsingResponsiveTokens<T>(
  input: TrulyResponsiveValue<RefValue<ResponsiveValue<T>>>,
  compilationContext: CompilationContextType
): TrulyResponsiveValue<RefValue<ResponsiveValue<T>>>;
export function applyAutoUsingResponsiveTokens<T>(
  input: RefValue<ResponsiveValue<T>>,
  compilationContext: CompilationContextType
): RefValue<ResponsiveValue<T>>;

export function applyAutoUsingResponsiveTokens<T>(
  input: ResponsiveValue<RefValue<ResponsiveValue<T>>>,
  compilationContext: CompilationContextType
): ResponsiveValue<RefValue<ResponsiveValue<T>>> {
  if (!isTrulyResponsiveValue(input)) {
    return input;
  }

  const highestDefinedDevice = responsiveValueGetHighestDefinedDevice(
    input,
    compilationContext.devices
  );
  let highestDefinedValue = responsiveValueForceGet(
    input,
    highestDefinedDevice.id
  );

  const inputAfterAuto: TrulyResponsiveValue<RefValue<ResponsiveValue<T>>> = {
    $res: true,
  };

  for (let i = compilationContext.devices.length - 1; i >= 0; i--) {
    const device = compilationContext.devices[i];
    const value = responsiveValueGet(input, device.id);

    if (
      value === undefined &&
      isTrulyResponsiveValue(highestDefinedValue.value)
    ) {
      inputAfterAuto[device.id] = highestDefinedValue;
    }

    if (value !== undefined) {
      inputAfterAuto[device.id] = value;

      highestDefinedValue = input[device.id] as RefValue<ResponsiveValue<T>>;
    }
  }

  return inputAfterAuto;
}
