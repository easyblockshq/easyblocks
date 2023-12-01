import { ResponsiveValue, TrulyResponsiveValue } from "../types";
import { isTrulyResponsiveValue } from "./isTrulyResponsiveValue";

export function responsiveValueIsNotNested<T>(
  resVal: ResponsiveValue<ResponsiveValue<T>>
): resVal is T | TrulyResponsiveValue<T> {
  // If scalar, then true
  if (!isTrulyResponsiveValue(resVal)) {
    return true;
  }

  for (const key in resVal) {
    if (key === "$res") {
      continue;
    }

    if (isTrulyResponsiveValue(resVal[key])) {
      return false;
    }
  }

  return true;
}
