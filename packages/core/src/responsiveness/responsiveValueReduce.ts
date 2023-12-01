import { Devices, ResponsiveValue } from "../types";
import { isTrulyResponsiveValue } from "./isTrulyResponsiveValue";

export function responsiveValueReduce<T, AccT>(
  resVal: ResponsiveValue<T>,
  reducer: (previousValue: AccT, currentVal: T, deviceId?: string) => AccT,
  initialValue: AccT,
  devices: Devices
): AccT {
  if (!isTrulyResponsiveValue(resVal)) {
    return reducer(initialValue, resVal);
  }

  let result: AccT = initialValue;

  for (let i = 0; i < devices.length; i++) {
    const key = devices[i].id;

    if (resVal[key] === undefined) {
      continue;
    }

    result = reducer(result, resVal[key] as T, key);
  }

  return result;
}
