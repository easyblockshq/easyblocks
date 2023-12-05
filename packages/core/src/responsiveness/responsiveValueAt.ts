import { TrulyResponsiveValue } from "../types";

/**
 * Because of how `TrulyResponsiveValue` is typed, if we try to access value at the current breakpoint it would return `true | T | undefined`.
 * The literal type `true` in this type shouldn't be included, because it makes no sense.
 * This comes from definition of `$res` property which is a special property that marks given object as responsive value instead of normal object.
 */
function responsiveValueAt<T>(
  responsiveValue: TrulyResponsiveValue<T>,
  breakpointIndex: string
): T | undefined {
  if (breakpointIndex === "$res") {
    throw new Error(
      "This situation isn't possible! Value of responsive value must be accessed by valid breakpoint name"
    );
  }

  const breakpointValue = responsiveValue[breakpointIndex] as Exclude<
    TrulyResponsiveValue<T>[string],
    boolean
  >;
  return breakpointValue;
}

export { responsiveValueAt };
