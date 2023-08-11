/**
 * This function is necessary because if we have Stitches styles object, its breakpoint values should be only on the top level.
 * We can have them nested so we need to transform styles object so that responsive styles goes to the top level.
 */

export function flattenResponsiveStyles(
  styles: Record<string, any>
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in styles) {
    const value = styles[key];

    if (key.startsWith("@")) {
      if (!result[key]) {
        result[key] = {};
      }

      result[key] = { ...result[key], ...value };
      continue;
    }

    if (typeof value === "object" && value !== null) {
      const flattenedValue = flattenResponsiveStyles(value);

      // MERGE

      const nonResponsiveValues: Record<string, any> = {};
      const responsiveValues: Record<string, any> = {};

      for (const key2 in flattenedValue) {
        const value2 = flattenedValue[key2];

        if (key2.startsWith("@")) {
          responsiveValues[key2] = value2;
        } else {
          nonResponsiveValues[key2] = value2;
        }
      }

      result[key] = nonResponsiveValues;

      for (const breakpoint in responsiveValues) {
        if (!result[breakpoint]) {
          result[breakpoint] = {};
        }

        result[breakpoint] = {
          ...result[breakpoint],
          [key]: responsiveValues[breakpoint],
        };
      }
    } else {
      result[key] = value;
    }
  }

  return result;
}
