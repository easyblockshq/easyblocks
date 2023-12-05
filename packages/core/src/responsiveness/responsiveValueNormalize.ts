import { Devices, ResponsiveValue, TrulyResponsiveValue } from "../types";
import { isTrulyResponsiveValue } from "./isTrulyResponsiveValue";

export function responsiveValueNormalize<T>(
  arg: ResponsiveValue<T>,
  devices: Devices
): ResponsiveValue<T> {
  if (!isTrulyResponsiveValue(arg)) {
    return arg;
  }

  let previousVal: any = undefined;

  const ret: TrulyResponsiveValue<any> = {
    $res: true,
  };

  let numberOfDefinedValues = 0;

  for (let i = devices.length - 1; i >= 0; i--) {
    const breakpoint = devices[i].id;
    const val = arg[breakpoint];

    // TODO: if values are objects, it's to do
    if (typeof val === "object" && val !== null) {
      if (JSON.stringify(val) !== JSON.stringify(previousVal)) {
        ret[breakpoint] = val;
        previousVal = val;
        numberOfDefinedValues++;
      }
    } else {
      if (val !== undefined && val !== previousVal) {
        ret[breakpoint] = val;
        previousVal = val;
        numberOfDefinedValues++;
      }
    }

    // [x, null, null, y] => [x, y]
    if (i < devices.length - 1) {
      const nextBreakpoint = devices[i + 1].id;

      if (
        numberOfDefinedValues === 1 &&
        ret[breakpoint] === undefined &&
        ret[nextBreakpoint] !== undefined
      ) {
        ret[breakpoint] = ret[nextBreakpoint];
        delete ret[nextBreakpoint];
      }
    }
  }

  if (numberOfDefinedValues === 1) {
    return ret[devices[0].id];
  }

  return ret;
}
