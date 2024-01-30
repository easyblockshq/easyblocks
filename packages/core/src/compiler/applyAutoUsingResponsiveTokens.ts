import {
  isTrulyResponsiveValue,
  responsiveValueForceGet,
  responsiveValueGet,
  responsiveValueGetHighestDefinedDevice,
} from "../responsiveness";
import { ResponsiveValue, TokenValue, TrulyResponsiveValue } from "../types";
import { CompilationContextType } from "./types";

export function applyAutoUsingResponsiveTokens<T>(
  input: TrulyResponsiveValue<TokenValue<ResponsiveValue<T>>>,
  compilationContext: CompilationContextType
): TrulyResponsiveValue<TokenValue<ResponsiveValue<T>>>;
export function applyAutoUsingResponsiveTokens<T>(
  input: TokenValue<ResponsiveValue<T>>,
  compilationContext: CompilationContextType
): TokenValue<ResponsiveValue<T>>;
export function applyAutoUsingResponsiveTokens<T>(
  input: ResponsiveValue<TokenValue<ResponsiveValue<T>>>,
  compilationContext: CompilationContextType
): ResponsiveValue<TokenValue<ResponsiveValue<T>>> {
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

  const inputAfterAuto: TrulyResponsiveValue<TokenValue<ResponsiveValue<T>>> = {
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

      highestDefinedValue = input[device.id] as TokenValue<ResponsiveValue<T>>;
    }
  }

  return inputAfterAuto;
}
