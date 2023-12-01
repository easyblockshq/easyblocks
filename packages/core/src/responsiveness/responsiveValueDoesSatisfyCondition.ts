import { Devices, ResponsiveValue } from "../types";
import { isTrulyResponsiveValue } from "./isTrulyResponsiveValue";

export function responsiveValueDoesSatisfyCondition<T>(
  resVal: ResponsiveValue<T>,
  condition: (val: T) => boolean,
  devices: Devices,
  recursive?: boolean
): boolean {
  if (!isTrulyResponsiveValue(resVal)) {
    return condition(resVal);
  }

  for (let i = 0; i < devices.length; i++) {
    const key = devices[i].id;

    if (resVal[key] === undefined) {
      continue;
    }

    if (recursive && isTrulyResponsiveValue(resVal[key])) {
      if (
        !responsiveValueDoesSatisfyCondition(
          resVal[key] as ResponsiveValue<T>,
          condition,
          devices,
          recursive
        )
      ) {
        return false;
      }
    } else {
      if (!condition(resVal[key] as T)) {
        return false;
      }
    }
  }

  return true;
}
