import { ResponsiveValue, TrulyResponsiveValue } from "../types";

// Sorry for this name
export function isTrulyResponsiveValue<T>(
  x: ResponsiveValue<T>
): x is TrulyResponsiveValue<T> {
  return (
    typeof x === "object" &&
    x !== null &&
    !Array.isArray(x) &&
    (x as TrulyResponsiveValue<T>).$res === true
  );
}
